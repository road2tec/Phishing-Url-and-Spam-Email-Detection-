import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, Code2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchUrlHtml, extractUrlSignals, analyzeUrl } from '../utils/api';
import Loader from '../components/Loader';
import ResultCard from '../components/ResultCard';

const UrlAnalysis = () => {
    const [url, setUrl] = useState('');
    const [html, setHtml] = useState('');
    const [snippets, setSnippets] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState({ fetch: false, analyze: false });
    const [error, setError] = useState('');
    const [showCode, setShowCode] = useState(true);

    const handleFetch = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading({ ...loading, fetch: true });
        setError('');
        setHtml('');
        setSnippets('');
        setResults(null);

        try {
            const res = await fetchUrlHtml(url);
            setHtml(res.data.html);

            const signalsRes = await extractUrlSignals(url, res.data.html);
            setSnippets(signalsRes.data.snippets);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch URL content. Make sure the backend is running.');
        } finally {
            setLoading({ ...loading, fetch: false });
        }
    };

    const handleAnalyze = async () => {
        setLoading({ ...loading, analyze: true });
        try {
            const res = await analyzeUrl(url, html);
            setResults(res.data);
        } catch (err) {
            setError('Analysis failed. Please try again.');
        } finally {
            setLoading({ ...loading, analyze: false });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">URL Live Analysis</h2>
                <p className="text-white/50 text-sm">Observe live HTML source code to identify potential hidden threats.</p>
            </div>

            {/* Step 1: URL Input */}
            <div className="glass-morphism p-8 rounded-3xl border border-white/5 shadow-xl">
                <form onSubmit={handleFetch} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-widest">Enter URL to observe</label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-accent" />
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                                placeholder="https://secure-login.bank.com"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading.fetch}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2 group"
                    >
                        {loading.fetch ? (
                            <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Search className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                                <span>Fetch HTML Source</span>
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

            {/* Step 2: Content Display & Analysis */}
            <AnimatePresence>
                {snippets && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="glass-morphism rounded-3xl border border-white/5 overflow-hidden">
                            <button
                                onClick={() => setShowCode(!showCode)}
                                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-500/10">
                                        <Code2 className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h3 className="font-bold text-white">Suspicious HTML Snippets</h3>
                                </div>
                                {showCode ? <ChevronUp className="text-white/30" /> : <ChevronDown className="text-white/30" />}
                            </button>

                            {showCode && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    className="px-6 pb-6"
                                >
                                    <pre className="bg-cyber-dark/50 p-6 rounded-2xl border border-white/5 text-xs text-emerald-300 font-mono overflow-auto max-h-[300px] leading-relaxed">
                                        <code>{snippets}</code>
                                    </pre>
                                    <p className="mt-4 text-[11px] text-white/30 italic flex items-center gap-2">
                                        <AlertCircle className="w-3 h-3" />
                                        Review the code above for suspicious forms, login fields, or unknown external scripts.
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {!results && (
                            <button
                                onClick={handleAnalyze}
                                disabled={loading.analyze}
                                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-3xl shadow-2xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                            >
                                {loading.analyze ? (
                                    <span className="animate-pulse">Analyzing Pattern...</span>
                                ) : (
                                    <>
                                        <Search className="w-6 h-6" />
                                        <span>Analyze for Phishing</span>
                                    </>
                                )}
                            </button>
                        )}

                        {loading.analyze && <Loader text="Executing Deep Heuristic Analysis Engine..." />}

                        {results && <ResultCard {...results} />}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UrlAnalysis;
