import pickle
import pandas as pd
import numpy as np
import shap
import lime
import lime.lime_tabular
import os

class InstagramPredictor:
    def __init__(self, model_path="model/instagram_rf.pkl", background_path="model/instagram_background.pkl"):
        self.model = None
        self.explainer_shap = None
        self.explainer_lime = None
        self.feature_names = [
            'followers_count', 'following_count', 'posts_count', 'account_age_days',
            'is_verified', 'has_profile_picture', 'bio_contains_link',
            'suspicious_keywords_count', 'followers_following_ratio',
            'username_brand_similarity_score'
        ]
        
        self.load_model(model_path, background_path)

    def load_model(self, model_path, background_path):
        if not os.path.exists(model_path):
            print(f"Instagram model not found at {model_path}")
            return

        try:
            with open(model_path, "rb") as f:
                self.model = pickle.load(f)
            
            if os.path.exists(background_path):
                with open(background_path, "rb") as f:
                    background_data = pickle.load(f)
                
                # Initialize SHAP
                self.explainer_shap = shap.TreeExplainer(self.model)
                
                # Initialize LIME
                # Convert to numpy if needed
                if hasattr(background_data, 'values'):
                    bg_values = background_data.values
                else:
                    bg_values = background_data
                    
                self.explainer_lime = lime.lime_tabular.LimeTabularExplainer(
                    bg_values,
                    mode='classification',
                    feature_names=self.feature_names,
                    class_names=['Legitimate', 'Phishing'],
                    discretize_continuous=True
                )
                print("Instagram Explainability engines loaded.")
            else:
                print("Background data not found, explainability disabled.")
                
        except Exception as e:
            print(f"Error loading Instagram model: {e}")

    def predict(self, features_dict):
        """
        features_dict: dictionary containing the raw features
        Returns: prediction, confidence, explanation
        """
        if not self.model:
            return "Error", 0.0, {"error": "Model not loaded"}
            
        # Ensure features are in correct order and format
        try:
            input_vector = [features_dict.get(f, 0) for f in self.feature_names]
            input_df = pd.DataFrame([input_vector], columns=self.feature_names)
            
            # Prediction
            pred_class = self.model.predict(input_df)[0] # 0 or 1
            prediction = "phishing" if pred_class == 1 else "legitimate"
            
            # Confidence
            probs = self.model.predict_proba(input_df)[0]
            confidence = float(probs[1]) if pred_class == 1 else float(probs[0])
            
            # Explanation (SHAP top 3)
            explanation = {"top_reasons": []}
            if self.explainer_shap:
                shap_values = self.explainer_shap.shap_values(input_df)
                
                if isinstance(shap_values, list):
                    sv = shap_values[1][0]
                elif len(np.array(shap_values).shape) == 3:
                    sv = np.array(shap_values)[0, :, 1]
                else:
                    sv = np.array(shap_values)[0]
                
                # Zip features with their SHAP values
                feature_importance = zip(self.feature_names, sv)
                # Sort by absolute impact
                sorted_features = sorted(feature_importance, key=lambda x: abs(x[1]), reverse=True)
                
                for name, val in sorted_features[:3]:
                    # Create human-readable strings
                    if val > 0: # Contributes to Phishing
                        if name == "followers_following_ratio":
                            reason = "Abnormal followers/following ratio"
                        elif name == "account_age_days":
                            reason = "Account is very new"
                        elif name == "bio_contains_link":
                            reason = "Suspicious link in bio"
                        elif name == "username_brand_similarity_score":
                            reason = "Username mimics a known brand"
                        elif name == "suspicious_keywords_count":
                            reason = "Bio contains suspicious keywords"
                        elif name == "following_count":
                            reason = "Following an unusually high number of users"
                        else:
                            reason = f"{name.replace('_', ' ').capitalize()} increases risk"
                    else: # Contributes to Legitimate
                        if name == "account_age_days":
                            reason = "Account is long-established"
                        elif name == "is_verified":
                            reason = "Account is Verified"
                        elif name == "followers_count":
                            reason = "Healthy follower count"
                        elif name == "has_profile_picture":
                            reason = "Profile picture present"
                        elif name == "username_brand_similarity_score":
                            reason = "Username appears unique/safe"
                        else:
                            reason = f"{name.replace('_', ' ').capitalize()} appears safe"
                        
                    explanation["top_reasons"].append(reason)
            
            return prediction, confidence, explanation

        except Exception as e:
            print(f"Prediction error: {e}")
            return "Error", 0.0, {"error": str(e)}
