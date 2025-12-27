import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe,
    Mail,
    ShieldAlert,
    ShieldCheck,
    BarChart,
    Activity,
    Clock,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { fetchDashboardStats } from '../utils/api';
import {
    BarChart as ReBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';

const DashboardHome = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadStats = async () => {
        try {
            const res = await fetchDashboardStats();
            setStats(res.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch dashboard stats:', err);
            setError('Could not connect to live data. Please check backend.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
        // Polling every 10 seconds
        const interval = setInterval(loadStats, 10000);
        return () => clearInterval(interval);
    }, []);

    const statCards = stats ? [
        { title: 'Total Scans', value: stats.total_scans, icon: Activity, color: 'emerald', trend: 'Live', trendUp: true },
        { title: 'Phishing', value: stats.phishing_count, icon: ShieldAlert, color: 'red', trend: stats.total_scans > 0 ? `${((stats.phishing_count / stats.total_scans) * 100).toFixed(1)}%` : '0%', trendUp: false },
        { title: 'Legitimate', value: stats.legitimate_count, icon: ShieldCheck, color: 'emerald', trend: stats.total_scans > 0 ? `${((stats.legitimate_count / stats.total_scans) * 100).toFixed(1)}%` : '0%', trendUp: true },
        { title: 'Recent Activity', value: stats.recent_scans?.length || 0, icon: Clock, color: 'mint', trend: 'Last 10', trendUp: true },
    ] : [];

    const activityData = stats?.weekly_activity || [];

    const distributionData = stats ? [
        { name: 'URL Scans', value: stats.url_scans },
        { name: 'Email Scans', value: stats.email_scans },
    ] : [];

    const COLORS = ['#10b981', '#34d399']; // Emerald and Mint

    if (loading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-emerald-400 font-medium animate-pulse">Syncing live dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Live Security Dashboard</h2>
                    <p className="text-white/50 text-sm">Real-time monitoring of global phishing scan activities.</p>
                </div>
                {error && (
                    <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {statCards.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 7-Day Activity Chart */}
                <div className="lg:col-span-2 glass-morphism p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            <h3 className="text-xl font-bold text-white">7-Day Analysis Feed</h3>
                        </div>
                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Past Week</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="day" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ color: '#10b981' }}
                                    labelStyle={{ color: '#ffffff50', marginBottom: '4px' }}
                                />
                                <Bar dataKey="count" fill="url(#emeraldGradient)" radius={[6, 6, 0, 0]}>
                                    {activityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fillOpacity={0.8 + (index * 0.03)} />
                                    ))}
                                </Bar>
                                <defs>
                                    <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#064e3b" />
                                    </linearGradient>
                                </defs>
                            </ReBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Distribution Pie */}
                <div className="glass-morphism p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-8">
                        <BarChart className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-xl font-bold text-white">Threat Level</h3>
                    </div>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Phishing', value: stats?.phishing_count || 0 },
                                        { name: 'Legitimate', value: stats?.legitimate_count || 0 }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="#ef4444" /> {/* Red for phishing */}
                                    <Cell fill="#10b981" /> {/* Emerald for legimate */}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Scans Table */}
            <div className="glass-morphism overflow-hidden rounded-3xl border border-white/5">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-xl font-bold text-white">Recent Analysis Registry</h3>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">Real-time Feed</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/2">
                                <th className="px-8 py-4 text-xs font-bold text-white/30 uppercase tracking-widest">Type</th>
                                <th className="px-8 py-4 text-xs font-bold text-white/30 uppercase tracking-widest">Input Preview</th>
                                <th className="px-8 py-4 text-xs font-bold text-white/30 uppercase tracking-widest">Risk Score</th>
                                <th className="px-8 py-4 text-xs font-bold text-white/30 uppercase tracking-widest text-right">Prediction</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats?.recent_scans?.map((scan, i) => (
                                <tr key={i} className="hover:bg-white/2 transition-colors">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-2">
                                            {scan.type === 'email_analysis' ? (
                                                <Mail className="w-4 h-4 text-emerald-400/70" />
                                            ) : (
                                                <Globe className="w-4 h-4 text-mint-400/70" />
                                            )}
                                            <span className="text-xs text-white/70 capitalize">{scan.type.replace('_', ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="text-sm text-white/90 font-medium truncate max-w-[200px] block">
                                            {scan.input}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${scan.risk_score > 50 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${scan.risk_score}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-white/50">{scan.risk_score}%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${scan.prediction === 'Phishing' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                            {scan.prediction}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(!stats?.recent_scans || stats.recent_scans.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-12 text-center text-white/20 text-sm">No recent scan history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
