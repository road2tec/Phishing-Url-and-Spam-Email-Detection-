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
export const analyzeUrl = (url, html) => api.post('/api/analyze-url', { url, html });

export const extractEmailSignals = (email_text) => api.post('/api/extract-email-signals', { email_text });
export const analyzeEmail = (email_text) => api.post('/api/analyze-email', { email_text });
export const fetchDashboardStats = () => api.get('/api/dashboard-stats');

export default api;
