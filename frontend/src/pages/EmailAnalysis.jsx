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
        <div className="max-w-5xl mx-auto space-y-12 py-10 relative animate-fade-in text-white">
            {/* Ambient background glow */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="text-center md:text-left space-y-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-card border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 shadow-xl"
                >
                    <Mail className="w-4 h-4" />
                    Neural Communication Shield
                </motion.div>
                <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
                    Email <span className="text-gradient-emerald">Intelligence</span> Scanning
                </h2>
                <p className="text-slate-400 text-xl font-medium max-w-2xl">Expose hidden threats in suspicious communications using advanced behavioral ML heuristics.</p>
            </div>

            {/* Email Input & Direct Analysis */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative z-10 overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Mail className="w-24 h-24 text-white" />
                </div>

                <form onSubmit={handleAnalyze} className="space-y-8 relative z-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 ml-2 uppercase tracking-[0.4em] flex items-center gap-3">
                            <div className="p-2 glass-card border-white/10 rounded-xl">
                                <FileText className="w-4 h-4 text-emerald-400" />
                            </div>
                            Encrypted Message Payload
                        </label>
                        <textarea
                            value={emailText}
                            onChange={(e) => setEmailText(e.target.value)}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] py-8 px-10 text-white placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all font-mono text-sm min-h-[350px] resize-y shadow-inner leading-relaxed"
                            placeholder="Paste the suspicious email raw content here for forensic extraction..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-7 disabled:opacity-50 disabled:cursor-not-allowed group border-none outline-none"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                <span className="uppercase tracking-[0.2em] font-black">Executing Deep Scan...</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-4">
                                <Search className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                <span className="uppercase tracking-[0.2em] font-black">Initiate Behavioral Analysis</span>
                            </div>
                        )}
                    </button>
                </form>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-6 glass-card border-red-500/20 rounded-[2rem] flex items-center gap-5 text-red-400 text-sm font-bold shadow-2xl shadow-red-500/5 relative z-10"
                    >
                        <div className="p-3 bg-red-500/10 rounded-xl">
                            <AlertCircle className="w-6 h-6 flex-shrink-0" />
                        </div>
                        <span className="uppercase tracking-widest">{error}</span>
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
                        className="space-y-12 relative z-10"
                    >
                        <div className="flex items-center gap-4 ml-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em]">Intelligence Report Generated</span>
                        </div>
                        <ResultCard {...results} />
                    </motion.div>
                )}
            </AnimatePresence>

            {loading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
                     <Loader text="Executing Deep Behavioral ML Scanning..." />
                </div>
            )}
        </div>
    );
};

export default EmailAnalysis;
