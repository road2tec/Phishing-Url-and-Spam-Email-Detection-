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
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Blocked Registry</h2>
                    <p className="text-white/50 text-sm">URLs automatically blocked by PhishGuard Pro real-time enforcement.</p>
                </div>
                <button
                    onClick={loadBlocklist}
                    className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="glass-morphism overflow-hidden rounded-3xl border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/2">
                                <th className="px-8 py-4 text-xs font-bold text-white/30 uppercase tracking-widest">Blocked URL</th>
                                <th className="px-8 py-4 text-xs font-bold text-white/30 uppercase tracking-widest">Risk %</th>
                                <th className="px-8 py-4 text-xs font-bold text-white/30 uppercase tracking-widest">Reason(s)</th>
                                <th className="px-8 py-4 text-xs font-bold text-white/30 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {blockedList.map((item, i) => (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={i}
                                    className="hover:bg-white/2 transition-colors"
                                >
                                    <td className="px-8 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-white font-medium truncate max-w-[300px]">{item.url}</span>
                                            <span className="text-[10px] text-white/30 truncate max-w-[300px] flex items-center gap-1">
                                                <Clock className="w-2 h-2" /> {new Date(item.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded">
                                            {item.risk_score}%
                                        </span>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="max-w-[250px] space-y-1">
                                            {item.reasons?.slice(0, 2).map((r, idx) => (
                                                <div key={idx} className="text-[10px] text-white/50 leading-tight">
                                                    • {r}
                                                </div>
                                            ))}
                                            {item.reasons?.length > 2 && <div className="text-[10px] text-emerald-400">+{item.reasons.length - 2} more reasons</div>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleMarkSafe(item.url)}
                                                className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                                                title="Mark as Safe (Admin Override)"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleRemove(item.url)}
                                                className="p-2 text-white/30 hover:text-white/70 hover:bg-white/5 rounded-lg transition-all"
                                                title="Remove from list"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {blockedList.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-12 text-center text-white/20 text-sm">
                                        <div className="flex flex-col items-center gap-2">
                                            <ShieldAlert className="w-8 h-8 opacity-20" />
                                            <span>No URLs currently in the blocklist.</span>
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
