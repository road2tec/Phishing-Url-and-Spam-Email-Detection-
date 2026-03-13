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
                    setError('Invalid credentials. Please verify your details.');
                }
            } catch (err) {
                setError('Authentication failed. System error.');
            } finally {
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-white relative overflow-hidden flex flex-col pt-20">
            <Navbar ToggleSidebar={() => { }} />

            {/* Subtle Animated Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50/50 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl w-full"
                >
                    <div className="text-center mb-10">
                        <motion.div 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100 mb-8 shadow-sm group"
                        >
                            <Shield className="w-10 h-10 text-emerald-600 group-hover:rotate-12 transition-transform duration-500" />
                        </motion.div>
                        <h2 className="text-4xl font-black text-emerald-950 mb-3 tracking-tighter uppercase italic leading-none">Welcome <span className="text-emerald-500">Back</span></h2>
                        <p className="text-emerald-900/40 font-bold italic text-sm">Access your secure dashboard to manage URL scans.</p>
                    </div>

                    <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-emerald-100 shadow-[0_32px_64px_-16px_rgba(6,78,59,0.08)] relative overflow-hidden">
                        {/* Decorative inner glow */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50/50 rounded-full blur-3xl pointer-events-none"></div>

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600 text-xs font-bold shadow-sm"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-4">Email Address</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-200 group-focus-within/input:text-emerald-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-emerald-50/30 border border-emerald-100 rounded-3xl py-5 pl-16 pr-8 text-emerald-950 placeholder:text-emerald-900/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all font-bold text-sm tracking-wide"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center ml-4">
                                    <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em]">Password</label>
                                    <button type="button" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors">Forgot?</button>
                                </div>
                                <div className="relative group/input">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-200 group-focus-within/input:text-emerald-500 transition-colors" />
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-emerald-50/30 border border-emerald-100 rounded-3xl py-5 pl-16 pr-8 text-emerald-950 placeholder:text-emerald-900/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all font-bold text-sm tracking-wide"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.3em] text-xs rounded-3xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-4 group/btn ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Login Now</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-12 pt-8 border-t border-emerald-50 text-center">
                            <p className="text-emerald-900/30 text-[10px] font-black uppercase tracking-[0.2em]">
                                New to PhishGuard?{' '}
                                <Link to="/register" className="text-emerald-600 hover:text-emerald-700 transition-colors underline underline-offset-8 decoration-emerald-100">Create Account</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};


export default Login;
