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
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                <div className="relative">
                    <div className="w-24 h-24 border-8 border-emerald-50 border-t-emerald-600 rounded-full animate-spin shadow-xl"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-10 h-10 text-emerald-600 animate-pulse" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-emerald-950 uppercase tracking-widest">Loading Dashboard</h3>
                    <p className="text-emerald-800/40 font-bold italic">Fetching latest security data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-12 relative animate-fade-in">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[150px] pointer-events-none -z-10"></div>

            {/* Header Section */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-emerald-100">
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                        System Monitoring Active
                    </motion.div>
                    <div>
                        <h2 className="text-5xl font-black text-emerald-950 tracking-tight leading-tight">
                            Security <span className="text-emerald-500 italic block sm:inline">Overview</span>
                        </h2>
                        <p className="text-emerald-900/50 text-xl font-medium mt-2">Welcome, <span className="text-emerald-950 font-black underline decoration-emerald-500/30">{user?.name || 'User'}</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {error && (
                        <div className="px-5 py-3 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-black uppercase shadow-lg shadow-red-500/5">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                    <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white border border-emerald-100 rounded-2xl text-emerald-950 shadow-sm">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-black uppercase tracking-widest">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
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
                    <StatCard key={i} {...stat} color={stat.color === 'cyan' ? 'emerald' : stat.color} />
                ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
                {/* 7-Day Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-emerald-100 shadow-[0_32px_64px_-16px_rgba(6,78,59,0.05)] relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="p-4 rounded-[1.5rem] bg-emerald-50 border border-emerald-100 group-hover:rotate-6 transition-transform">
                                <TrendingUp className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-emerald-950 tracking-tight">Activity Logistics</h3>
                                <p className="text-emerald-900/40 text-xs font-black uppercase tracking-widest">Last 48 Hours Performance</p>
                            </div>
                        </div>
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-400">
                             <ArrowUpRight className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="h-[350px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={activityData} barSize={45}>
                                <CartesianGrid strokeDasharray="4 4" stroke="#064e3b08" vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    stroke="#064e3b40"
                                    fontSize={10}
                                    fontWeight={800}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={15}
                                    tickFormatter={(val) => val.toUpperCase()}
                                />
                                <YAxis
                                    stroke="#064e3b40"
                                    fontSize={10}
                                    fontWeight={800}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-15}
                                />
                                <Tooltip
                                    cursor={{ fill: '#10b98108' }}
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #10b98120',
                                        borderRadius: '24px',
                                        boxShadow: '0 25px 50px -12px rgba(6,78,59,0.1)',
                                        padding: '16px'
                                    }}
                                    itemStyle={{ color: '#064e3b', fontWeight: 900, fontSize: '14px' }}
                                    labelStyle={{ color: '#10b981', marginBottom: '4px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}
                                />
                                <Bar dataKey="count" radius={[12, 12, 12, 12]}>
                                    {activityData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill="#10b981"
                                            fillOpacity={0.8}
                                            stroke="#064e3b20"
                                            strokeWidth={1}
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
                    className="bg-white p-10 rounded-[3rem] border border-emerald-100 shadow-[0_32px_64px_-16px_rgba(6,78,59,0.05)] relative overflow-hidden group"
                >
                    <div className="flex items-center gap-5 mb-10 relative z-10">
                        <div className="p-4 rounded-[1.5rem] bg-indigo-50 border border-indigo-100 group-hover:-rotate-6 transition-transform">
                            <BarChart className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-emerald-950 tracking-tight">Threat Stats</h3>
                            <p className="text-emerald-900/40 text-xs font-black uppercase tracking-widest">Risk Category Distribution</p>
                        </div>
                    </div>

                    <div className="h-[350px] w-full flex flex-col items-center justify-center relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Phishing', value: stats?.phishing_count || 0, color: '#ef4444' },
                                        { name: 'Legitimate', value: stats?.legitimate_count || 0, color: '#10b981' }
                                    ]}
                                    innerRadius={90}
                                    outerRadius={120}
                                    paddingAngle={10}
                                    dataKey="value"
                                    cornerRadius={12}
                                    stroke="none"
                                >
                                    {[
                                        { name: 'Phishing', value: stats?.phishing_count || 0, color: '#ef4444' },
                                        { name: 'Legitimate', value: stats?.legitimate_count || 0, color: '#10b981' }
                                    ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #eeeeee',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Custom Legend */}
                        <div className="flex items-center gap-10 mt-[-30px]">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30"></div>
                                <span className="text-emerald-950 font-black text-xs uppercase tracking-widest">Secure</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/30"></div>
                                <span className="text-emerald-950 font-black text-xs uppercase tracking-widest">Threat</span>
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
                className="bg-white rounded-[3rem] border border-emerald-100 shadow-[0_32px_64px_-16px_rgba(6,78,59,0.05)] overflow-hidden"
            >
                <div className="p-10 border-b border-emerald-50 flex items-center justify-between bg-emerald-50/20">
                    <div className="flex items-center gap-6">
                        <div className="p-4 rounded-[1.50rem] bg-white border border-emerald-100 shadow-sm">
                            <Clock className="w-8 h-8 text-emerald-950" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-emerald-950 tracking-tight">Recent Scans</h3>
                            <p className="text-emerald-900/40 text-xs font-black uppercase tracking-widest">Detailed analysis logs</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-emerald-100/50 rounded-full border border-emerald-200/50">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">Live Tracking</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-emerald-50/10">
                                <th className="px-10 py-6 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">Scan Type</th>
                                <th className="px-10 py-6 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">Input Content</th>
                                <th className="px-10 py-6 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">Risk Score</th>
                                <th className="px-10 py-6 text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] text-right">Verdict</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50">
                            {stats?.recent_scans?.filter(scan => {
                                if (import.meta.env.VITE_ENABLE_EMAIL_ANALYSIS === 'false' && scan.type === 'email_analysis') return false;
                                return true;
                            }).map((scan, i) => (
                                <tr key={i} className="hover:bg-emerald-50/30 transition-all group">
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2.5 rounded-xl border ${scan.type === 'email_analysis' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                                {scan.type === 'email_analysis' ? <Mail className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                            </div>
                                            <span className="text-xs font-black text-emerald-950 uppercase italic tracking-widest">{scan.type.replace('_', ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-emerald-900/60 group-hover:text-emerald-950 transition-colors truncate max-w-[300px] font-mono leading-none">
                                                {scan.input}
                                            </span>
                                            <span className="text-[10px] text-emerald-800/20 mt-1 font-black uppercase">Data payload analyzed</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-32 h-2.5 bg-emerald-50 rounded-full overflow-hidden border border-emerald-100/50 shadow-inner">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${scan.risk_score}%` }}
                                                    transition={{ duration: 1, delay: i * 0.05 }}
                                                    className={`h-full rounded-full ${scan.risk_score > 70 ? 'bg-red-500' :
                                                        scan.risk_score > 40 ? 'bg-orange-400' : 'bg-emerald-500'
                                                        }`}
                                                />
                                            </div>
                                            <span className="text-[11px] font-black text-emerald-950">{scan.risk_score}%</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 text-right">
                                        <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${scan.prediction === 'Phishing'
                                            ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-200'
                                            : 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200'
                                            }`}>
                                            {scan.prediction === 'Phishing' ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                                            {scan.prediction}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(!stats?.recent_scans || stats.recent_scans.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                                <Activity className="w-10 h-10 text-emerald-200" />
                                            </div>
                                            <p className="text-emerald-900/20 font-black uppercase tracking-widest italic text-sm">No forensic logs isolated in this sector.</p>
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
