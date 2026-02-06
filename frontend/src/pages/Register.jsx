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
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        // Mock registration logic
        setTimeout(() => {
            try {
                const existingUsers = JSON.parse(localStorage.getItem('phishguard_users') || '[]');

                if (existingUsers.some(u => u.email === formData.email)) {
                    setError('User already exists with this email.');
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
                setError('Registration failed. Please try again.');
            } finally {
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-cyber-dark relative overflow-hidden flex flex-col">
            <Navbar ToggleSidebar={() => { }} />

            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-mint-400/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="flex-grow grid lg:grid-cols-2 relative z-10">
                {/* Left Side - Branding & Info */}
                <div className="hidden lg:flex flex-col justify-center px-12 lg:px-20 border-r border-white/5 bg-white/[0.02]">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="inline-flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <Shield className="w-8 h-8 text-emerald-400" />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-wide">PhishGuard Pro</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                            Join the Future of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                Cybersecurity
                            </span>
                        </h1>

                        <p className="text-lg text-white/60 mb-8 leading-relaxed max-w-lg">
                            Get started with your free account today. Monitor URLs, analyze emails, and protect your organization from sophisticated phishing attacks.
                        </p>

                        <div className="space-y-4">
                            {[
                                "Real-time URL Scanning",
                                "AI-Powered Email Analysis",
                                "Detailed Threat Reports"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-white/70">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <ArrowRight className="w-3 h-3 text-emerald-400" />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Register Form */}
                <div className="flex items-center justify-center px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md w-full"
                    >
                        <div className="text-center mb-8 lg:hidden">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-2xl shadow-emerald-500/10 hover:scale-105 transition-transform duration-300">
                                <Shield className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                            <p className="text-white/50">Start your journey with PhishGuard Pro</p>
                        </div>

                        <div className="mb-8 pl-2 hidden lg:block">
                            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                            <p className="text-white/50">Start your journey with PhishGuard Pro</p>
                        </div>
                        <div className="mb-8 pl-2 lg:hidden">
                            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                            <p className="text-white/50">Start your journey with PhishGuard Pro</p>
                        </div>

                        <div className="glass-morphism p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                            {/* Decorative top border */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0"></div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-4 bg-red-400/10 border border-red-400/20 rounded-xl flex items-center gap-3 text-red-400 text-sm"
                                    >
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-white/70 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                                            placeholder="name@company.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-white/70 ml-1">Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-white/70 ml-1">Confirm Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span>Create Account</span>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 pt-6 border-t border-white/5 text-center">
                                <p className="text-white/40 text-sm">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">Sign In</Link>
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
