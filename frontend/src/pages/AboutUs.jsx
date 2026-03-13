import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Globe, Shield, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            <Navbar ToggleSidebar={() => { }} />

            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">
                <div className="text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-8"
                    >
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none pt-0.5">Who We Are</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-6xl md:text-8xl font-black text-emerald-950 mb-10 tracking-tighter"
                    >
                         Dedicated to <span className="text-emerald-500 underline decoration-emerald-100 underline-offset-[12px]">Protection</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-emerald-900/40 text-xl font-bold italic max-w-2xl mx-auto leading-relaxed"
                    >
                        A dedicated team of security researchers committed to protecting users from online deception and phishing attacks.
                    </motion.p>
                </div>

                {/* Mission / Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-12 rounded-[3.5rem] bg-white border border-emerald-100 shadow-[0_32px_64px_-16px_rgba(6,78,59,0.08)] hover:shadow-2xl hover:shadow-emerald-500/5 transition-all group"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform duration-500">
                            <Target className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-3xl font-black text-emerald-950 mb-6 tracking-tight uppercase underline decoration-emerald-100 underline-offset-8">Our Mission</h3>
                        <p className="text-emerald-900/40 font-bold italic leading-relaxed text-lg">
                            To make cybersecurity accessible to everyone. We believe that professional-grade phishing detection should be easy to use and available to all users.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-12 rounded-[3.5rem] bg-white border border-emerald-100 shadow-[0_32px_64px_-16px_rgba(6,78,59,0.08)] hover:shadow-2xl hover:shadow-emerald-500/5 transition-all group"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center mb-10 group-hover:-rotate-12 transition-transform duration-500">
                            <Globe className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-3xl font-black text-emerald-950 mb-6 tracking-tight uppercase underline decoration-emerald-100 underline-offset-8">Our Vision</h3>
                        <p className="text-emerald-900/40 font-bold italic leading-relaxed text-lg">
                            A safe digital environment where trust is restored. We envision a future where phishing is no longer a threat to individuals or organizations.
                        </p>
                    </motion.div>
                </div>


                {/* Back to Home */}
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-950 hover:bg-emerald-900 text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-2xl shadow-emerald-500/20 transition-all group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
};


export default AboutUs;
