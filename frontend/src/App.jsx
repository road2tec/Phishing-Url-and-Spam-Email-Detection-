import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import UrlAnalysis from './pages/UrlAnalysis';
import EmailAnalysis from './pages/EmailAnalysis';
import InstagramAnalysis from './pages/InstagramAnalysis';
import BlockedUrls from './pages/BlockedUrls';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard Routes (Protected in a real app) */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="url" element={<UrlAnalysis />} />
        <Route path="url" element={<UrlAnalysis />} />
        <Route path="instagram" element={<InstagramAnalysis />} />
        {import.meta.env.VITE_ENABLE_EMAIL_ANALYSIS !== 'false' && (
          <Route path="email" element={<EmailAnalysis />} />
        )}
        <Route path="blocked" element={<BlockedUrls />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
