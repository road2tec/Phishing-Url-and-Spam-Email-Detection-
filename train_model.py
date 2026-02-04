import pandas as pd
import numpy as np
import joblib
import pickle
import os
from sklearn.ensemble import RandomForestClassifier
from src.feature_url import extract_url_features

# 1. Generate Synthetic Data
# We need a mix of legitimate and phishing URLs to train the model
print("Generating synthetic dataset...")

legitimate_urls = [
    "https://www.google.com", "https://www.youtube.com", "https://www.facebook.com",
    "https://www.amazon.com", "https://www.wikipedia.org", "https://www.reddit.com",
    "https://www.yahoo.com", "https://www.twitter.com", "https://www.instagram.com",
    "https://www.linkedin.com", "https://www.netflix.com", "https://www.microsoft.com",
    "https://www.apple.com", "https://www.twitch.tv", "https://www.nytimes.com",
    "https://www.cnn.com", "https://www.bbc.co.uk", "https://www.github.com",
    "https://stackoverflow.com", "https://www.dropbox.com", "https://www.salesforce.com",
    "https://www.spotify.com", "https://www.whatsapp.com", "https://www.adobe.com",
    "https://www.paypal.com", "https://www.chase.com", "https://www.bankofamerica.com",
    "http://example.com", "http://test.com", "https://www.medium.com"
]

phishing_urls = [
    "http://paypal-secure-login.com", "http://verify-account-amazon.update.com",
    "http://192.168.1.1/login", "https://secure-banking-alert.com",
    "http://apple-id-confirm.xyz", "http://login.google.com.security-check.tk",
    "https://netflix-payment-update.net", "http://facebook-verify.gq",
    "http://wells-fargo-alert.com", "http://chase-bank-verify.top",
    "https://microsoft-support-ticket.club", "http://irs-refund-claim.work",
    "http://signin-attempt-blocked.com", "http://password-reset-required.net",
    "http://0x58.0xCC.0x4B.0x66", "http://216.58.194.164", # IP addresses
    "https://auth-verify.linkedln.com", # Typo
    "http://secure.account.update.info", "http://confirm.identity.us",
    "http://customer-support.help", "http://win-iphone-free.click",
    "http://bonus-cash-claim.link", "http://crypto-wallet-verify.site",
    "http://free-bitcoin.mining.online", "http://urgent-notice.account.com",
    "http://safety-check.verify.com", "http://blocked-account.reactivate.com"
]

# Create simple variations to increase dataset size
dataset = []
for url in legitimate_urls:
    dataset.append({"url": url, "label": 0})
    # Add variations
    dataset.append({"url": url + "/about", "label": 0})
    dataset.append({"url": url + "/contact", "label": 0})

for url in phishing_urls:
    dataset.append({"url": url, "label": 1})
    # Add variations
    dataset.append({"url": url + "/login.php", "label": 1})
    dataset.append({"url": url + "?id=123", "label": 1})

# 2. Extract Features
print("Extracting features...")
data = []
for item in dataset:
    feats = extract_url_features(item["url"])
    feats["label"] = item["label"]
    data.append(feats)

df = pd.DataFrame(data)
X = df.drop(columns=["label"])
y = df["label"]

print(f"Dataset shape: {df.shape}")
print(df.head())

# 3. Train Random Forest Model
print("Training Random Forest model...")
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X, y)

# 4. Save Model and Background Data
os.makedirs("model", exist_ok=True)
model_path = "model/rf_model.pkl"
background_path = "model/background_data.pkl"

with open(model_path, "wb") as f:
    pickle.dump(rf, f)

# For SHAP, we need a background dataset (summarized or sample)
# We'll save a small sample of the training data (e.g., median or k-means)
# For simplicity and speed in this context, we save a sample of 50 rows
background_data = X.sample(n=min(50, len(X)), random_state=42)
with open(background_path, "wb") as f:
    pickle.dump(background_data, f)

print(f"Model saved to {model_path}")
print(f"Background data saved to {background_path}")
print("Done!")
