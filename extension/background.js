const API_BASE = "http://localhost:5000";

// Listen for navigation events to enforce real-time blocking
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    // Only intercept top-level frames
    if (details.frameId !== 0) return;

    const url = details.url;

    // Skip checking extension pages or local addresses
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.includes('localhost')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/check-blocked-url?url=${encodeURIComponent(url)}`);
        if (response.ok) {
            const data = await response.json();
            if (data.blocked) {
                const reasons = data.reasons.join('|');
                const blockPage = chrome.runtime.getURL(`blocked.html?url=${encodeURIComponent(url)}&reasons=${encodeURIComponent(reasons)}`);

                chrome.tabs.update(details.tabId, { url: blockPage });
                console.warn(`[PhishGuard] Blocked malicious URL: ${url}`);
            }
        }
    } catch (err) {
        console.error("[PhishGuard] Error checking URL:", err);
    }
});

// Periodic background analysis sync (Optional enhancement)
chrome.runtime.onInstalled.addListener(() => {
    console.log("PhishGuard Pro Service Worker Installed.");
});
