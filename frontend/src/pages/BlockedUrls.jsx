import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Trash2, CheckCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { fetchBlocklist, removeFromBlocklist, markUrlSafe } from '../utils/api';

const BlockedUrls = () => {
    const [blockedList, setBlockedList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadBlocklist = async () => {
        try {
            const res = await fetchBlocklist();
            setBlockedList(Array.isArray(res.data) ? res.data : []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch blocklist:', err);
            setError('Could not load blocked URLs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBlocklist();
        const interval = setInterval(loadBlocklist, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const handleMarkSafe = async (url) => {
        try {
            await markUrlSafe(url);
            loadBlocklist();
        } catch (err) {
            alert('Failed to mark as safe');
        }
    };

    const handleRemove = async (url) => {
        try {
            await removeFromBlocklist(url);
            loadBlocklist();
        } catch (err) {
            alert('Failed to remove from list');
        }
    };

    return (
        <div className="space-y-12 pb-12 relative animate-fade-in">
            {/* Ambient background glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/5 relative z-10">
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-card border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl"
                    >
                        <ShieldAlert className="w-4 h-4" />
                        Live Enforcement Registry
                    </motion.div>
                    <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        Blocked <span className="text-gradient-emerald">Registry</span>
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">Real-time containment protocol logs active</p>
                </div>
                <button
                    onClick={loadBlocklist}
                    className="p-5 glass-card text-emerald-400 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all shadow-2xl group active:scale-95"
                >
                    <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                </button>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 glass-card border-rose-500/20 rounded-[2rem] text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-5 shadow-2xl relative z-10"
                >
                    <ShieldAlert className="w-6 h-6" />
                    {error}
                </motion.div>
            )}

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-[4rem] border border-white/5 shadow-2xl overflow-hidden relative z-10"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.01]">
                                <th className="px-12 py-8 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Blocked Signature</th>
                                <th className="px-12 py-8 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Risk Variance</th>
                                <th className="px-12 py-8 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Neural Reasons</th>
                                <th className="px-12 py-8 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] text-right">Overrides</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {blockedList.map((item, i) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    key={i}
                                    className="hover:bg-white/[0.03] transition-all group"
                                >
                                    <td className="px-12 py-9">
                                        <div className="flex flex-col">
                                            <span className="text-base text-slate-300 font-bold truncate max-w-[350px] font-mono group-hover:text-white transition-colors underline decoration-white/5 underline-offset-4 tracking-tight">{item.url}</span>
                                            <span className="text-[9px] text-slate-600 truncate max-w-[300px] flex items-center gap-3 mt-3 font-black uppercase tracking-[0.2em]">
                                                <Clock className="w-3.5 h-3.5" /> Isolated at: {new Date(item.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-9">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                                            <span className="inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black glass-card border-rose-500/20 text-rose-400 uppercase tracking-[0.2em]">
                                                {item.risk_score}% CRITICAL
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-9">
                                        <div className="max-w-[300px] space-y-3">
                                            {item.reasons?.slice(0, 2).map((r, idx) => (
                                                <div key={idx} className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em] flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                                                    {r}
                                                </div>
                                            ))}
                                            {item.reasons?.length > 2 && (
                                                <div className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] ml-4">
                                                    + {item.reasons.length - 2} Forensic Vectors
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-12 py-9 text-right">
                                        <div className="flex items-center justify-end gap-5">
                                            <button
                                                onClick={() => handleMarkSafe(item.url)}
                                                className="p-4 glass-card text-emerald-400 rounded-2xl border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all shadow-xl group/btn"
                                                title="Authorization Override"
                                            >
                                                <CheckCircle className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                                            </button>
                                            <button
                                                onClick={() => handleRemove(item.url)}
                                                className="p-4 glass-card text-rose-400 rounded-2xl border border-white/5 hover:border-rose-500/40 hover:bg-rose-500/10 transition-all shadow-xl group/btn"
                                                title="Nuclear Purge"
                                            >
                                                <Trash2 className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {blockedList.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-12 py-32 text-center">
                                        <div className="flex flex-col items-center gap-10">
                                            <div className="w-28 h-28 rounded-full glass-card flex items-center justify-center border border-white/5 shadow-2xl relative">
                                                <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping"></div>
                                                <ShieldAlert className="w-14 h-14 text-white/5" />
                                            </div>
                                            <p className="text-slate-600 font-black uppercase tracking-[0.5em] text-sm">Registry zeroed. No threats contained.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default BlockedUrls;
