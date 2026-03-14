import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Globe, Shield, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            <Navbar ToggleSidebar={() => { }} />

            {/* Ambient glows behind the card content */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse pointer-events-none -z-10"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

            {/* Cyber Grid Pattern */}
            <div className="absolute inset-0 cyber-grid pointer-events-none opacity-30 z-0"></div>

            <div className="max-w-7xl mx-auto px-4 py-32 relative z-10">
                <div className="text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2 glass-card border border-white/10 rounded-full mb-8 shadow-xl"
                    >
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] pt-0.5">Vanguard Architect Core</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter uppercase italic leading-none"
                    >
                         Architects of <span className="text-gradient-emerald">Protection</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-xl font-bold uppercase tracking-widest max-w-3xl mx-auto leading-relaxed"
                    >
                        A dedicated taskforce of security researchers committed to fortifying the digital grid against deceptive threats.
                    </motion.p>
                </div>

                {/* Mission / Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-12 rounded-[4rem] glass-card border border-white/5 shadow-2xl hover:border-emerald-500/30 transition-all duration-500 group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
                        <div className="w-20 h-20 rounded-[2rem] glass-card border-white/10 shadow-xl flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform duration-500 relative z-10">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Target className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h3 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase italic relative z-10">Our Mission Protocol</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest leading-relaxed text-[11px] relative z-10">
                            To decentralize accessibility to high-tier cybersecurity. We enforce the principle that professional-grade behavioral detection algorithms should be universal.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-12 rounded-[4rem] glass-card border border-white/5 shadow-2xl hover:border-cyan-500/30 transition-all duration-500 group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-cyan-500/10 transition-colors"></div>
                        <div className="w-20 h-20 rounded-[2rem] glass-card border-white/10 shadow-xl flex items-center justify-center mb-10 group-hover:-rotate-12 transition-transform duration-500 relative z-10">
                            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Globe className="w-10 h-10 text-cyan-400" />
                        </div>
                        <h3 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase italic relative z-10">Strategic Vision</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest leading-relaxed text-[11px] relative z-10">
                            A fortified neural environment where trust is absolute. We architect a future matrix where deception vectors are neutralized before visual engagement.
                        </p>
                    </motion.div>
                </div>


                {/* Back to Home */}
                <div className="text-center relative z-10">
                    <Link to="/" className="btn-primary inline-flex items-center justify-center gap-4 px-12 py-6 group border-none outline-none">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                        <span className="uppercase tracking-[0.3em] font-black italic">Return to Base</span>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
};


export default AboutUs;
