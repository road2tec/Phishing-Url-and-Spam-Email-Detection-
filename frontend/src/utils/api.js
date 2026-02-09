import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchUrlHtml = (url) => api.post('/api/fetch-url', { url });
export const extractUrlSignals = (url, html) => api.post('/api/extract-url-signals', { url, html });
export const analyzeUrl = (url, html, user_id) => api.post('/api/analyze-url', { url, html, user_id });
export const analyzeInstagramProfile = (username, user_id) => api.post('/api/analyze-instagram-profile', { username, user_id });

export const extractEmailSignals = (email_text) => api.post('/api/extract-email-signals', { email_text });
export const analyzeEmail = (email_text, user_id) => api.post('/api/analyze-email', { email_text, user_id });
export const fetchDashboardStats = (user_id) => api.get('/api/dashboard-stats', { params: { user_id } });

// Blocklist Management
export const fetchBlocklist = () => api.get('/api/blocklist');
export const markUrlSafe = (url) => api.post(`/api/mark-safe?url=${encodeURIComponent(url)}`);
export const removeFromBlocklist = (url) => api.delete(`/api/blocklist?url=${encodeURIComponent(url)}`);
export const fetchDomTree = (url, html) => api.post('/api/fetch-dom-tree', { url, html });

export default api;
