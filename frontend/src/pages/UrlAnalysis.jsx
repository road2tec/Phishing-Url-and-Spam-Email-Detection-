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
    const [step, setStep] = useState(0); // 0: Input, 1: Fetched, 2: Analyzed
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showCode, setShowCode] = useState(false);
    const [showFullHtml, setShowFullHtml] = useState(false);
    const [showDom, setShowDom] = useState(false);

    const handleFetch = async (e) => {
        if (e) e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError('');
        setHtml('');
        setSnippets('');
        setDomTree(null);
        setResults(null);
        setStep(0);

        try {
            const res = await fetchUrlHtml(url);
            setHtml(res.data.html);
            setStep(1);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to reach the destination URL.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = async () => {
        setLoading(true);
        setError('');

        try {
            const [signalsRes, domRes] = await Promise.all([
                extractUrlSignals(url, html),
                fetchDomTree(url, html)
            ]);
            setSnippets(signalsRes.data.snippets);
            setDomTree(domRes.data.dom_tree);

            const user = JSON.parse(localStorage.getItem('phishguard_currentUser') || '{}');
            const analysisRes = await analyzeUrl(url, html, user.id);
            setResults(analysisRes.data);
            setStep(2);
        } catch (err) {
            setError('Analysis failed. The content might be too complex for the current model.');
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setUrl('');
        setHtml('');
        setResults(null);
        setStep(0);
        setError('');
        setShowCode(false);
        setShowDom(false);
        setShowFullHtml(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-6">
            <div className="text-center md:text-left space-y-2">
                <h2 className="text-4xl font-black text-emerald-950 tracking-tight">Analyze <span className="text-emerald-500 italic">URL</span></h2>
                <p className="text-emerald-900/40 text-lg font-medium italic">Check websites for phishing threats and suspicious code.</p>
            </div>

            {/* Step 0: URL Input */}
            {step === 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-10 rounded-[3rem] border border-emerald-100 shadow-[0_32px_64px_-16px_rgba(6,78,59,0.06)]"
                >
                    <form onSubmit={handleFetch} className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.3em] ml-4">Enter website URL</label>
                            <div className="relative group">
                                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-200 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full bg-emerald-50/30 border border-emerald-100 rounded-[2rem] py-6 pl-16 pr-8 text-emerald-950 placeholder:text-emerald-900/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all font-bold text-lg"
                                    placeholder="https://example.com"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-emerald-950 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-[0.4em] rounded-3xl shadow-2xl shadow-emerald-500/10 transition-all active:scale-95 flex items-center justify-center gap-4"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    <span>Fetch HTML Code</span>
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            )}

            {/* Step 1: HTML Fetched, Ready for Analysis */}
            {step === 1 && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                >
                    {/* Status Card */}
                    <div className="bg-emerald-950 p-10 rounded-[3rem] text-center shadow-2xl shadow-emerald-950/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]"></div>
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                            <Code2 className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-white italic">HTML Code Fetched</h3>
                            <p className="text-emerald-400/50 text-[10px] uppercase font-black tracking-[0.3em]">Ready to analyze for threats</p>
                        </div>
                    </div>

                    {/* HTML Code Block (Always Visible Now) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-[3rem] border border-emerald-100 shadow-xl overflow-hidden"
                    >
                        <div className="flex items-center gap-2 mb-4 text-emerald-900/20">
                            <Code2 className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Fetched HTML Code</span>
                        </div>
                        <pre className="text-[10px] text-emerald-700 font-mono overflow-auto max-h-[350px] leading-relaxed custom-scrollbar bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100/50 italic">
                            <code>{html}</code>
                        </pre>
                    </motion.div>

                    {/* Action Buttons Below the Code */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="px-12 py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-xs rounded-3xl transition-all active:scale-95 flex items-center gap-4 shadow-xl shadow-emerald-500/20"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Search className="w-5 h-5" />}
                            Analyze URL
                        </button>
                        <button
                            onClick={() => setStep(0)}
                            className="px-10 py-6 bg-white hover:bg-emerald-50 text-emerald-900 font-black uppercase tracking-widest text-xs rounded-3xl transition-all border border-emerald-100 shadow-sm"
                        >
                            Go Back
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4 text-red-600 text-xs font-bold shadow-sm"
                    >
                        <AlertCircle className="w-6 h-6 flex-shrink-0" />
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="ml-auto text-[10px] uppercase tracking-widest bg-red-100 px-3 py-1 rounded-lg">Dismiss</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Step 2: Results Display */}
            {step === 2 && results && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                >
                    <ResultCard {...results} />

                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                            <h3 className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.3em]">Technical Details</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                <button 
                                    onClick={() => setShowCode(!showCode)}
                                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${showCode ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50 shadow-sm'}`}
                                >
                                    Code Snippets
                                </button>
                                <button 
                                    onClick={() => setShowDom(!showDom)}
                                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${showDom ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50 shadow-sm'}`}
                                >
                                    DOM Blueprint
                                </button>
                                <button 
                                    onClick={reset}
                                    className="px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100"
                                >
                                    New Analysis
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
                                    <div className="bg-emerald-950 p-10 rounded-[3rem] border border-emerald-800/20 shadow-2xl">
                                        <div className="flex items-center gap-2 mb-6 text-emerald-400">
                                            <Code2 className="w-5 h-5" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Heuristic Signal Discovery</span>
                                        </div>
                                        <pre className="text-xs text-emerald-300 font-mono overflow-auto max-h-[400px] leading-loose custom-scrollbar bg-black/20 p-8 rounded-2xl italic">
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
                                    <div className="bg-white p-10 rounded-[3rem] border border-emerald-100 shadow-2xl">
                                        <div className="flex items-center gap-2 mb-6 text-emerald-600">
                                            <div className="w-4 h-4 border-2 border-emerald-600 rounded-sm" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Live Document Model</span>
                                        </div>
                                        <DomTreeView tree={domTree} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}

            {loading && step === 0 && <Loader text="Securing connection to destination..." />}
            {loading && step === 1 && <Loader text="Analyzing document structure..." />}
        </div>
    );
};



export default UrlAnalysis;
