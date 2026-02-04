import os
import pickle
import pandas as pd
import shap
from src.feature_url import extract_url_features

# Simulate the API logic
print("Verifying ML Integration...")

model_path = "model/rf_model.pkl"
background_path = "model/background_data.pkl"

if not os.path.exists(model_path):
    print("Error: Model not found!")
    exit(1)

with open(model_path, "rb") as f:
    model = pickle.load(f)
    print("Model loaded.")

with open(background_path, "rb") as f:
    background = pickle.load(f)
    print("Background data loaded.")

# Test URL
test_url = "http://paypal-secure-login.com"
print(f"Testing URL: {test_url}")

# Extract features
feats = extract_url_features(test_url)
feature_order = ["url_length", "domain_length", "dot_count", "digit_count", "has_ip", "is_https", "susp_keywords"]
input_vector = [feats[f] for f in feature_order]
input_df = pd.DataFrame([input_vector], columns=feature_order)

# Predict
pred = model.predict(input_df)[0]
confidence = model.predict_proba(input_df)[0][pred]
print(f"Prediction: {pred} (Confidence: {confidence:.2f})")

# Explain (SHAP)
print("Generating SHAP explanation...")
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(input_df)

print(f"SHAP values type: {type(shap_values)}")
if isinstance(shap_values, list):
    print(f"SHAP values list len: {len(shap_values)}")
    print(f"SHAP values[0] shape: {shap_values[0].shape}")
    print(f"SHAP values[1] shape: {shap_values[1].shape}")
else:
    print(f"SHAP values shape: {shap_values.shape}")

# Handle SHAP output structure
# For binary classification, it might be a list of 2 arrays [neg_class, pos_class]
# or just one array if binary encoded differently
if isinstance(shap_values, list):
    # shap_values[1] is typically positive class (Phishing)
    # input_df has 1 row, so we take index 0
    sv = shap_values[1][0] 
else:
    sv = shap_values[0]

print(f"Selected SV shape: {sv.shape}")
print(f"Selected SV: {sv}")

# Ensure sv is 1D array
import numpy as np
if len(sv.shape) > 1:
    sv = sv.flatten()

feature_importance = zip(feature_order, sv)
# Sort using explicit float conversion to avoid ambiguity if numpy scalars are involved
sorted_features = sorted(feature_importance, key=lambda x: float(abs(x[1])), reverse=True)

print("Top Features:")
for name, val in sorted_features[:3]:
    impact = "Increases Risk" if val > 0 else "Decreases Risk"
    print(f"- {name}: {val:.4f} ({impact})")


print("Verification Successful!")
