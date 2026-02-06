import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

from instagram_model.predict_instagram import InstagramPredictor
from instagram_model.data_fetcher import get_instagram_profile_data

def test_instagram_module():
    print("--- Testing Instagram Phishing Detection Module ---")
    
    # 1. Initialize Predictor
    try:
        predictor = InstagramPredictor()
        print("Model initialized successfully.")
    except Exception as e:
        print(f"FAILED to initialize model: {e}")
        return

    # 2. Test Legitimate Case
    user_legit = "official_google"
    print(f"\nTesting User: {user_legit}")
    data_legit = get_instagram_profile_data(user_legit)
    print(f"Features: {data_legit}")
    
    pred, conf, expl = predictor.predict(data_legit)
    print(f"Prediction: {pred}, Confidence: {conf:.2f}")
    if pred == "legitimate":
        print("PASS: Correctly identified legitimate user.")
    else:
        print("WARN: Misclassified legitimate user (might be random chance in synthetic data).")

    # 3. Test Phishing Case
    user_phish = "free_crypto_bot_winner"
    print(f"\nTesting User: {user_phish}")
    data_phish = get_instagram_profile_data(user_phish)
    print(f"Features: {data_phish}")
    
    pred, conf, expl = predictor.predict(data_phish)
    print(f"Prediction: {pred}, Confidence: {conf:.2f}")
    print(f"Explanation: {expl}")
    
    if pred == "phishing":
        print("PASS: Correctly identified phishing user.")
    else:
        print("WARN: Misclassified phishing user.")

if __name__ == "__main__":
    test_instagram_module()
