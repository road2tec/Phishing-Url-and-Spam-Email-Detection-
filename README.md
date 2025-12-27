# 🛡️ PhishGuard Pro: Advanced Emerald Phishing Detection System

PhishGuard Pro is a premium, production-ready phishing detection system featuring a **Cyber Emerald & Obsidian** aesthetic. It leverages **Multi-Modal Machine Learning** and **Heuristic Analysis** to identify threats across URLs and Email content. It features a live-updating dashboard with 7-day trend analysis, a robust FastAPI backend, and an explainable analysis engine.

---

## 🚀 Key Features

### � Live "Cyber Emerald" Dashboard
- **Dynamic Monitoring**: Real-time stats for Total Scans, Phishing Detections, and Legitimate hits.
- **7-Day Analysis Feed**: Visual bar charts tracking scan activity over the past week.
- **Auto-Syncing Registry**: A live-updating list (every 10 seconds) of the most recent analysis results.
- **Premium UI**: Glassmorphism design with emerald/mint gradients and fluid **Framer Motion** animations.

### 🛡️ Analysis Engine
- **Direct Email Analysis**: Streamlined "Paste-and-Check" flow for immediate phishing classification.
- **URL Multi-Modal Scan**: Heuristic analysis of domain patterns, TLDs, and live HTML source code.
- **Explainable Results**: Detailed risk scores (0-100%) with specific reasons for every detection.
- **ML & Heuristics**: Hybrid approach using Random Forest models and custom behavioral rules.

### ⚙️ Backend & Resilience
- **FastAPI Core**: High-performance, asynchronous REST API.
- **MongoDB Cloud**: Integrated with MongoDB Atlas for persistent scan history and statistical aggregation.
- **Security First**: Enforced timeouts and robust error handling for dead links or network failures.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Axios, **Recharts** (Visualizations).
- **Backend**: Python 3.11+, FastAPI, Uvicorn, Pymongo.
- **Data/ML**: Scikit-learn, joblib, BeautifulSoup4, TLDextract.
- **Database**: MongoDB Atlas.

---

## 📁 Project Structure

```text
phishing-detector/
├── frontend/               # React 19 Application
│   ├── src/
│   │   ├── components/     # StatCards, Charts, ResultCards
│   │   ├── pages/          # DashboardHome, Email/URL Analysis
│   │   └── utils/          # Live API services (Axios)
│   └── ...
├── src/                    # Backend Source
│   ├── api_fastapi.py      # Dashboard Stats API & Routing
│   ├── analysis_engine.py  # Hybrid Detection Logic
│   ├── feature_url.py      # URL Heuristics
│   └── feature_email.py    # Email Signal Processing
├── model/                  # Pretrained ML Models (.pkl)
├── requirements.txt        # Python Dependencies
└── README.md
```

---

## ⚙️ Quick Start

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/road2tec/Phishing-Url-and-Spam-Email-Detection-.git
cd Phishing-Url-and-Spam-Email-Detection-

# Install dependencies
pip install -r requirements.txt

# Start the API (Port 5000)
python -m uvicorn src.api_fastapi:app --reload --port 5000
```

### 2. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```
> Access the UI at: `http://localhost:5173`

---

## 🛡️ Usage

### 📊 Dashboard
- Monitor threat levels and weekly activity trends automatically.
- The "Recent Analysis Registry" updates in real-time as you scan.

### 📧 Email Protection
- Paste the full body of a suspicious email into the **Instant Email Analysis** module.
- Click **Analyze Email Now** for a direct classification (Legitimate/Phishing) and risk score.

### 🔗 URL Guard
- Analyze websites by URL.
- The system fetches live HTML to inspect for hidden login forms and malicious redirection patterns.

---

## � Author
**road2tec**  
Project Repository: [Phishing-Url-and-Spam-Email-Detection-](https://github.com/road2tec/Phishing-Url-and-Spam-Email-Detection-.git)

---
*Developed for advanced cybersecurity monitoring and threat intelligence.*
