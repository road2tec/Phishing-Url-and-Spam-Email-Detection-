import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        setTimeout(() => {
            try {
                const existingUsers = JSON.parse(localStorage.getItem('phishguard_users') || '[]');
                const user = existingUsers.find(u => u.email === formData.email && u.password === formData.password);

                if (user) {
                    localStorage.setItem('phishguard_currentUser', JSON.stringify(user));
                    navigate('/dashboard');
                } else {
                    setError('Access Denied. Invalid security credentials.');
                }
            } catch (err) {
                setError('Authentication failed. Core system error.');
            } finally {
                setLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col pt-20">
            <Navbar ToggleSidebar={() => { }} />

            {/* Futuristic Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full cyber-grid opacity-20 pointer-events-none -z-10"></div>
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <div className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-xl w-full"
                >
                    <div className="text-center mb-12">
                        <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] glass-card border-white/10 mb-8 shadow-2xl relative group"
                        >
                            <div className="absolute inset-0 bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
                            <Shield className="w-12 h-12 text-emerald-400 relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                        </motion.div>
                        <h2 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase italic leading-none">
                            System <span className="text-gradient-emerald">Access</span>
                        </h2>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-8 h-[1px] bg-emerald-500/30"></div>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Security Clearance Required</p>
                            <div className="w-8 h-[1px] bg-emerald-500/30"></div>
                        </div>
                    </div>

                    <div className="glass-card p-12 md:p-16 rounded-[4rem] border border-white/5 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        {/* Decorative inner glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none -z-10"></div>

                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400 text-xs font-bold shadow-inner"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-6">Registry Identifier</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-[2rem] py-6 pl-20 pr-10 text-white placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all font-bold text-base tracking-tight"
                                        placeholder="Identification Email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center ml-6">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Pass-Key</label>
                                    <button type="button" className="text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors">Recover?</button>
                                </div>
                                <div className="relative group/input">
                                    <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" />
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-[2rem] py-6 pl-20 pr-10 text-white placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all font-bold text-base tracking-tight"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full py-7 text-[10px] uppercase tracking-[0.4em]"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-4 group">
                                            <span>Authorize Access</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-14 pt-10 border-t border-white/5 text-center">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                Unauthorized Entity?{' '}
                                <Link to="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-[12px] decoration-emerald-900/50">Register Profile</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};


export default Login;
