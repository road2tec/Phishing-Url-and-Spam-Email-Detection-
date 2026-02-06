import pandas as pd
import numpy as np
import pickle
import os
import shap
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

# Create directory if not exists
os.makedirs("instagram_model", exist_ok=True)

# --- 1. Generate Synthetic Dataset ---
print("Generating synthetic Instagram dataset...")

np.random.seed(42)
n_samples = 2000

# Legitimate profiles (Label 0)
legit_samples = n_samples // 2
legit_data = {
    'followers_count': np.random.randint(500, 1000000, legit_samples),
    'following_count': np.random.randint(100, 2000, legit_samples),
    'posts_count': np.random.randint(50, 5000, legit_samples),
    'account_age_days': np.random.randint(365, 3650, legit_samples), # 1-10 years
    'is_verified': np.random.choice([0, 1], legit_samples, p=[0.95, 0.05]),
    'has_profile_picture': np.ones(legit_samples, dtype=int),
    'bio_contains_link': np.random.choice([0, 1], legit_samples, p=[0.7, 0.3]),
    'suspicious_keywords_count': np.random.choice([0, 1], legit_samples, p=[0.9, 0.1]),
    'username_brand_similarity_score': np.random.uniform(0, 0.3, legit_samples),
    'label': 0
}
legit_df = pd.DataFrame(legit_data)

# Phishing profiles (Label 1)
phish_samples = n_samples // 2
phish_data = {
    'followers_count': np.random.randint(0, 500, phish_samples),
    'following_count': np.random.randint(500, 5000, phish_samples),
    'posts_count': np.random.randint(0, 10, phish_samples),
    'account_age_days': np.random.randint(0, 30, phish_samples), # New accounts
    'is_verified': np.zeros(phish_samples, dtype=int),
    'has_profile_picture': np.random.choice([0, 1], phish_samples, p=[0.4, 0.6]),
    'bio_contains_link': np.random.choice([0, 1], phish_samples, p=[0.2, 0.8]), # High chance of malicious link
    'suspicious_keywords_count': np.random.randint(1, 5, phish_samples), # "Win", "Free", "Crypto"
    'username_brand_similarity_score': np.random.uniform(0.6, 1.0, phish_samples), # Imitating brands
    'label': 1
}
phish_df = pd.DataFrame(phish_data)

# Combine
df = pd.concat([legit_df, phish_df], ignore_index=True)

# Feature Engineering: Ratio
# Avoid division by zero
df['followers_following_ratio'] = df['followers_count'] / (df['following_count'] + 1)

# Shuffle
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# Save dataset
dataset_path = "data/instagram_dataset.csv"
df.to_csv(dataset_path, index=False)
print(f"Dataset saved to {dataset_path}")

# --- 2. Train Model ---
print("Training Random Forest model...")

features = [
    'followers_count', 'following_count', 'posts_count', 'account_age_days',
    'is_verified', 'has_profile_picture', 'bio_contains_link',
    'suspicious_keywords_count', 'followers_following_ratio',
    'username_brand_similarity_score'
]

X = df[features]
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Evaluation
y_pred = clf.predict(X_test)
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['Legit', 'Phishing'], yticklabels=['Legit', 'Phishing'])
plt.title("Confusion Matrix")
plt.savefig("instagram_model/confusion_matrix.png")
print("Confusion matrix plot saved.")

# Feature Importance
importances = clf.feature_importances_
indices = np.argsort(importances)[::-1]
plt.figure(figsize=(10, 6))
plt.title("Feature Importances")
plt.bar(range(X.shape[1]), importances[indices], align="center")
plt.xticks(range(X.shape[1]), [features[i] for i in indices], rotation=45, ha='right')
plt.tight_layout()
plt.savefig("instagram_model/feature_importance.png")
print("Feature importance plot saved.")

# --- 3. Save Artifacts ---
model_path = "model/instagram_rf.pkl"
background_path = "model/instagram_background.pkl"

with open(model_path, "wb") as f:
    pickle.dump(clf, f)

# Save background data for SHAP/LIME (summarized via k-means or just a sample)
background_sample = X_train.sample(n=100, random_state=42)
with open(background_path, "wb") as f:
    pickle.dump(background_sample, f)

print(f"Model saved to {model_path}")
print(f"Background data saved to {background_path}")

# --- 4. SHAP Summary (Optional but good for report) ---
try:
    print("Generating SHAP summary plot...")
    explainer = shap.TreeExplainer(clf)
    shap_values = explainer.shap_values(X_test.iloc[:100])
    
    plt.figure()
    # Check shape of shap_values (for binary classification, it might be a list of 2 arrays)
    if isinstance(shap_values, list):
        shap_vals_to_plot = shap_values[1] # Class 1
    else:
        shap_vals_to_plot = shap_values
        
    shap.summary_plot(shap_vals_to_plot, X_test.iloc[:100], show=False)
    plt.savefig("instagram_model/shap_summary.png", bbox_inches='tight')
    print("SHAP summary plot saved.")
except Exception as e:
    print(f"Could not generate SHAP plot: {e}")

print("Done setup!")
