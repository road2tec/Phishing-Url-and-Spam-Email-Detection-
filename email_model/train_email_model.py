
import pandas as pd
import numpy as np
import pickle
import os
import re
import string
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Configuration
DATA_PATH = r"v:/Road2Tech/project_6/phishing-detector-main/phishing-detector-main/data/phising mail/phishing_email.csv"
MODEL_PATH = r"v:/Road2Tech/project_6/phishing-detector-main/phishing-detector-main/model/phishing_detector.pkl"

def preprocess_text(text):
    """
    Basic text cleaning:
    - Lowercase
    - Remove numbers (optional, but sometimes good for general text)
    - Remove punctuation
    """
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(f"[{re.escape(string.punctuation)}]", " ", text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def train_model():
    print(f"Loading data from {DATA_PATH}...")
    if not os.path.exists(DATA_PATH):
        print(f"Error: Dataset not found at {DATA_PATH}")
        return

    try:
        # Load dataset
        # The dataset has 'text_combined' and 'label' (0 or 1)
        # Based on inspection: 1 is Phishing usually? Let's check a sample.
        # Line 2: "hpl nom ...", 0. Looks legit. 
        # Often datasets are 0=ham, 1=spam/phishing. 
        # I will assume 1=Phishing for now based on standard conventions, 
        # but I will print a sample to verify if possible (hard in script).
        # We'll treat the provided label as the ground truth.
        df = pd.read_csv(DATA_PATH)
        
        # Check for required columns
        valid_cols = [c for c in df.columns if 'text' in c.lower() or 'label' in c.lower()]
        print(f"Found columns: {df.columns.tolist()}")
        
        # Flexibly identify columns if names differ slightly
        text_col = next((c for c in df.columns if 'text' in c.lower()), None)
        label_col = next((c for c in df.columns if 'label' in c.lower()), None)
        
        if not text_col or not label_col:
            print("Error: Could not identify text or label columns.")
            return

        print(f"Using text column: '{text_col}' and label column: '{label_col}'")
        
        # Drop NaNs
        df = df.dropna(subset=[text_col, label_col])
        
        X = df[text_col].apply(preprocess_text)
        y = df[label_col]
        
        print(f"Training on {len(df)} samples...")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Create Pipeline
        # TF-IDF -> Naive Bayes
        pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(stop_words='english', max_features=50000)),
            ('clf', MultinomialNB())
        ])
        
        print("Training model...")
        pipeline.fit(X_train, y_train)
        
        print("Evaluating model...")
        y_pred = pipeline.predict(X_test)
        
        print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        # --- Value Added: Generate Graphs ---
        # Save graphs to email_model/graphs/
        graph_dir = os.path.join(os.path.dirname(__file__), "graphs")
        os.makedirs(graph_dir, exist_ok=True)
        
        # 1. Confusion Matrix
        cm = confusion_matrix(y_test, y_pred)
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar=False)
        plt.xlabel('Predicted')
        plt.ylabel('Actual')
        plt.title('Confusion Matrix - Email Phishing Detection')
        cm_path = os.path.join(graph_dir, "email_confusion_matrix.png")
        plt.savefig(cm_path)
        plt.close()
        print(f"Saved confusion matrix to {cm_path}")

        # 2. Class Distribution (Train vs Test)
        plt.figure(figsize=(10, 5))
        plt.subplot(1, 2, 1)
        y_train.value_counts().plot(kind='bar', color=['skyblue', 'salmon'])
        plt.title('Training Data Distribution')
        plt.xlabel('Class')
        plt.ylabel('Count')
        
        plt.subplot(1, 2, 2)
        y_test.value_counts().plot(kind='bar', color=['skyblue', 'salmon'])
        plt.title('Test Data Distribution')
        plt.xlabel('Class')
        plt.ylabel('Count')
        
        dist_path = os.path.join(graph_dir, "data_distribution.png")
        plt.tight_layout()
        plt.savefig(dist_path)
        plt.close()
        print(f"Saved distribution plot to {dist_path}")
        
        # Save model
        print(f"Saving model to {MODEL_PATH}...")
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        with open(MODEL_PATH, 'wb') as f:
            pickle.dump(pipeline, f)
            
        print("Done!")
        
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    train_model()
