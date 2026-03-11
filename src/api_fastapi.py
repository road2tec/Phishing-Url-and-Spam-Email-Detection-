from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pickle
import os
import numpy as np
import joblib
from urllib.parse import urlparse
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Feature Flags
# Feature Flags
ENABLE_EMAIL_ANALYSIS = os.getenv("ENABLE_EMAIL_ANALYSIS", "true").lower() == "true"

from .analysis_engine import (
    fetch_live_html, extract_suspicious_snippets, analyze_phishing,
    extract_email_signals, analyze_email_phishing, extract_dom_tree
)
from .feature_url import extract_url_features
import shap
import lime
import lime.lime_tabular
import warnings
warnings.filterwarnings("ignore")

app = FastAPI()

# Enable CORS for browser extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- MongoDB Configuration ---
# MONGO_URI = "mongodb+srv://punamproject:punamproject%40123@road2tech.vajimqu.mongodb.net/?appName=road2tech"
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    # Force a connection check
    client.admin.command('ping')
    # Use the database name from URI if provided, else fallback to 'phishing_detector'
    db = client.get_database() if client.get_database().name != 'test' else client['phishing_detector']
    history_collection = db['scan_history']
    blocklist_collection = db['blocklist']
    print("Connected to MongoDB successfully!")
except Exception as e:
    print(f"CRITICAL: MongoDB is NOT running at {MONGO_URI}. Please start MongoDB service.")
    history_collection = None
    blocklist_collection = None

# DATA FLOW: URL → HTML Fetch → Analysis → Unified Risk Score → Auto Blocklist → Extension Enforcement

def log_to_db(type, input, prediction, score, reasons, user_id=None):
    if history_collection is not None:
        try:
            doc = {
                "type": type,
                "input": input,
                "prediction": prediction,
                "risk_score": score,
                "reasons": reasons,
                "timestamp": datetime.utcnow()
            }
            if user_id:
                doc["user_id"] = user_id
                
            history_collection.insert_one(doc)
        except Exception as e:
            print(f"Failed to log to MongoDB: {e}")

class PredictionRequest(BaseModel):
    url: str
    email_text: str = ""
    html: str = ""
    user_id: str = None

class URLRequest(BaseModel):
    url: str

class EmailRequest(BaseModel):
    email_text: str
    user_id: str = None

# Load URL Random Forest model (Rule-based features)
model_path = "model/rf_model.pkl"
background_path = "model/background_data.pkl"
model = None
explainer_shap = None
explainer_lime = None
background_data = None

if os.path.exists(model_path):
    try:
        with open(model_path, "rb") as f:
            model = pickle.load(f)
        print(f"ML Model loaded from {model_path}")
        
        # Load background data for LIME/SHAP
        if os.path.exists(background_path):
            with open(background_path, "rb") as f:
                background_data = pickle.load(f)
            
            # Initialize explainers
            # SHAP
            explainer_shap = shap.TreeExplainer(model)
            
            # LIME
            feature_names = ["url_length", "domain_length", "dot_count", "digit_count", "has_ip", "is_https", "susp_keywords"]
            # Convert background data to numpy for LIME
            if hasattr(background_data, 'values'):
                bg_values = background_data.values
            else:
                bg_values = background_data
                
            explainer_lime = lime.lime_tabular.LimeTabularExplainer(
                bg_values,
                mode='classification',
                feature_names=feature_names,
                class_names=['Legitimate', 'Phishing'],
                discretize_continuous=True
            )
            print("Explainable AI engines (SHAP/LIME) initialized.")
    except Exception as e:
        print(f"Failed to load ML artifacts: {e}")
        model = None
else:
    print(f"Warning: URL model not found at {model_path}")
    model = None

# Load Pretrained Email ML Model
email_model_path = "model/phishing_detector.pkl"
try:
    if os.path.exists(email_model_path):
        with open(email_model_path, "rb") as f:
            email_ml_model = pickle.load(f)
        print(f"Pretrained Email ML Model loaded successfully from {email_model_path}!")
    else:
        print(f"Warning: Email ML model not found at {email_model_path}")
        email_ml_model = None
except Exception as e:
    print(f"Warning: Could not load pretrained email model from {email_model_path}: {e}")
    # Fallback to joblib if pickle fails (compatibility)
    try:
        email_ml_model = joblib.load(email_model_path)
        print("Loaded with joblib fallback.")
    except:
        email_ml_model = None

def simple_url_features(url):
    """Enhanced phishing detection using multiple heuristics"""
    try:
        url_lower = url.lower()
        parsed = urlparse(url_lower)
        domain = parsed.netloc
        path = parsed.path
        
        risk_score = 0
        
        # 1. Suspicious keywords (banking, payment, verification)
        suspicious_keywords = [
            'paypal', 'bank', 'signin', 'login', 'verify', 'account', 
            'secure', 'update', 'confirm', 'password', 'billing', 'ebay',
            'amazon', 'apple', 'microsoft', 'google', 'facebook', 'netflix',
            'suspended', 'locked', 'unusual', 'alert', 'support-help'
        ]
        keyword_matches = sum(1 for word in suspicious_keywords if word in url_lower)
        if keyword_matches >= 2:
            risk_score += 3
        elif keyword_matches == 1:
            risk_score += 1
            
        # 2. Multiple domains in path (e.g., example.com/realbank.com/)
        if '/' in path and any(tld in path for tld in ['.com', '.net', '.org', '.co.uk', '.co.nz']):
            risk_score += 3
            
        # 3. IP address in URL
        ip_pattern = domain.replace('.', '').replace(':', '')
        if ip_pattern.isdigit() or any(c.isdigit() for c in domain.split('.')[0] if len(domain.split('.')[0]) > 0):
            if sum(c.isdigit() for c in domain) > len(domain) * 0.3:
                risk_score += 2
                
        # 4. Excessive subdomains
        subdomain_count = domain.count('.')
        if subdomain_count > 3:
            risk_score += 2
        elif subdomain_count > 2:
            risk_score += 1
            
        # 5. Suspicious TLDs
        suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work', '.click', '.link']
        if any(url_lower.endswith(tld) for tld in suspicious_tlds):
            risk_score += 2
            
        # 6. Excessive hyphens
        if domain.count('-') >= 3:
            risk_score += 2
        elif domain.count('-') >= 2:
            risk_score += 1
            
        # 7. Long URL
        if len(url) > 100:
            risk_score += 2
        elif len(url) > 75:
            risk_score += 1
            
        # 8. @ symbol in URL (often used in phishing)
        if '@' in url:
            risk_score += 3
            
        # 9. HTTPS but suspicious domain
        if url_lower.startswith('http://') and any(word in url_lower for word in ['secure', 'banking', 'paypal']):
            risk_score += 2
            
        # 10. Unusual port numbers
        if ':' in domain and any(port in domain for port in [':8080', ':8000', ':3000', ':5000']):
            risk_score += 1
            
        # 11. Blogspot, free hosting in financial context
        free_hosts = ['blogspot', 'wordpress', 'wixsite', 'weebly', 'tripod']
        if any(host in domain for host in free_hosts):
            if any(word in url_lower for word in ['paypal', 'bank', 'secure', 'account']):
                risk_score += 3
                
        # 12. Suspicious patterns
        if 'limited' in domain and any(num.isdigit() for num in domain):
            risk_score += 2
            
        # Classification threshold
        return 1 if risk_score >= 3 else 0
    except Exception as e:
        print(f"Error in url analysis: {e}")
        return 0

def analyze_text_content(text):
    """Analyze email/text content for phishing indicators"""
    if not text or len(text) < 10:
        return 0
        
    text_lower = text.lower()
    risk_score = 0
    
    # Spam/phishing keywords
    spam_keywords = [
        'urgent', 'winner', 'congratulations', 'free money', 'lottery', 
        'viagra', 'cialis', 'weight loss', 'enlarge', 'click here',
        'act now', 'limited time', 'expire', 'suspended account',
        'verify your account', 'confirm your identity', 'unusual activity',
        'security alert', 'your account will be closed', 'reset password',
        'prize', 'million dollars', 'inheritance', 'beneficiary',
        'toll-free', 'call now', 'click below', 'update payment'
    ]
    
    keyword_count = sum(1 for word in spam_keywords if word in text_lower)
    if keyword_count >= 3:
        risk_score += 3
    elif keyword_count >= 2:
        risk_score += 2
    elif keyword_count == 1:
        risk_score += 1
        
    # Excessive exclamation marks
    if text.count('!') > 3:
        risk_score += 1
        
    # ALL CAPS text (common in spam)
    words = text.split()
    caps_words = sum(1 for w in words if len(w) > 3 and w.isupper())
    if caps_words > len(words) * 0.3:
        risk_score += 2
        
    return risk_score

def analyze_html_content(html):
    """Analyze HTML content for phishing indicators"""
    if not html or len(html) < 10:
        return 0, False
        
    html_lower = html.lower()
    risk_score = 0
    has_password_field = False
    
    # Check for password input fields (CRITICAL - immediate phishing indicator)
    if 'type=\'password\'' in html_lower or 'type="password"' in html_lower or 'password' in html_lower:
        risk_score += 10  # Very high score
        has_password_field = True
        
    # Check for forms
    if '<form' in html_lower:
        risk_score += 1
        
    # Check for iframes (can be used to hide content)
    if '<iframe' in html_lower:
        risk_score += 2
        
    # Suspicious form actions
    suspicious_actions = ['submit', 'login', 'signin', 'verify', 'update']
    if any(action in html_lower for action in suspicious_actions):
        risk_score += 1
        
    # Hidden inputs (can be malicious)
    if 'type="hidden"' in html_lower or "type='hidden'" in html_lower:
        risk_score += 1
        
    # JavaScript suspicious patterns
    if '<script' in html_lower:
        if 'document.location' in html_lower or 'window.location' in html_lower:
            risk_score += 2
            
    return risk_score, has_password_field

@app.get("/")
def root():
    return {
        "status": "API is running", 
        "model_loaded": model is not None,
        "features": {
            "email_analysis": ENABLE_EMAIL_ANALYSIS
        }
    }

@app.post("/predict")
def predict(data: PredictionRequest):
    try:
        # Analyze all three components
        url_risk = simple_url_features(data.url)
        text_risk = analyze_text_content(data.email_text)
        html_risk, has_password = analyze_html_content(data.html)
        
        # Simple rule: If ANY component indicates phishing, classify as phishing
        
        # CRITICAL: If HTML contains password field, it's ALWAYS phishing
        if has_password:
            return {"prediction": "phishing"}
        
        # If URL is phishing
        if url_risk == 1:
            return {"prediction": "phishing"}
        
        # If text has ANY phishing indicators (text_risk >= 1)
        if text_risk >= 2:
            return {"prediction": "phishing"}
        
        # If HTML has significant phishing indicators
        if html_risk >= 3:
            return {"prediction": "phishing"}
        
        # Otherwise legitimate
        result = "legitimate"
        log_to_db("predict_v1", data.url, result, 0 if result == "legitimate" else 100, [])
        return {"prediction": result}
    except Exception as e:
        print(f"Error in prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

# --- New Enhanced Endpoints for React Frontend ---

@app.post("/api/fetch-url")
def api_fetch_url(data: URLRequest):
    html = fetch_live_html(data.url)
    if html.startswith("Error") or "Unable to fetch" in html:
        raise HTTPException(status_code=400, detail=html)
    return {"html": html}

@app.post("/api/extract-url-signals")
def api_extract_url_signals(data: PredictionRequest):
    # If HTML is not provided, fetch it (fallback)
    html = data.html
    if not html and data.url:
        html = fetch_live_html(data.url)
    
    snippets = extract_suspicious_snippets(html)
    return {"snippets": snippets}

@app.post("/api/fetch-dom-tree")
def api_fetch_dom_tree(data: PredictionRequest):
    html = data.html
    if not html and data.url:
        html = fetch_live_html(data.url)
    
    tree = extract_dom_tree(html)
    return {"dom_tree": tree}

@app.post("/api/analyze-url")
def api_analyze_url(data: PredictionRequest):
    """
    Main Analysis Flow:
    1. Fetch HTML
    2. Analyze for phishing (ML + Rules + HTML)
    3. If risk >= 80, automatically add to blocklist
    4. Store in scan history
    """
    html = data.html
    if not html and data.url:
        html = fetch_live_html(data.url)
    
    prediction, score, reasons = analyze_phishing(data.url, html)
    
    
    # --- ML Integration & Explainability ---
    ml_prediction = "Unknown"
    ml_confidence = 0.0
    explanation = {"top_features": []}
    
    if model:
        try:
            # Extract features for ML
            feats = extract_url_features(data.url)
            # Ensure order matches training
            feature_order = ["url_length", "domain_length", "dot_count", "digit_count", "has_ip", "is_https", "susp_keywords"]
            input_vector = [feats[f] for f in feature_order]
            input_df = pd.DataFrame([input_vector], columns=feature_order)
            
            # Predict
            pred_class = model.predict(input_df)[0] # 0 or 1
            ml_prediction = "phishing" if pred_class == 1 else "legitimate"
            
            # Confidence
            probs = model.predict_proba(input_df)[0]
            ml_confidence = float(probs[1]) if pred_class == 1 else float(probs[0])
            
            # Explainability (SHAP)
            if explainer_shap:
                shap_values = explainer_shap.shap_values(input_df)
                
                # Robust handling of SHAP output shapes
                # Case 1: List of arrays [class0, class1]
                if isinstance(shap_values, list):
                    sv = shap_values[1][0] # Class 1 (Phishing), Sample 0
                
                # Case 2: 3D Array (samples, features, classes) -> (1, 7, 2)
                elif len(np.array(shap_values).shape) == 3:
                    sv = np.array(shap_values)[0, :, 1] # Sample 0, All Feats, Class 1
                    
                # Case 3: 2D Array (samples, features) -> (1, 7)
                else:
                    sv = np.array(shap_values)[0]

                # Get top features
                feature_importance = zip(feature_order, sv)
                sorted_features = sorted(feature_importance, key=lambda x: abs(x[1]), reverse=True)
                
                top_features = []
                for name, val in sorted_features[:3]:
                    impact = "Increases Risk" if val > 0 else "Decreases Risk"
                    # Get the actual value for the feature
                    feature_value = feats.get(name, "N/A")
                    top_features.append(f"{name}: {feature_value} ({impact})")
                
                explanation["top_features"] = top_features
                
        except Exception as e:
            print(f"ML/Explainability Error: {e}")
    
    # Decision: Use ML prediction if available and high confidence, otherwise fallback to heuristics
    # The user rule: "Blocking must happen only when phishing is detected"
    
    # Overwrite unified score if ML is confident
    final_prediction = prediction
    final_score = score
    
    if ml_prediction == "phishing" and ml_confidence > 0.6:
        final_prediction = "Phishing"
        final_score = max(score, int(ml_confidence * 100))
        reasons.append(f"ML Model detected phishing patterns (Confidence: {ml_confidence:.2f})")
    
    # Auto-block logic using updated score
    should_block = final_score >= 80

    # --- Auto Blocklist System ---
    if should_block and blocklist_collection is not None:
        try:
            # Avoid duplicate URLs
            if not blocklist_collection.find_one({"url": data.url}):
                blocklist_collection.insert_one({
                    "url": data.url,
                    "risk_score": final_score,
                    "reasons": reasons,
                    "timestamp": datetime.utcnow()
                })
        except Exception as e:
            print(f"Failed to auto-block URL: {e}")

    log_to_db("url_analysis", data.url, final_prediction, final_score, reasons, user_id=data.user_id)
    
    return {
        "url": data.url,
        "prediction": final_prediction.lower(), # phishing | legitimate
        "confidence": ml_confidence if ml_prediction != "Unknown" else (final_score / 100.0), # 0.xx
        "block": should_block,
        "explanation": explanation,
        # Backward Compatibility fields
        "risk_score": final_score,
        "reasons": reasons,
        "auto_blocked": should_block
    }

# --- Real-Time Block Enforcement (Extension) ---
@app.get("/api/check-blocked-url")
def check_blocked_url(url: str):
    """
    Check if a URL is in the blocklist.
    Used by the browser extension for real-time enforcement.
    """
    if blocklist_collection is not None:
        found = blocklist_collection.find_one({"url": url})
        if found:
            return {
                "blocked": True,
                "risk_score": found.get("risk_score", 100),
                "reasons": found.get("reasons", ["Previously flagged as phishing"])
            }
    return {"blocked": False}

# --- Blocklist Management (Dashboard) ---
@app.get("/api/blocklist")
def get_blocklist():
    if blocklist_collection is None:
        return []
    try:
        blocks = list(blocklist_collection.find().sort("timestamp", -1))
        for b in blocks:
            b["_id"] = str(b["_id"])
            if "timestamp" in b:
                b["timestamp"] = b["timestamp"].isoformat()
        return blocks
    except Exception as e:
        return {"error": str(e)}

@app.delete("/api/blocklist")
def remove_from_blocklist(url: str):
    if blocklist_collection is not None:
        result = blocklist_collection.delete_one({"url": url})
        return {"success": result.deleted_count > 0}
    return {"error": "Database unavailable"}

@app.post("/api/mark-safe")
def mark_url_safe(url: str):
    """Admin override to mark a URL as safe by removing it from blocklist."""
    if blocklist_collection is not None:
        blocklist_collection.delete_one({"url": url})
        # Optionally log as mark-safe in scan history
        log_to_db("admin_override", url, "Legitimate", 0, ["Marked safe by administrator"])
        return {"success": True}
    return {"error": "Database unavailable"}

@app.post("/api/extract-email-signals")
def api_extract_email_signals(data: EmailRequest):
    if not ENABLE_EMAIL_ANALYSIS:
        raise HTTPException(status_code=403, detail="Email analysis feature is disabled")
    signals = extract_email_signals(data.email_text)
    return {"signals": signals}

@app.post("/api/analyze-email")
def api_analyze_email(data: EmailRequest):
    if not ENABLE_EMAIL_ANALYSIS:
        raise HTTPException(status_code=403, detail="Email analysis feature is disabled")
    # Pass the loaded ML model for more accurate detection
    prediction, score, reasons = analyze_email_phishing(data.email_text, ml_model=email_ml_model)
    log_to_db("email_analysis", data.email_text[:500], prediction, score, reasons, user_id=data.user_id)
    return {
        "prediction": prediction,
        "risk_score": score,
        "reasons": reasons
    }

@app.get("/api/dashboard-stats")
def get_dashboard_stats(user_id: str = None):
    if history_collection is None:
        return {
            "total_scans": 0,
            "phishing_count": 0,
            "legitimate_count": 0,
            "url_scans": 0,
            "email_scans": 0,
            "recent_scans": [],
            "weekly_activity": []
        }
    
    try:
        from datetime import timedelta
        
        # Build filter query
        query = {}
        if user_id:
            query["user_id"] = user_id

        total_scans = history_collection.count_documents(query)
        
        phishing_query = query.copy()
        phishing_query["prediction"] = "Phishing"
        phishing_count = history_collection.count_documents(phishing_query)
        
        legit_query = query.copy()
        legit_query["prediction"] = "Legitimate"
        legitimate_count = history_collection.count_documents(legit_query)
        
        email_query = query.copy()
        email_query["type"] = "email_analysis"
        email_scans = history_collection.count_documents(email_query)
        
        url_query = query.copy()
        url_query["type"] = "url_analysis"
        url_scans = history_collection.count_documents(url_query)
        
        # Get 7-day activity aggregation
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        match_stage = {"timestamp": {"$gte": seven_days_ago}}
        if user_id:
            match_stage["user_id"] = user_id
            
        pipeline = [
            {"$match": match_stage},
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}},
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id": 1}}
        ]
        weekly_activity = list(history_collection.aggregate(pipeline))
        
        # Ensure we have data for all 7 days (even if 0)
        formatted_activity = []
        for i in range(7):
            date = (datetime.utcnow() - timedelta(days=6-i)).strftime("%Y-%m-%d")
            day_name = (datetime.utcnow() - timedelta(days=6-i)).strftime("%a")
            count = next((item['count'] for item in weekly_activity if item['_id'] == date), 0)
            formatted_activity.append({"day": day_name, "date": date, "count": count})

        # Get last 10 scans
        recent_scans_cursor = history_collection.find(query).sort("timestamp", -1).limit(10)
        recent_scans = []
        for scan in recent_scans_cursor:
            scan["_id"] = str(scan["_id"])  # Convert ObjectId to string
            if "timestamp" in scan:
                 scan["timestamp"] = scan["timestamp"].isoformat()
            recent_scans.append(scan)
            
        return {
            "total_scans": total_scans,
            "phishing_count": phishing_count,
            "legitimate_count": legitimate_count,
            "url_scans": url_scans,
            "email_scans": email_scans,
            "recent_scans": recent_scans,
            "weekly_activity": formatted_activity
        }
    except Exception as e:
        print(f"Error fetching stats: {e}")
        return {"error": str(e)}
