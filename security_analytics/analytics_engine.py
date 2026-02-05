import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import shap
import lime
import lime.lime_tabular
import re
from urllib.parse import urlparse
import os
import sys

# Configuration
DATASET_PATH = 'data/PhiUSIIL_Phishing_URL_Dataset.csv'
OUTPUT_DIR = 'security_analytics'
RANDOM_SEED = 42

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def print_unbuffered(message):
    print(message, flush=True)

def extract_features(df):
    """
    Extracts lexical features from URLs given a DataFrame with a 'URL' column.
    """
    print_unbuffered("Extracting features...")
    
    # helper functions
    def get_url_length(url):
        return len(str(url))
    
    def get_domain_length(url):
        try:
            domain = urlparse(url).netloc
            return len(domain)
        except:
            return 0

    def count_dots(url):
        return str(url).count('.')
    
    def count_digits(url):
        return sum(c.isdigit() for c in str(url))
    
    def is_ip_address(url):
        # Simple regex for IP address
        ipv4_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
        return 1 if re.search(ipv4_pattern, str(url)) else 0
    
    def is_https(url):
        return 1 if str(url).lower().startswith('https') else 0
    
    def has_suspicious_keywords(url):
        keywords = ['login', 'secure', 'verify', 'bank']
        url_lower = str(url).lower()
        return 1 if any(keyword in url_lower for keyword in keywords) else 0

    # Apply extractions
    # Working on a copy to avoid SettingWithCopy warnings if slice
    df_features = df.copy()
    
    df_features['url_length'] = df_features['URL'].apply(get_url_length)
    df_features['domain_length'] = df_features['URL'].apply(get_domain_length)
    df_features['dot_count'] = df_features['URL'].apply(count_dots)
    df_features['digit_count'] = df_features['URL'].apply(count_digits)
    df_features['is_ip'] = df_features['URL'].apply(is_ip_address)
    df_features['is_https'] = df_features['URL'].apply(is_https)
    df_features['suspicious_keywords'] = df_features['URL'].apply(has_suspicious_keywords)
    
    # Select only the features we just created plus label
    feature_cols = ['url_length', 'domain_length', 'dot_count', 'digit_count', 
                    'is_ip', 'is_https', 'suspicious_keywords']
    
    return df_features[feature_cols], df_features['label']

def main():
    print_unbuffered("Loading data...")
    if not os.path.exists(DATASET_PATH):
        print_unbuffered(f"Error: Dataset not found at {DATASET_PATH}")
        return

    try:
        df = pd.read_csv(DATASET_PATH, usecols=['URL', 'label'])
    except Exception as e:
        print_unbuffered(f"Error loading dataset: {e}")
        return
    
    # Feature Extraction
    try:
        X, y = extract_features(df)
        print_unbuffered(f"Data shape: {X.shape}")
        print_unbuffered(f"Labels distribution:\n{y.value_counts()}")
    except Exception as e:
        print_unbuffered(f"Error in feature extraction: {e}")
        return

    # Split Data
    print_unbuffered("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=RANDOM_SEED)

    # Train Model
    print_unbuffered("Training Random Forest model...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=RANDOM_SEED)
    rf_model.fit(X_train, y_train)

    # Evaluation
    print_unbuffered("Evaluating model...")
    try:
        y_pred = rf_model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print_unbuffered(f"Accuracy: {accuracy:.4f}")
    except Exception as e:
        print_unbuffered(f"Error evaluating model: {e}")

    # Confusion Matrix
    print_unbuffered("Generating Confusion Matrix...")
    try:
        cm = confusion_matrix(y_test, y_pred)
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
        plt.title('Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.savefig(os.path.join(OUTPUT_DIR, 'confusion_matrix.png'))
        plt.close()
    except Exception as e:
        print_unbuffered(f"Error generating confusion matrix: {e}")

    # Feature Importance
    print_unbuffered("Generating Feature Importance plot...")
    try:
        importances = rf_model.feature_importances_
        indices = np.argsort(importances)[::-1]
        plt.figure(figsize=(10, 6))
        plt.title('Feature Importances')
        plt.bar(range(X.shape[1]), importances[indices], align='center')
        plt.xticks(range(X.shape[1]), [X.columns[i] for i in indices], rotation=45)
        plt.tight_layout()
        plt.savefig(os.path.join(OUTPUT_DIR, 'feature_importance.png'))
        plt.close()
    except Exception as e:
        print_unbuffered(f"Error generating feature importance: {e}")

    # Explainability - SHAP
    print_unbuffered("Generating SHAP summary plot...")
    try:
        sample_size = min(100, len(X_test))
        X_sample = X_test.iloc[:sample_size]
        
        explainer = shap.TreeExplainer(rf_model)
        # check_additivity=False acts as a workaround for some numerical precision issues
        shap_values = explainer.shap_values(X_sample, check_additivity=False)
        
        print_unbuffered(f"SHAP values type: {type(shap_values)}")
        if isinstance(shap_values, list):
             print_unbuffered(f"SHAP values list length: {len(shap_values)}")
             if len(shap_values) > 0:
                 print_unbuffered(f"SHAP values [0] shape: {shap_values[0].shape}")
        else:
             print_unbuffered(f"SHAP values shape: {shap_values.shape}")

        plt.figure()
        # Handle different return types of shap_values
        if isinstance(shap_values, list):
            # For binary classification, typically index 1 is the positive class
            vals = shap_values[1] if len(shap_values) > 1 else shap_values[0]
        else:
            vals = shap_values

        shap.summary_plot(vals, X_sample, show=False)
        plt.savefig(os.path.join(OUTPUT_DIR, 'shap_summary.png'), bbox_inches='tight')
        plt.close()
        print_unbuffered("SHAP summary plot saved.")
    except Exception as e:
        print_unbuffered(f"Error generating SHAP plot: {e}")
        import traceback
        traceback.print_exc()

    # Explainability - LIME
    print_unbuffered("Generating LIME explanation...")
    try:
        lime_explainer = lime.lime_tabular.LimeTabularExplainer(
            training_data=np.array(X_train),
            feature_names=X.columns.tolist(),
            class_names=['Legitimate', 'Phishing'],
            mode='classification'
        )
        
        # Explain a single instance
        target_idx = 0
        found = False
        for idx in range(len(y_test)):
            if y_test.iloc[idx] == 1:
                target_idx = idx
                found = True
                break
        
        if found:
            img_instance = X_test.iloc[target_idx]
            # predict_proba expects numpy array or dataframe
            exp = lime_explainer.explain_instance(
                data_row=img_instance, 
                predict_fn=rf_model.predict_proba
            )
            
            plt.figure(figsize=(10, 6))
            exp.as_pyplot_figure()
            plt.tight_layout()
            plt.savefig(os.path.join(OUTPUT_DIR, 'lime_explanation.png'))
            plt.close()
            print_unbuffered("LIME explanation saved.")
        else:
            print_unbuffered("No positive sample found for LIME.")

    except Exception as e:
        print_unbuffered(f"Error generating LIME explanation: {e}")
        import traceback
        traceback.print_exc()

    print_unbuffered("Pipeline completed.")

if __name__ == "__main__":
    main()
