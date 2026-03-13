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
        <div className="min-h-screen bg-white relative overflow-hidden flex flex-col pt-20">
            <Navbar ToggleSidebar={() => { }} />

            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50/50 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex-grow grid lg:grid-cols-2 relative z-10 max-w-7xl mx-auto w-full">
                {/* Left Side - Info */}
                <div className="hidden lg:flex flex-col justify-center px-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-4 mb-10">
                            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm">
                                <Shield className="w-8 h-8 text-emerald-600" />
                            </div>
                            <span className="text-2xl font-black text-emerald-950 tracking-tighter">PhishGuard <span className="text-emerald-500 italic">Pro</span></span>
                        </div>

                        <h1 className="text-6xl font-black text-emerald-950 leading-[1.1] mb-8 tracking-tighter">
                            Start Your <br />
                            <span className="text-emerald-500 italic underline decoration-emerald-100 underline-offset-8">Secure Journey</span>
                        </h1>

                        <p className="text-lg text-emerald-900/40 mb-12 leading-relaxed max-w-md font-bold italic">
                            Join thousands of users who trust PhishGuard for real-time URL analysis and phishing protection.
                        </p>

                        <div className="space-y-6">
                            {[
                                "Real-time Heuristic Engine",
                                "AI-Powered Threat Analysis",
                                "Detailed Security Reporting"
                            ].map((feature, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    className="flex items-center gap-4 text-emerald-950 font-black text-[10px] uppercase tracking-[0.2em]"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                    <span>{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Register Form */}
                <div className="flex items-center justify-center p-6 lg:p-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-lg"
                    >
                        <div className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-emerald-100 shadow-[0_32px_64px_-16px_rgba(6,78,59,0.08)] relative overflow-hidden">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-black text-emerald-950 mb-2 tracking-tighter uppercase italic">Create <span className="text-emerald-500">Account</span></h2>
                                <p className="text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em]">Join the security network</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold"
                                    >
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-4">Full Name</label>
                                    <div className="relative group/input">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-200 group-focus-within/input:text-emerald-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-emerald-50/30 border border-emerald-100 rounded-[1.75rem] py-4.5 pl-16 pr-8 text-emerald-950 placeholder:text-emerald-900/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all font-bold text-sm"
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-4">Email Address</label>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-200 group-focus-within/input:text-emerald-500 transition-colors" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-emerald-50/30 border border-emerald-100 rounded-[1.75rem] py-4.5 pl-16 pr-8 text-emerald-950 placeholder:text-emerald-900/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all font-bold text-sm"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-4">Password</label>
                                        <div className="relative group/input">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200 group-focus-within/input:text-emerald-500 transition-colors" />
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-emerald-50/30 border border-emerald-100 rounded-[1.25rem] py-4 pl-12 pr-6 text-emerald-950 placeholder:text-emerald-900/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all font-bold text-sm"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-4">Confirm</label>
                                        <div className="relative group/input">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-200 group-focus-within/input:text-emerald-500 transition-colors" />
                                            <input
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className="w-full bg-emerald-50/30 border border-emerald-100 rounded-[1.25rem] py-4 pl-12 pr-6 text-emerald-950 placeholder:text-emerald-900/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all font-bold text-sm"
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
                                        className={`w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.3em] text-xs rounded-[1.75rem] shadow-xl shadow-emerald-500/10 transition-all flex items-center justify-center gap-4 group/btn ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span>Join Now</span>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-10 pt-8 border-t border-emerald-50 text-center">
                                <p className="text-emerald-900/30 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Already a member?{' '}
                                    <Link to="/login" className="text-emerald-600 hover:text-emerald-700 transition-colors underline underline-offset-8 decoration-emerald-100">Login Instead</Link>
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
