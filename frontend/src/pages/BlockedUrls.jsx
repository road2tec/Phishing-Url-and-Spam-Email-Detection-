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
        <div className="space-y-10 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black text-emerald-950 mb-3 tracking-tight underline decoration-emerald-100 underline-offset-8">Blocked Registry</h2>
                    <p className="text-emerald-900/40 font-bold uppercase tracking-widest text-[10px]">Real-time enforcement protocol logs enabled</p>
                </div>
                <button
                    onClick={loadBlocklist}
                    className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition-all shadow-sm"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] border border-emerald-100 shadow-[0_32px_64px_-16px_rgba(6,78,59,0.06)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-emerald-50/50">
                                <th className="px-10 py-6 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">Blocked Signature</th>
                                <th className="px-10 py-6 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">Risk Variance</th>
                                <th className="px-10 py-6 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">Neural Reasons</th>
                                <th className="px-10 py-6 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] text-right">Overrides</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50">
                            {blockedList.map((item, i) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={i}
                                    className="hover:bg-emerald-50/20 transition-all group"
                                >
                                    <td className="px-10 py-7">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-emerald-950 font-bold truncate max-w-[300px] font-mono group-hover:text-emerald-600 transition-colors">{item.url}</span>
                                            <span className="text-[10px] text-emerald-900/30 truncate max-w-[300px] flex items-center gap-2 mt-1 font-black uppercase">
                                                <Clock className="w-3 h-3" /> {new Date(item.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black bg-red-50 text-red-600 border border-red-100 uppercase tracking-widest">
                                            {item.risk_score}% RISK
                                        </span>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="max-w-[250px] space-y-2">
                                            {item.reasons?.slice(0, 2).map((r, idx) => (
                                                <div key={idx} className="text-[10px] text-emerald-900/40 font-bold uppercase tracking-wide flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-300"></div>
                                                    {r}
                                                </div>
                                            ))}
                                            {item.reasons?.length > 2 && (
                                                <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-3">
                                                    + {item.reasons.length - 2} Additional Vectors
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => handleMarkSafe(item.url)}
                                                className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm group/btn"
                                                title="Re-classify as Legitimate"
                                            >
                                                <CheckCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                onClick={() => handleRemove(item.url)}
                                                className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm group/btn"
                                                title="Purge from Registry"
                                            >
                                                <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {blockedList.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                                <ShieldAlert className="w-10 h-10 text-emerald-200" />
                                            </div>
                                            <p className="text-emerald-900/20 font-black uppercase tracking-widest italic text-sm">Blocklist registry is currently zeroed.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BlockedUrls;
