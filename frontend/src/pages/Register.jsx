import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Operational Mismatch: Passwords do not match.');
            setLoading(false);
            return;
        }

        setTimeout(() => {
            try {
                const existingUsers = JSON.parse(localStorage.getItem('phishguard_users') || '[]');

                if (existingUsers.some(u => u.email === formData.email)) {
                    setError('Conflict Detected: Profile already exists in the registry.');
                    setLoading(false);
                    return;
                }

                const newUser = {
                    id: crypto.randomUUID(),
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                };

                const updatedUsers = [...existingUsers, newUser];
                localStorage.setItem('phishguard_users', JSON.stringify(updatedUsers));
                localStorage.setItem('phishguard_currentUser', JSON.stringify(newUser));

                navigate('/dashboard');
            } catch (err) {
                setError('Registration failed. Core system failure.');
            } finally {
                setLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col pt-20">
            <Navbar ToggleSidebar={() => { }} />

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full cyber-grid opacity-20 pointer-events-none -z-10"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <div className="flex-grow grid lg:grid-cols-2 relative z-10 max-w-7xl mx-auto w-full">
                {/* Left Side - Intelligence Briefing */}
                <div className="hidden lg:flex flex-col justify-center px-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-12"
                    >
                        <div className="inline-flex items-center gap-4 group">
                            <div className="p-4 rounded-[1.5rem] glass-card border-white/10 group-hover:rotate-12 transition-transform">
                                <Shield className="w-8 h-8 text-emerald-400" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-widest uppercase italic">PhishGuard <span className="text-gradient-emerald">Elite</span></span>
                        </div>

                        <h1 className="text-7xl font-black text-white leading-[1.05] tracking-tighter">
                            Initialize Your <br />
                            <span className="text-gradient-emerald italic">Security Profile</span>
                        </h1>

                        <p className="text-lg text-slate-400 leading-relaxed max-w-md font-medium">
                            Join our decentralized security network to deploy tactical URL forensics and real-time threat neutralization.
                        </p>

                        <div className="space-y-6">
                            {[
                                "Tactical Heuristic Engine",
                                "AI Threat Intelligence",
                                "Forensic Document Mapping"
                            ].map((feature, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    className="flex items-center gap-6 text-white font-bold text-[10px] uppercase tracking-[0.3em]"
                                >
                                    <div className="w-10 h-10 rounded-2xl glass-card flex items-center justify-center text-emerald-400 border-white/10">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                    <span>{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Enrollment Portal */}
                <div className="flex items-center justify-center p-6 lg:p-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-xl"
                    >
                        <div className="glass-card p-12 md:p-16 rounded-[4.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase italic">Create <span className="text-gradient-emerald">Profile</span></h2>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Establish Security Clearance</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400 text-xs font-bold"
                                    >
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-6">Legal Entity Name</label>
                                    <div className="relative group/input">
                                        <User className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-[2.5rem] py-5 pl-20 pr-10 text-white placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all font-bold text-sm tracking-tight"
                                            placeholder="Enter full name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-6">Registry Email</label>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-[2.5rem] py-5 pl-20 pr-10 text-white placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all font-bold text-sm tracking-tight"
                                            placeholder="Enter email address"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-6">Initialize Key</label>
                                        <div className="relative group/input">
                                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" />
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-[2rem] py-5 pl-16 pr-6 text-white placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all font-bold text-sm tracking-tight"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-6">Confirm Key</label>
                                        <div className="relative group/input">
                                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" />
                                            <input
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-[2rem] py-5 pl-16 pr-6 text-white placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all font-bold text-sm tracking-tight"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary w-full py-7 text-[10px] uppercase tracking-[0.4em]"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-4 group">
                                                <span>Initialize Enrollment</span>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-14 pt-10 border-t border-white/5 text-center">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                    Existing Security Profile?{' '}
                                    <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-[12px] decoration-emerald-900/50">Login to Registry</Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};


export default Register;
