import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, Code2, AlertCircle, ChevronDown, ChevronUp, Terminal, Activity } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto space-y-12 py-6">
            <div className="text-center md:text-left space-y-3">
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase">
                    Analyze <span className="text-gradient-emerald">URL</span>
                </h2>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-[2px] bg-emerald-500/50"></div>
                    <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Deep Security Forensics Engine</p>
                </div>
            </div>

            {/* Step 0: URL Input */}
            {step === 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -z-10 group-hover:bg-emerald-500/10 transition-colors"></div>
                    
                    <form onSubmit={handleFetch} className="space-y-10">
                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] ml-6 flex items-center gap-2">
                                <Search className="w-3 h-3 text-emerald-500" />
                                Target Intelligence Pointer
                            </label>
                            <div className="relative group/input">
                                <Globe className="absolute left-8 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-[2.5rem] py-7 pl-20 pr-10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all font-bold text-xl tracking-tight"
                                    placeholder="https://suspect-site.com"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-7 text-xs uppercase tracking-[0.4em] rounded-[2rem]"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <div className="flex items-center justify-center gap-4">
                                    <Terminal className="w-5 h-5" />
                                    <span>Fetch HTML Code</span>
                                </div>
                            )}
                        </button>
                    </form>
                </motion.div>
            )}

            {/* Step 1: HTML Fetched */}
            {step === 1 && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-10"
                >
                    {/* Status Console Style */}
                    <div className="glass-card p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] -z-10"></div>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                <Code2 className="w-10 h-10 text-emerald-400" />
                            </div>
                            <div className="text-center md:text-left space-y-2">
                                <h3 className="text-2xl font-black text-white tracking-tight uppercase">Codebase Retrieved</h3>
                                <p className="text-emerald-400/50 text-[10px] uppercase font-black tracking-[0.3em] flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    Payload successfully extracted from {new URL(url).hostname}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* HTML Terminal View */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8 rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6 px-4">
                            <div className="flex items-center gap-3 text-white/30">
                                <Code2 className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Source Buffer (Ready)</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-white/5"></div>
                                <div className="w-3 h-3 rounded-full bg-white/5"></div>
                                <div className="w-3 h-3 rounded-full bg-white/5"></div>
                            </div>
                        </div>
                        <pre className="text-[11px] text-emerald-400/80 font-mono overflow-auto max-h-[400px] leading-relaxed custom-scrollbar bg-black/40 p-10 rounded-[2.5rem] border border-white/5">
                            <code>{html}</code>
                        </pre>
                    </motion.div>

                    {/* Action Hub */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="btn-primary flex items-center justify-center gap-4 px-16 py-7 text-xs uppercase tracking-[0.3em] rounded-[2rem]"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Search className="w-5 h-5" />}
                            Run Forensics
                        </button>
                        <button
                            onClick={() => setStep(0)}
                            className="btn-outline px-12 py-7 text-xs uppercase tracking-[0.3em] rounded-[2rem]"
                        >
                            Reset Buffer
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Results Section */}
            {step === 2 && results && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <ResultCard {...results} />

                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 glass-card rounded-xl flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Forensic Telemetry</h3>
                            </div>
                            
                            <div className="flex flex-wrap justify-center gap-4">
                                <button 
                                    onClick={() => setShowCode(!showCode)}
                                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${showCode ? 'bg-emerald-600 text-white border-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'glass-card text-emerald-400 border-white/5 hover:border-emerald-500/30'}`}
                                >
                                    Logic Snippets
                                </button>
                                <button 
                                    onClick={() => setShowDom(!showDom)}
                                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${showDom ? 'bg-emerald-600 text-white border-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'glass-card text-emerald-400 border-white/5 hover:border-emerald-500/30'}`}
                                >
                                    DOM Blueprint
                                </button>
                                <button 
                                    onClick={reset}
                                    className="px-8 py-4 glass-card text-slate-400 hover:text-white border-white/5 hover:border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    New Scan
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
                                    <div className="glass-card p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -z-10"></div>
                                        <div className="flex items-center gap-3 mb-8 text-emerald-400">
                                            <Terminal className="w-5 h-5" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Heuristic Signal Discoveries</span>
                                        </div>
                                        <pre className="text-xs text-emerald-300 font-mono overflow-auto max-h-[500px] leading-loose custom-scrollbar bg-black/60 p-10 rounded-[2.5rem] border border-white/5 shadow-inner">
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
                                    <div className="glass-card p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px] -z-10"></div>
                                        <div className="flex items-center gap-3 mb-8 text-cyan-400">
                                            <div className="w-5 h-5 glass-card border-cyan-400 flex items-center justify-center p-1">
                                                <div className="w-full h-full bg-cyan-400 rounded-sm"></div>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Structural Document Mapping</span>
                                        </div>
                                        <div className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-white/5">
                                            <DomTreeView tree={domTree} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}

            {loading && step === 0 && <Loader text="Negotiating destination handshakes..." />}
            {loading && step === 1 && <Loader text="Conducting multi-layered structural scan..." />}
        </div>
    );
};



export default UrlAnalysis;
