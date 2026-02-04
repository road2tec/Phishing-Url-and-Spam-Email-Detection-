import re
from urllib.parse import urlparse
import tldextract

def extract_url_features(url):
    """
    Extracts specific lexical features for the Random Forest model.
    Features:
    1. URL Length
    2. Domain Length
    3. Dot Count
    4. Digit Count
    5. IP Address Presence (Binary)
    6. HTTPS Usage (Binary)
    7. Suspicious Keywords Count
    """
    if not url:
        return {
            "url_length": 0, "domain_length": 0, "dot_count": 0, 
            "digit_count": 0, "has_ip": 0, "is_https": 0, "susp_keywords": 0
        }

    parsed = urlparse(url)
    ext = tldextract.extract(url)
    domain_part = f"{ext.domain}.{ext.suffix}"
    
    # 7. Suspicious Keywords (login, secure, verify, bank)
    keywords = ["login", "secure", "verify", "bank", "account", "update", "signin", "confirm"]
    url_lower = url.lower()
    keyword_count = sum(1 for k in keywords if k in url_lower)

    feats = {
        "url_length": len(url),
        "domain_length": len(domain_part),
        "dot_count": url.count("."),
        "digit_count": sum(c.isdigit() for c in url),
        "has_ip": 1 if re.search(r"\d+\.\d+\.\d+\.\d+", parsed.netloc) else 0,
        "is_https": 1 if parsed.scheme == "https" else 0,
        "susp_keywords": keyword_count
    }
    return feats

