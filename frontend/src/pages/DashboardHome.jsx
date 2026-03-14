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
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-10">
                <div className="relative">
                    <div className="w-32 h-32 border-[12px] border-white/5 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_50px_rgba(16,185,129,0.2)]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-12 h-12 text-emerald-400 animate-pulse" />
                    </div>
                </div>
                <div className="text-center space-y-3">
                    <h3 className="text-3xl font-black text-white uppercase tracking-[0.4em]">Initializing <span className="text-gradient-emerald">Nexus</span></h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing Security Feeds...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-12 relative animate-fade-in">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

            {/* Header Section */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
                <div className="space-y-5">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-card border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] shadow-lg"
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                        Neural Grid Monitor: Online
                    </motion.div>
                    <div>
                        <h2 className="text-6xl font-black text-white tracking-tighter leading-none uppercase">
                            Security <span className="text-gradient-emerald">Nexus</span>
                        </h2>
                        <p className="text-slate-400 text-xl font-medium mt-4">Commanding Officer: <span className="text-white font-black underline decoration-emerald-500/30 underline-offset-8">{user?.name || 'Vanguard'}</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {error && (
                        <div className="px-6 py-4 glass-card border-red-500/20 rounded-3xl flex items-center gap-4 text-red-400 text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-red-500/5">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}
                    <div className="hidden md:flex items-center gap-4 px-8 py-4 glass-card border-white/5 rounded-[2rem] text-white shadow-xl">
                        <Clock className="w-5 h-5 text-emerald-400" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
            >
                {statCards.map((stat, i) => (
                    <StatCard key={i} {...stat} color={stat.color === 'cyan' ? 'cyan' : stat.color} />
                ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
                {/* 7-Day Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 glass-card p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="p-5 rounded-[2rem] glass-card border-white/10 group-hover:rotate-6 transition-transform shadow-xl">
                                <TrendingUp className="w-8 h-8 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Forensic Velocity</h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Grid Throughput Logistics</p>
                            </div>
                        </div>
                        <div className="w-14 h-14 flex items-center justify-center rounded-[1.5rem] glass-card border-white/5 text-emerald-400 shadow-inner">
                             <ArrowUpRight className="w-7 h-7" />
                        </div>
                    </div>

                    <div className="h-[380px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={activityData} barSize={50}>
                                <CartesianGrid strokeDasharray="6 6" stroke="#ffffff05" vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    stroke="#ffffff20"
                                    fontSize={10}
                                    fontWeight={900}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={20}
                                    tickFormatter={(val) => val.toUpperCase()}
                                />
                                <YAxis
                                    stroke="#ffffff20"
                                    fontSize={10}
                                    fontWeight={900}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-20}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '2rem',
                                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                        padding: '24px',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                    itemStyle={{ color: '#10b981', fontWeight: 900, fontSize: '15px' }}
                                    labelStyle={{ color: '#94a3b8', marginBottom: '8px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px' }}
                                />
                                <Bar dataKey="count" radius={[15, 15, 15, 15]}>
                                    {activityData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill="#10b981"
                                            fillOpacity={0.7}
                                            stroke="#10b98140"
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Bar>
                            </ReBarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Risk Distribution Pie */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group"
                >
                    <div className="flex items-center gap-6 mb-12 relative z-10">
                        <div className="p-5 rounded-[2rem] glass-card border-white/10 group-hover:-rotate-6 transition-transform shadow-xl">
                            <BarChart className="w-8 h-8 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Threat Map</h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Risk Vector Spread</p>
                        </div>
                    </div>

                    <div className="h-[380px] w-full flex flex-col items-center justify-center relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Threats', value: stats?.phishing_count || 0, color: '#f43f5e' },
                                        { name: 'Authorized', value: stats?.legitimate_count || 0, color: '#10b981' }
                                    ]}
                                    innerRadius={100}
                                    outerRadius={135}
                                    paddingAngle={12}
                                    dataKey="value"
                                    cornerRadius={18}
                                    stroke="none"
                                >
                                    {[
                                        { name: 'Threats', value: stats?.phishing_count || 0, color: '#f43f5e' },
                                        { name: 'Authorized', value: stats?.legitimate_count || 0, color: '#10b981' }
                                    ].map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.color} 
                                            fillOpacity={0.8}
                                            stroke={entry.color}
                                            strokeOpacity={0.2}
                                            strokeWidth={10}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '1.5rem',
                                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.4)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    itemStyle={{ fontWeight: 900, color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Custom Legend */}
                        <div className="flex items-center gap-10 mt-[-20px]">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                                <span className="text-slate-300 font-black text-[10px] uppercase tracking-[0.2em]">Secure</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
                                <span className="text-slate-300 font-black text-[10px] uppercase tracking-[0.2em]">Infected</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Scans Table */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-[4rem] border border-white/5 shadow-2xl overflow-hidden"
            >
                <div className="p-12 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 bg-white/[0.02]">
                    <div className="flex items-center gap-8">
                        <div className="p-5 rounded-[2.5rem] glass-card border-white/10 shadow-2xl">
                            <Clock className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Intelligence Feed</h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Live Forensic Extraction Logs</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 px-6 py-3 bg-emerald-500/5 rounded-full border border-emerald-500/10 shadow-inner">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                        <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em]">Real-time Telemetry</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.01]">
                                <th className="px-12 py-8 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Intelligence Type</th>
                                <th className="px-12 py-8 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Payload Metadata</th>
                                <th className="px-12 py-8 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Threat Level</th>
                                <th className="px-12 py-8 text-[10px] font-black text-white/30 uppercase tracking-[0.4em] text-right">Verdict</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats?.recent_scans?.filter(scan => {
                                if (import.meta.env.VITE_ENABLE_EMAIL_ANALYSIS === 'false' && scan.type === 'email_analysis') return false;
                                return true;
                            }).map((scan, i) => (
                                <tr key={i} className="hover:bg-white/[0.03] transition-all group">
                                    <td className="px-12 py-9">
                                        <div className="flex items-center gap-5">
                                            <div className={`p-3 rounded-2xl glass-card border-white/10 shadow-xl ${scan.type === 'email_analysis' ? 'text-cyan-400' : 'text-emerald-400'}`}>
                                                {scan.type === 'email_analysis' ? <Mail className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                                            </div>
                                            <span className="text-[11px] font-black text-white uppercase tracking-widest">{scan.type.replace('_', ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-9">
                                        <div className="flex flex-col">
                                            <span className="text-base font-bold text-slate-400 group-hover:text-white transition-colors truncate max-w-[400px] font-mono tracking-tight underline decoration-white/5">
                                                {scan.input}
                                            </span>
                                            <span className="text-[9px] text-slate-600 mt-2 font-black uppercase tracking-[0.2em]">Secure Data Stream</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-9">
                                        <div className="flex items-center gap-5">
                                            <div className="w-40 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner p-[2px]">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${scan.risk_score}%` }}
                                                    transition={{ duration: 1.2, delay: i * 0.08 }}
                                                    className={`h-full rounded-full shadow-[0_0_10px_currentColor] ${scan.risk_score > 70 ? 'bg-rose-500 text-rose-500/50' :
                                                        scan.risk_score > 40 ? 'bg-amber-400 text-amber-400/50' : 'bg-emerald-500 text-emerald-500/50'
                                                        }`}
                                                />
                                            </div>
                                            <span className="text-[12px] font-black text-white">{scan.risk_score}%</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-9 text-right">
                                        <span className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border transition-all ${scan.prediction === 'Phishing'
                                            ? 'bg-rose-600/90 border-rose-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.3)]'
                                            : 'bg-emerald-600/90 border-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                                            }`}>
                                            {scan.prediction === 'Phishing' ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                            {scan.prediction}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(!stats?.recent_scans || stats.recent_scans.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="px-12 py-32 text-center">
                                        <div className="flex flex-col items-center gap-8">
                                            <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center border border-white/5 shadow-2xl">
                                                <Activity className="w-12 h-12 text-white/10" />
                                            </div>
                                            <p className="text-slate-600 font-black uppercase tracking-[0.5em] text-sm">No forensic anomalies detected in current sector.</p>
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
