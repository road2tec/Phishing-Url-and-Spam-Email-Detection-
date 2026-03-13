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
        <div className="max-w-4xl mx-auto space-y-10 py-6">
            <div className="text-center md:text-left space-y-2">
                <h2 className="text-4xl font-extrabold text-emerald-900 tracking-tight">Email Intelligence Scanning</h2>
                <p className="text-emerald-800/60 text-lg font-medium">Verify suspicious emails with high-precision behavioral analysis.</p>
            </div>

            {/* Email Input & Direct Analysis */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-2xl shadow-emerald-700/5">
                <form onSubmit={handleAnalyze} className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-black text-emerald-800/40 ml-1 uppercase tracking-[0.2em] flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-100 rounded-lg">
                                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            Message Payload
                        </label>
                        <textarea
                            value={emailText}
                            onChange={(e) => setEmailText(e.target.value)}
                            className="w-full bg-emerald-50/30 border border-emerald-100 rounded-3xl py-5 px-8 text-emerald-900 placeholder:text-emerald-900/20 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all font-medium min-h-[300px] resize-y shadow-inner"
                            placeholder="Paste the suspicious email content here..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-black text-xl rounded-3xl shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-[0.1em]"
                    >
                        {loading ? (
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Scanning...</span>
                            </div>
                        ) : (
                            <>
                                <Search className="w-6 h-6" />
                                <span>Initiate Analysis</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-5 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-600 text-sm font-bold shadow-lg shadow-red-500/5"
                    >
                        <AlertCircle className="w-6 h-6 flex-shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Display */}
            <AnimatePresence mode="wait">
                {results && !loading && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 30 }}
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
