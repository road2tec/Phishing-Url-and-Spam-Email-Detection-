import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Search, AlertCircle, ShieldCheck, User } from 'lucide-react';
import { analyzeInstagramProfile } from '../utils/api';
import Loader from '../components/Loader';
import ResultCard from '../components/ResultCard';

const InstagramAnalysis = () => {
    const [username, setUsername] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!username) return;

        setLoading(true);
        setError('');
        setResults(null);

        try {
            const user = JSON.parse(localStorage.getItem('phishguard_currentUser') || '{}');
            const res = await analyzeInstagramProfile(username, user.id);

            // Transform API response to match ResultCard format
            const apiData = res.data;
            const reasons = apiData.explanation?.top_reasons || [];

            setResults({
                prediction: apiData.prediction,
                confidence: apiData.confidence,
                risk_score: apiData.prediction === 'phishing' ? Math.round(apiData.confidence * 100) : Math.round((1 - apiData.confidence) * 10),
                reasons: reasons,
                platform: 'instagram'
            });
        } catch (err) {
            setError(err.response?.data?.detail || 'Analysis failed. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">Instagram Profile Analysis</h2>
                <p className="text-white/50 text-sm">Detect fake profiles, bots, and impersonators using metadata analysis.</p>
            </div>

            {/* Input Section */}
            <div className="glass-morphism p-8 rounded-3xl border border-white/5 shadow-xl">
                <form onSubmit={handleAnalyze} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-widest">Instagram Username</label>
                        <div className="relative">
                            <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-medium"
                                placeholder="official_google"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3 group shadow-lg shadow-pink-500/20"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Analyze Profile</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-red-400/10 border border-red-400/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading State */}
            {loading && <Loader text="Fetching profile metadata & analyzing behavioral patterns..." />}

            {/* Results */}
            <AnimatePresence>
                {results && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <ResultCard {...results} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InstagramAnalysis;
