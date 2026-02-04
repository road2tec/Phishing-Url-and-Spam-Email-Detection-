import requests
import re
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import tldextract

def fetch_live_html(url):
    """
    Fetches the live HTML source of a URL.
    Implements proper error handling for unreachable or fake websites.
    """
    try:
        response = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()
        return response.text
    except (requests.exceptions.RequestException, requests.exceptions.ConnectionError, requests.exceptions.Timeout):
        # Return a clear, user-friendly message instead of crashing
        return "Unable to fetch HTML. Website may be unreachable or fake."
    except Exception as e:
        return f"Error: {str(e)}"

def extract_suspicious_snippets(html):
    """Extracts important/suspicious parts of the HTML."""
    # Ensure analysis skips if HTML fetching failed
    if not html or html.startswith("Error") or "Unable to fetch" in html:
        return ""
    
    soup = BeautifulSoup(html, "html.parser")
    snippets = []
    
    # 1. <form> tags
    forms = soup.find_all("form")
    for form in forms:
        snippets.append(str(form)[:500] + "..." if len(str(form)) > 500 else str(form))
    
    # 2. login / password fields
    inputs = soup.find_all("input")
    for inp in inputs:
        if inp.get("type") in ["password", "login"] or "login" in str(inp).lower() or "password" in str(inp).lower():
            snippets.append(str(inp))
            
    # 3. external script tags
    scripts = soup.find_all("script", src=True)
    for script in scripts:
        snippets.append(str(script))
        
    return "\n".join(snippets) if snippets else "No suspicious HTML elements found."

from .feature_url import extract_url_features
from .feature_html import extract_html_features
import joblib
import os

# Load URL ML model if available (fallback to heuristics if not)
ML_MODEL_PATH = "model/rf_model.pkl"
ml_model = None
if os.path.exists(ML_MODEL_PATH):
    try:
        ml_model = joblib.load(ML_MODEL_PATH)
    except:
        pass

def analyze_phishing(url, html):
    """
    Analyzes URL and HTML for phishing indicators using a Unified Risk Score.
    Combines: ML Model + Heuristic Rules + Live HTML Analysis.
    """
    heuristic_score = 0
    html_score = 0
    ml_score = 0
    reasons = []
    
    # --- 1. Heuristic URL Analysis ---
    parsed_url = urlparse(url)
    if parsed_url.scheme == "http":
        heuristic_score += 30
        reasons.append("Insecure HTTP protocol used (no encryption).")
        
    if "@" in url:
        heuristic_score += 40
        reasons.append("URL contains '@' symbol (highly suspicious masking technique).")
    
    if url.count("-") > 3:
        heuristic_score += 15
        reasons.append("Excessive hyphens in URL, typical of phishing domains.")
        
    if re.search(r"\d+\.\d+\.\d+\.\d+", parsed_url.netloc):
        heuristic_score += 50
        reasons.append("URL uses an IP address instead of a domain name.")

    # --- 2. Live HTML Analysis ---
    html_data = extract_html_features(html)
    html_reasons = html_data.get("reasons", [])
    reasons.extend(html_reasons)
    
    # Calculate HTML score based on reasons
    if html_reasons:
        html_score = min(len(html_reasons) * 20, 100)
        # Extra weight for password fields
        if any("password" in r.lower() for r in html_reasons):
            html_score = max(html_score, 85)

    # --- 3. Machine Learning Score (If Model is Available) ---
    if ml_model:
        try:
            url_feats = extract_url_features(url)
            # Convert feats dict to match model input (this is a placeholder, adjust to actual model features)
            # For now, we'll simulate the ML finding if it's very suspicious
            prediction = ml_model.predict([list(url_feats.values())])[0]
            ml_score = 90 if prediction == 1 else 10
        except:
            ml_score = 0
    else:
        # Fallback: simple rule-based "ML" score
        ml_score = heuristic_score

    # --- 4. Unified Risk Score Calculation ---
    # CONFIGURATION: Adjust weights here to tune detection sensitivity
    # Current: Heuristic (30%) + HTML (40%) + ML (30%)
    w_heuristic = 0.3
    w_html = 0.4
    w_ml = 0.3
    
    final_score = (heuristic_score * w_heuristic) + (html_score * w_html) + (ml_score * w_ml)
    final_score = min(int(final_score), 100)
    
    prediction = "Phishing" if final_score >= 80 else "Legitimate"
    
    # Unified Data Flow: URL → HTML Fetch → Analysis → Risk Score → Blocklist (stored in API)
    return prediction, final_score, list(set(reasons))

def extract_email_signals(text):
    """Extracts suspicious signals from email content."""
    if not text:
        return "No email content provided."
    
    signals = []
    text_lower = text.lower()
    
    # 1. Urgent / Threatening words (expanded safely)
    urgent_keywords = [
        "urgent", "immediate", "immediately", "action required",
        "act now", "final notice", "last warning",
        "suspended", "account suspended", "account locked",
        "compromised", "unauthorized", "expired",
        "security alert", "verify now", "within 24 hours"
    ]
    found_urgent = [w for w in urgent_keywords if w in text_lower]
    if found_urgent:
        signals.append(f"Urgent Keywords: {', '.join(found_urgent)}")
        
    # 2. Sensitive data requests (expanded safely)
    sensitive_keywords = [
        "password", "otp", "one time password", "pin",
        "ssn", "social security",
        "credit card", "debit card", "cvv",
        "bank details", "identity",
        "verify your account", "confirm your identity"
    ]
    found_sensitive = [w for w in sensitive_keywords if w in text_lower]
    if found_sensitive:
        signals.append(f"Sensitive Data Requests: {', '.join(found_sensitive)}")
        
    # 3. Links
    links = re.findall(r"http[s]?://\S+", text)
    if links:
        signals.append(f"Links found: {len(links)} (Check for masked domains)")
        
    # 4. Generic greetings
    generic_greetings = [
        "dear user", "dear customer",
        "valuable member", "dear account holder"
    ]
    found_greetings = [g for g in generic_greetings if g in text_lower]
    if found_greetings:
        signals.append(f"Generic Greetings: {', '.join(found_greetings)}")
        
    return "\n".join(signals) if signals else "No immediate suspicious signals identified."


def analyze_email_phishing(text, ml_model=None):
    """
    Analyzes email text for phishing indicators using a hybrid approach.
    Uses ML model for primary decision if available, else rules.
    """
    score = 0
    reasons = []
    ml_prediction = None
    ml_score = None
    
    if not text:
        return "Unknown", 0, ["No text provided."]
        
    text_lower = text.lower()
    
    # --- 1. Rule-Based Heuristic Analysis (Explainability) ---
    
    # 1.1 Urgency and Threats (expanded)
    urgent_keywords = [
        "urgent", "immediate", "immediately", "action required",
        "act now", "final notice", "last warning",
        "expired", "account suspended", "account locked",
        "security alert", "unauthorized"
    ]
    if any(w in text_lower for w in urgent_keywords):
        score += 25
        reasons.append("Contains urgent or threatening language designed to create panic.")
        
    # 1.2 Sensitive Information Requests (expanded)
    sensitive_keywords = [
        "password", "otp", "pin",
        "ssn", "social security",
        "credit card", "debit card", "cvv",
        "bank details",
        "verify your account", "confirm your identity"
    ]
    if any(w in text_lower for w in sensitive_keywords):
        score += 30
        reasons.append("Requests sensitive personal or financial information.")
        
    # 1.3 Multiple links
    links = re.findall(r"http[s]?://\S+", text)
    if len(links) > 3:
        score += 15
        reasons.append(f"Large number of links ({len(links)}) found, which is common in phishing.")
    
    # 1.4 Generic greetings
    generic_greetings = [
        "dear user", "dear customer",
        "valuable member", "dear account holder"
    ]
    if any(g in text_lower for g in generic_greetings):
        score += 10
        reasons.append("Uses generic greetings instead of a personal name.")
        
    # 1.5 Common phishing lure words (unchanged logic, expanded list)
    phish_tokens = [
        "gift card", "lottery", "winner",
        "prize", "refund", "claim now",
        "cash bonus", "free reward"
    ]
    if any(t in text_lower for t in phish_tokens):
        score += 20
        reasons.append("Contains common phishing hooks like rewards or prizes.")

    # --- 2. Machine Learning Analysis (Primary Decision) ---
    if ml_model is not None:
        try:
            # Get prediction (supports Pipeline with TF-IDF)
            pred = ml_model.predict([text])[0]
            ml_prediction = "Phishing" if pred == 1 else "Legitimate"
            
            # Get risk score from probability (if available)
            if hasattr(ml_model, "predict_proba"):
                probs = ml_model.predict_proba([text])[0]
                # Assuming class 1 is phishing
                # Some models might have class 0 as legit and 1 as phishing
                # We'll use the probability of class 1 as the risk score
                if len(probs) > 1:
                    ml_score = int(probs[1] * 100)
                else:
                    ml_score = int(probs[0] * 100) if pred == 1 else int((1 - probs[0]) * 100)
            else:
                ml_score = 100 if pred == 1 else 0
        except Exception as e:
            print(f"ML Prediction Error: {e}")
            ml_prediction = None

    # --- 3. Final Decision Logic ---
    # ML model takes precedence if it worked
    if ml_prediction is not None:
        prediction = ml_prediction
        score = ml_score if ml_score is not None else (100 if prediction == "Phishing" else 0)
    else:
        # Fallback to rule-based logic
        score = min(score, 100)
        prediction = "Phishing" if score >= 50 else "Legitimate"
    
    return prediction, score, reasons
