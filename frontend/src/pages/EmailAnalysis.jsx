import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Search, ListFilter, AlertCircle, FileText } from 'lucide-react';
import { extractEmailSignals, analyzeEmail } from '../utils/api';
import Loader from '../components/Loader';
import ResultCard from '../components/ResultCard';

const EmailAnalysis = () => {
    const [emailText, setEmailText] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!emailText) return;

        setLoading(true);
        setError('');
        setResults(null);

        try {
            const user = JSON.parse(localStorage.getItem('phishguard_currentUser') || '{}');
            const res = await analyzeEmail(emailText, user.id);
            setResults(res.data);
        } catch (err) {
            setError('Analysis failed. Please check your connection to the backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">Instant Email Analysis</h2>
                <p className="text-white/50 text-sm">Paste the full email content below to immediately check for phishing indicators.</p>
            </div>

            {/* Email Input & Direct Analysis */}
            <div className="glass-morphism p-8 rounded-3xl border border-white/5 shadow-xl">
                <form onSubmit={handleAnalyze} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-widest flex items-center gap-2">
                            <Mail className="w-4 h-4 text-emerald-400" />
                            Email Message Content
                        </label>
                        <textarea
                            value={emailText}
                            onChange={(e) => setEmailText(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium min-h-[250px] resize-y"
                            placeholder="Dear customer, your account has been suspended due to unusual activity. Click here to verify your identity..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-gradient-to-r from-emerald-600 to-mint-600 hover:from-emerald-500 hover:to-mint-500 text-white font-black text-lg rounded-3xl shadow-2xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                        {loading ? (
                            <span className="animate-pulse tracking-[0.2em]">Analyzing...</span>
                        ) : (
                            <>
                                <Search className="w-6 h-6" />
                                <span>Analyze Email Now</span>
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

            {/* Results Display */}
            <AnimatePresence>
                {results && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <ResultCard {...results} />
                    </motion.div>
                )}
            </AnimatePresence>

            {loading && <Loader text="Executing Deep Behavioral ML Scanning..." />}
        </div>
    );
};

export default EmailAnalysis;
