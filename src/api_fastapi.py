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
from .analysis_engine import (
    fetch_live_html, extract_suspicious_snippets, analyze_phishing,
    extract_email_signals, analyze_email_phishing
)

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
MONGO_URI = "mongodb+srv://punamproject:punamproject%40123@road2tech.vajimqu.mongodb.net/?appName=road2tech"
try:
    client = MongoClient(MONGO_URI)
    db = client['phishing_detector']
    history_collection = db['scan_history']
    print("Connected to MongoDB successfully!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    history_collection = None

def log_to_db(type, input, prediction, score, reasons):
    if history_collection is not None:
        try:
            history_collection.insert_one({
                "type": type,
                "input": input,
                "prediction": prediction,
                "risk_score": score,
                "reasons": reasons,
                "timestamp": datetime.utcnow()
            })
        except Exception as e:
            print(f"Failed to log to MongoDB: {e}")

class PredictionRequest(BaseModel):
    url: str
    email_text: str = ""
    html: str = ""

class URLRequest(BaseModel):
    url: str

class EmailRequest(BaseModel):
    email_text: str

# Load URL Random Forest model (Rule-based features)
model_path = "model/rf_model.pkl"
if not os.path.exists(model_path):
    print(f"Warning: URL model not found at {model_path}")
    model = None
else:
    with open(model_path, "rb") as f:
        model = pickle.load(f)

# Load Pretrained Email ML Model
email_model_path = "model/phishing_detector.pkl"
try:
    if os.path.exists(email_model_path):
        email_ml_model = joblib.load(email_model_path)
        print(f"Pretrained Email ML Model loaded successfully from {email_model_path}!")
    else:
        print(f"Warning: Email ML model not found at {email_model_path}")
        email_ml_model = None
except Exception as e:
    print(f"Warning: Could not load pretrained email model from {email_model_path}: {e}")
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
    return {"status": "API is running", "model_loaded": model is not None}

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

@app.post("/api/analyze-url")
def api_analyze_url(data: PredictionRequest):
    html = data.html
    if not html and data.url:
        html = fetch_live_html(data.url)
    
    prediction, score, reasons = analyze_phishing(data.url, html)
    log_to_db("url_analysis", data.url, prediction, score, reasons)
    return {
        "prediction": prediction,
        "risk_score": score,
        "reasons": reasons
    }

@app.post("/api/extract-email-signals")
def api_extract_email_signals(data: EmailRequest):
    signals = extract_email_signals(data.email_text)
    return {"signals": signals}

@app.post("/api/analyze-email")
def api_analyze_email(data: EmailRequest):
    # Pass the loaded ML model for more accurate detection
    prediction, score, reasons = analyze_email_phishing(data.email_text, ml_model=email_ml_model)
    log_to_db("email_analysis", data.email_text[:500], prediction, score, reasons)
    return {
        "prediction": prediction,
        "risk_score": score,
        "reasons": reasons
    }

@app.get("/api/dashboard-stats")
def get_dashboard_stats():
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
        
        total_scans = history_collection.count_documents({})
        phishing_count = history_collection.count_documents({"prediction": "Phishing"})
        legitimate_count = history_collection.count_documents({"prediction": "Legitimate"})
        
        email_scans = history_collection.count_documents({"type": "email_analysis"})
        url_scans = history_collection.count_documents({"type": "url_analysis"})
        
        # Get 7-day activity aggregation
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        pipeline = [
            {"$match": {"timestamp": {"$gte": seven_days_ago}}},
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
        recent_scans_cursor = history_collection.find().sort("timestamp", -1).limit(10)
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
