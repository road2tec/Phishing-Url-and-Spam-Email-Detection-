import streamlit as st
import os
from analysis_engine import (
    fetch_live_html, extract_suspicious_snippets, analyze_phishing,
    extract_email_signals, analyze_email_phishing
)

# Configuration
st.set_page_config(
    page_title="Phishing Detector Pro",
    page_icon="🛡️",
    layout="wide"
)

# Custom CSS for better aesthetics
st.markdown("""
<style>
    .main {
        background-color: #f5f7f9;
    }
    .stButton>button {
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .reportview-container .main .block-container{
        padding-top: 2rem;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 24px;
    }
    .stTabs [data-baseweb="tab"] {
        height: 50px;
        white-space: pre-wrap;
        background-color: #f0f2f6;
        border-radius: 4px 4px 0px 0px;
        gap: 1px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .stTabs [aria-selected="true"] {
        background-color: #4e73df;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

st.title("🛡️ Phishing Detection Dashboard")
st.markdown("### Multi-Modal Phishing Analysis")

# Sidebar
with st.sidebar:
    st.header("⚙️ Dashboard Info")
    st.info("Detect phishing across multiple channels using heuristic analysis and live data fetching.")
    st.markdown("---")
    st.markdown("**Core Features:**")
    st.write("- Live URL/HTML Inspection")
    st.write("- Explainable Email Analysis")
    st.write("- Real-time Risk Scoring")

# Tabs for different analysis modes
tab1, tab2 = st.tabs(["🔗 URL Analysis", "📧 Email Analysis"])

with tab1:
    # Initialize session state for URL
    if 'fetched_html' not in st.session_state:
        st.session_state.fetched_html = None
    if 'target_url' not in st.session_state:
        st.session_state.target_url = ""

    st.subheader("Fetch & Analyze Live URL Content")
    url_input = st.text_input("Enter URL to observe:", value=st.session_state.target_url, placeholder="https://secure-login.example.com", key="url_input_field")

    if st.button("🌐 Fetch HTML Source", type="secondary", key="fetch_html_btn"):
        if url_input:
            with st.spinner("Fetching live HTML source..."):
                st.session_state.target_url = url_input
                html_source = fetch_live_html(url_input)
                st.session_state.fetched_html = html_source
                
                if html_source.startswith("Error") or "Unable to fetch" in html_source:
                    st.error(html_source)
                else:
                    st.success("✅ HTML source fetched successfully!")
        else:
            st.warning("⚠️ Please enter a URL first.")

    # URL Step 2: Display Snippets and Final Analysis
    if st.session_state.fetched_html and not (st.session_state.fetched_html.startswith("Error") or "Unable to fetch" in st.session_state.fetched_html):
        st.markdown("---")
        st.subheader("📄 Inspect Suspicious HTML Snippets")
        
        snippets = extract_suspicious_snippets(st.session_state.fetched_html)
        st.code(snippets, language="html")
        st.info("💡 Review the code above for suspicious forms or login fields.")
        
        if st.button("🔍 Analyze URL for Phishing", type="primary", use_container_width=True, key="analyze_url_btn"):
            with st.spinner("Performing deep heuristic analysis on URL..."):
                prediction, score, reasons = analyze_phishing(st.session_state.target_url, st.session_state.fetched_html)
                
                st.markdown(f"### Analysis Result: {prediction}")
                st.progress(score / 100)
                
                col1, col2 = st.columns([1, 2])
                with col1:
                    if prediction == "Phishing":
                        st.error(f"🚩 **Risk Level: High ({score}/100)**")
                    else:
                        st.success(f"✅ **Risk Level: Low ({score}/100)**")
                with col2:
                    st.markdown("**Reasons for Detection:**")
                    if reasons:
                        for reason in reasons:
                            st.write(f"- {reason}")
                    else:
                        st.write("- No obvious phishing indicators found.")

with tab2:
    st.subheader("Extract & Analyze Email Signals")
    email_input = st.text_area("Paste Email Content:", height=200, placeholder="Dear customer, your account has been suspended. Please click here to verify...", key="email_input_field")
    
    # Initialize session state for Email
    if 'email_signals' not in st.session_state:
        st.session_state.email_signals = None
    if 'current_email_text' not in st.session_state:
        st.session_state.current_email_text = ""

    if st.button("📊 Extract Email Signals", type="secondary", key="extract_signals_btn"):
        if email_input:
            st.session_state.current_email_text = email_input
            with st.spinner("Extracting signals..."):
                signals = extract_email_signals(email_input)
                st.session_state.email_signals = signals
                st.success("Signals extracted!")
        else:
            st.warning("⚠️ Please paste some email content.")

    if st.session_state.email_signals:
        st.markdown("---")
        st.subheader("📧 Suspicious Email Signals")
        st.code(st.session_state.email_signals, language="text")
        
        if st.button("🔍 Analyze Email for Phishing", type="primary", use_container_width=True, key="analyze_email_btn"):
            with st.spinner("Analyzing email content..."):
                prediction, score, reasons = analyze_email_phishing(st.session_state.current_email_text)
                
                st.markdown(f"### Analysis Result: {prediction}")
                st.progress(score / 100)
                
                col1, col2 = st.columns([1, 2])
                with col1:
                    if prediction == "Phishing":
                        st.error(f"🚩 **Risk Level: High ({score}/100)**")
                    else:
                        st.success(f"✅ **Risk Level: Low ({score}/100)**")
                with col2:
                    st.markdown("**Reasons for Detection:**")
                    if reasons:
                        for reason in reasons:
                            st.write(f"- {reason}")
                    else:
                        st.write("- No obvious phishing indicators found.")
                
                if prediction == "Phishing":
                    st.warning("⚠️ **Warning:** This email mimics official communication patterns to steal data. Do not click any links.")
                else:
                    st.balloons()

# Footer
st.markdown("---")
st.markdown(
    """
    <div style='text-align: center; color: #666;'>
        <p>Built with Streamlit • Real-time Multi-Modal Phishing Analysis Engine 🛡️</p>
    </div>
    """,
    unsafe_allow_html=True
)