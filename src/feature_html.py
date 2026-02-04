from bs4 import BeautifulSoup
import re

def extract_html_features(html):
    """
    Analyzes HTML content for phishing indicators.
    Returns a dictionary of features and human-readable reasons.
    """
    if not html or html.startswith("Error") or "Unable to fetch" in html:
        return {"features": {}, "reasons": []}

    soup = BeautifulSoup(html, "html.parser")
    reasons = []
    
    # 1. Password fields (CRITICAL)
    pw_fields = soup.find_all("input", {"type": "password"})
    if pw_fields:
        reasons.append(f"Found {len(pw_fields)} password input field(s) - high phishing risk.")

    # 2. Forms (especially without HTTPS or with suspicious actions)
    forms = soup.find_all("form")
    if forms:
        reasons.append(f"Detected {len(forms)} form(s) that collect user input.")
        for form in forms:
            action = form.get("action", "").lower()
            if action and (action.startswith("http://") or re.search(r"\d+\.\d+\.\d+\.\d+", action)):
                reasons.append("Form action points to an insecure URL or IP address.")

    # 3. Hidden inputs
    hidden_inputs = soup.find_all("input", {"type": "hidden"})
    if len(hidden_inputs) > 5:
        reasons.append(f"Excessive hidden input fields ({len(hidden_inputs)}) detected.")

    # 4. Iframes
    iframes = soup.find_all("iframe")
    if iframes:
        reasons.append("Contains iframes, which can be used to overlay malicious content.")

    # 5. Malicious-looking scripts
    scripts = soup.find_all("script")
    suspicious_js = False
    for script in scripts:
        script_content = str(script).lower()
        if any(keyword in script_content for keyword in ["eval(", "unescape(", "document.location", "window.location.replace"]):
            suspicious_js = True
            break
    if suspicious_js:
        reasons.append("Detected suspicious JavaScript patterns (redirection or obfuscation).")

    # 6. Title and login keywords
    title = soup.title.string.lower() if soup.title else ""
    login_keywords = ["login", "sign in", "verify", "secure", "account", "update"]
    if any(kw in title for kw in login_keywords):
        reasons.append(f"Page title '{title}' contains sensitive keywords.")

    feats = {
        "num_forms": len(forms),
        "num_inputs": len(soup.find_all("input")),
        "num_pw_fields": len(pw_fields),
        "num_iframes": len(iframes),
        "num_scripts": len(scripts),
        "has_suspicious_js": 1 if suspicious_js else 0
    }
    
    return {"features": feats, "reasons": reasons}
