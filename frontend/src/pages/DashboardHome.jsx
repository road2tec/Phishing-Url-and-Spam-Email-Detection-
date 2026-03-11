import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Globe,
    Mail,
    ShieldAlert,
    ShieldCheck,
    BarChart,
    Activity,
    Clock,
    TrendingUp,
    AlertCircle,
    ArrowUpRight
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
    const [user, setUser] = useState(null);

    const loadStats = async () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('phishguard_currentUser') || '{}');
            setUser(currentUser);

            const res = await fetchDashboardStats(currentUser.id);
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
        { title: 'Recent Activity', value: stats.recent_scans?.length || 0, icon: Clock, color: 'cyan', trend: 'Last 10', trendUp: true },
    ] : [];

    const activityData = stats?.weekly_activity || [];

    if (loading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-8 h-8 text-emerald-500 animate-pulse" />
                    </div>
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Syncing Dashboard</h3>
                    <p className="text-white/40">Establishing secure connection...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 relative animate-fade-in">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Header Section */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Online
                    </motion.div>
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 capitalize">{user?.name || 'Agent'}</span>
                    </h2>
                    <p className="text-white/60 text-lg">Here's your threat intelligence overview for today.</p>
                </div>

                <div className="flex items-center gap-4">
                    {error && (
                        <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm font-medium">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                    <button className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all">
                        <Clock className="w-4 h-4 text-white/50" />
                        <span className="text-sm font-medium">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
            >
                {statCards.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* 7-Day Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 glass-morphism p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group"
                >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                <TrendingUp className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Scan Activity</h3>
                                <p className="text-white/40 text-sm">7-Day Performance Metric</p>
                            </div>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="h-[320px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={activityData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    stroke="#ffffff40"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#ffffff40"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip
                                    cursor={{ fill: '#ffffff05' }}
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        border: '1px solid #ffffff10',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                                    }}
                                    itemStyle={{ color: '#10b981', fontWeight: 600 }}
                                    labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}
                                />
                                <Bar dataKey="count" radius={[8, 8, 8, 8]}>
                                    {activityData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`url(#barGradient-${index})`}
                                            stroke="rgba(255,255,255,0.05)"
                                            strokeWidth={1}
                                        />
                                    ))}
                                </Bar>
                                <defs>
                                    {activityData.map((entry, index) => (
                                        <linearGradient key={`barGradient-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.2} />
                                        </linearGradient>
                                    ))}
                                </defs>
                            </ReBarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Risk Distribution Pie */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-morphism p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-bl from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                            <BarChart className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Threat Distribution</h3>
                            <p className="text-white/40 text-sm">Phishing vs Legitimate</p>
                        </div>
                    </div>

                    <div className="h-[320px] w-full flex flex-col items-center justify-center relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Phishing', value: stats?.phishing_count || 0, color: '#ef4444' },
                                        { name: 'Legitimate', value: stats?.legitimate_count || 0, color: '#10b981' }
                                    ]}
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    cornerRadius={8}
                                    stroke="none"
                                >
                                    {[
                                        { name: 'Phishing', value: stats?.phishing_count || 0, color: '#ef4444' },
                                        { name: 'Legitimate', value: stats?.legitimate_count || 0, color: '#10b981' }
                                    ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        border: '1px solid #ffffff10',
                                        borderRadius: '12px'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Custom Legend */}
                        <div className="flex items-center gap-6 mt-[-40px]">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <span className="text-white/70 text-sm font-medium">Safe</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                <span className="text-white/70 text-sm font-medium">Phishing</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Scans Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-morphism rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden"
            >
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Live Analysis Feed</h3>
                            <p className="text-white/40 text-sm">Real-time scan logs</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live Updates</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02]">
                                <th className="px-8 py-5 text-xs font-bold text-white/40 uppercase tracking-widest">Scan Type</th>
                                <th className="px-8 py-5 text-xs font-bold text-white/40 uppercase tracking-widest">Input Data</th>
                                <th className="px-8 py-5 text-xs font-bold text-white/40 uppercase tracking-widest">Risk Analysis</th>
                                <th className="px-8 py-5 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Verdict</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats?.recent_scans?.filter(scan => {
                                if (import.meta.env.VITE_ENABLE_EMAIL_ANALYSIS === 'false' && scan.type === 'email_analysis') return false;
                                return true;
                            }).map((scan, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${scan.type === 'email_analysis' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                                                {scan.type === 'email_analysis' ? <Mail className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                            </div>
                                            <span className="text-sm font-medium text-white/80 capitalize">{scan.type.replace('_', ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm text-white/60 group-hover:text-white transition-colors truncate max-w-[250px] block font-mono">
                                            {scan.input}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${scan.risk_score}%` }}
                                                    className={`h-full rounded-full ${scan.risk_score > 70 ? 'bg-red-500' :
                                                        scan.risk_score > 40 ? 'bg-yellow-500' : 'bg-emerald-500'
                                                        }`}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-white/70">{scan.risk_score}%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${scan.prediction === 'Phishing'
                                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                            }`}>
                                            {scan.prediction === 'Phishing' ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                                            {scan.prediction}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(!stats?.recent_scans || stats.recent_scans.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-16 text-center text-white/30">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                                <Activity className="w-8 h-8 text-white/20" />
                                            </div>
                                            <p>No recent scan history found.</p>
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

export default DashboardHome;
