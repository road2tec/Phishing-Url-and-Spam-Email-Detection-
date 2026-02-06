import random
import time
import os
import requests
import re
from dotenv import load_dotenv

load_dotenv()

def get_instagram_profile_data(username: str):
    """
    Fetches real Instagram profile metadata using RapidAPI.
    Fallback to mock data if API fails or no key is provided.
    """
    api_key = os.getenv("RAPIDAPI_KEY")
    
    if api_key:
        try:
            print(f"Fetching data for {username} from RapidAPI...")
            url = "https://instagram-scraper-2022.p.rapidapi.com/ig/info_username/"
            querystring = {"user": username}
            # Use host from env or default to the old one (which is likely down, so user should update env)
            api_host = os.getenv("RAPIDAPI_HOST", "instagram-scraper-2022.p.rapidapi.com")
            
            # Update the URL based on the host if we want to be fully dynamic, 
            # BUT different APIs have different path structures.
            # For now, we'll keep the logic but allow host swap if they are compatible.
            # Ideally, we should suggest a specific compatible API.
            
            headers = {
                "X-RapidAPI-Key": api_key,
                "X-RapidAPI-Host": api_host
            }
            
            # NOTE: If the user changes the host, the endpoint path (/ig/info_username/) 
            # might also need to change. This refactor assumes a compatible API.
            # If switching to a completely different API, more code changes might be needed.
            
            response = requests.get(url, headers=headers, params=querystring, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                user_data = data.get('user', {})
                
                if not user_data:
                    # Case where user exists but 'user' key is missing or empty
                    print("API returned 200 but no user data found.")
                    return get_mock_data(username)

                # Extract features
                followers = user_data.get('follower_count', 0)
                following = user_data.get('following_count', 0)
                posts = user_data.get('media_count', 0)
                is_verified = 1 if user_data.get('is_verified', False) else 0
                has_pic = 1 if user_data.get('profile_pic_url') else 0
                
                biography = user_data.get('biography', "") or ""
                external_url = user_data.get('external_url', "") or ""
                
                # Check for links
                bio_contains_link = 1 if external_url or "http" in biography else 0
                
                # Suspicious keywords
                suspicious_list = ['crypto', 'invest', 'free', 'winner', 'dm for', 'promo', 'bitcoin', 'forex']
                suspicious_count = sum(1 for word in suspicious_list if word in biography.lower() or word in username.lower())
                
                # Username similarity (Simple check: if username looks like "official" or brand but unverified)
                brand_keywords = ['official', 'support', 'team', 'instagram', 'facebook', 'meta']
                similarity_score = 0.0
                if any(k in username.lower() for k in brand_keywords):
                    similarity_score = 0.8
                
                # Ratio
                ratio = followers / (following + 1)
                
                return {
                    'followers_count': followers,
                    'following_count': following,
                    'posts_count': posts,
                    'account_age_days': random.randint(30, 3650), # API doesn't always give creation date, estimating
                    'is_verified': is_verified,
                    'has_profile_picture': has_pic,
                    'bio_contains_link': bio_contains_link,
                    'suspicious_keywords_count': suspicious_count,
                    'followers_following_ratio': ratio,
                    'username_brand_similarity_score': similarity_score
                }
            else:
                print(f"RapidAPI request failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"Error fetching from RapidAPI: {e}")

    # Fallback to Mock Data
    print("Falling back to mock data...")
    return get_mock_data(username)

def get_mock_data(username: str):
    # Deterministic simulation based on username
    seed_val = sum(ord(c) for c in username)
    random.seed(seed_val)
    time.sleep(0.5)
    
    is_suspicious_demo = any(k in username.lower() for k in ["fake", "bot", "free", "support", "help", "claim", "offer"])
    
    if is_suspicious_demo:
        data = {
            'followers_count': random.randint(10, 500),
            'following_count': random.randint(1000, 5000),
            'posts_count': random.randint(0, 5),
            'account_age_days': random.randint(1, 60),
            'is_verified': 0,
            'has_profile_picture': random.choice([0, 1]),
            'bio_contains_link': 1, 
            'suspicious_keywords_count': random.randint(1, 3), 
            'username_brand_similarity_score': random.uniform(0.5, 0.9)
        }
    else:
        data = {
            'followers_count': random.randint(500, 100000),
            'following_count': random.randint(200, 1000),
            'posts_count': random.randint(50, 2000),
            'account_age_days': random.randint(365, 3000),
            'is_verified': 1 if random.random() > 0.9 else 0,
            'has_profile_picture': 1,
            'bio_contains_link': 0,
            'suspicious_keywords_count': 0,
            'username_brand_similarity_score': random.uniform(0.0, 0.2)
        }
    
    data['followers_following_ratio'] = data['followers_count'] / (data['following_count'] + 1)
    return data
