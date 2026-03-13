import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, Code2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchUrlHtml, extractUrlSignals, analyzeUrl, fetchDomTree } from '../utils/api';
import Loader from '../components/Loader';
import ResultCard from '../components/ResultCard';
import DomTreeView from '../components/DomTreeView';

const UrlAnalysis = () => {
    const [url, setUrl] = useState('');
    const [html, setHtml] = useState('');
    const [snippets, setSnippets] = useState('');
    const [domTree, setDomTree] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState({ fetch: false, analyze: false });
    const [error, setError] = useState('');
    const [showCode, setShowCode] = useState(false);
    const [showDom, setShowDom] = useState(false);

    const handleFetchAndAnalyze = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading({ fetch: true, analyze: true });
        setError('');
        setHtml('');
        setSnippets('');
        setDomTree(null);
        setResults(null);

        try {
            // Step 1: Fetch
            const res = await fetchUrlHtml(url);
            const fetchedHtml = res.data.html;
            setHtml(fetchedHtml);

            // Step 2: Extract Signals and DOM in background
            const [signalsRes, domRes] = await Promise.all([
                extractUrlSignals(url, fetchedHtml),
                fetchDomTree(url, fetchedHtml)
            ]);
            setSnippets(signalsRes.data.snippets);
            setDomTree(domRes.data.dom_tree);

            // Step 3: Final Analysis
            const user = JSON.parse(localStorage.getItem('phishguard_currentUser') || '{}');
            const analysisRes = await analyzeUrl(url, fetchedHtml, user.id);
            setResults(analysisRes.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Analysis sequence failed. Ensure backend and target URL are accessible.');
        } finally {
            setLoading({ fetch: false, analyze: false });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-6">
            <div className="text-center md:text-left space-y-2">
                <h2 className="text-4xl font-extrabold text-emerald-900 tracking-tight">Real-time URL Forensics</h2>
                <p className="text-emerald-800/60 text-lg font-medium">Deep-scanning URLs for structural and behavioral phishing patterns.</p>
            </div>

            {/* URL Input */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-2xl shadow-emerald-700/5">
                <form onSubmit={handleFetchAndAnalyze} className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-black text-emerald-800/40 ml-1 uppercase tracking-[0.2em] flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-100 rounded-lg">
                                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            Target Destination
                        </label>
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-emerald-50 rounded-xl group-focus-within:bg-emerald-100 transition-colors">
                                <Globe className="w-5 h-5 text-emerald-600" />
                            </div>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-emerald-50/30 border border-emerald-100 rounded-3xl py-6 pl-16 pr-8 text-emerald-900 placeholder:text-emerald-900/20 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all font-bold text-lg shadow-inner"
                                placeholder="https://external-login-portal.com"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading.fetch || loading.analyze}
                        className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-black text-xl rounded-3xl shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-[0.1em]"
                    >
                        {loading.analyze ? (
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Scanning DNA...</span>
                            </div>
                        ) : (
                            <>
                                <Search className="w-6 h-6" />
                                <span>Analyze Website Now</span>
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

            {/* Results & Deep Dive Toggle */}
            <AnimatePresence mode="wait">
                {results && !loading.analyze && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <ResultCard {...results} />

                        {/* Technical Deep Dive Section (Hidden by default like user asked) */}
                        <div className="space-y-4 pt-4 border-t border-emerald-100">
                             <div className="flex items-center justify-between px-2">
                                <h3 className="text-sm font-black text-emerald-900/40 uppercase tracking-widest">Technical Deep Dive</h3>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setShowCode(!showCode)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${showCode ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`}
                                    >
                                        Source Snippets
                                    </button>
                                    <button 
                                        onClick={() => setShowDom(!showDom)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${showDom ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`}
                                    >
                                        DOM Blueprint
                                    </button>
                                </div>
                             </div>

                             <AnimatePresence>
                                {showCode && snippets && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-emerald-950 p-6 rounded-[2rem] border border-emerald-800/20 shadow-xl">
                                            <div className="flex items-center gap-2 mb-4 text-emerald-400">
                                                <Code2 className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Suspicious HTML Payload</span>
                                            </div>
                                            <pre className="text-xs text-emerald-300 font-mono overflow-auto max-h-[300px] leading-relaxed custom-scrollbar">
                                                <code>{snippets}</code>
                                            </pre>
                                        </div>
                                    </motion.div>
                                )}

                                {showDom && domTree && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-white p-6 rounded-[2rem] border border-emerald-100 shadow-xl">
                                            <div className="flex items-center gap-2 mb-4 text-emerald-600">
                                                <div className="w-3 h-3 border-2 border-emerald-600 rounded-sm" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Live Document Model</span>
                                            </div>
                                            <DomTreeView tree={domTree} />
                                        </div>
                                    </motion.div>
                                )}
                             </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {(loading.fetch || loading.analyze) && <Loader text="Synchronizing Forensic Data..." />}
        </div>
    );
};

export default UrlAnalysis;
