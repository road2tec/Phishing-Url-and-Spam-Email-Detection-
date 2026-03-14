import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    ShieldCheck,
    Eye,
    BarChart3,
    Code2,
    MailWarning,

    ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Features = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const featureList = [
        {
            icon: Zap,
            title: "Real-time HTML Analysis",
            desc: "Instant fetching and parsing of live webpage source code to identify suspicious patterns before they reach the user.",
            color: "blue"
        },
        {
            icon: MailWarning,
            title: "Email Signal Extraction",
            desc: "Intelligent extraction of urgency triggers, sensitive data requests, and social engineering signals from emails.",
            color: "purple"
        },
        {
            icon: Eye,
            title: "Explainable Detection",
            desc: "Visual representation of suspicious HTML snippets and email components, providing clarity on why a threat was flagged.",
            color: "cyan"
        },
        {
            icon: BarChart3,
            title: "Heuristic Risk Scoring",
            desc: "Advanced 0-100 scoring system based on multi-component analysis of URLs, SSL status, and textual content.",
            color: "indigo"
        },
        {
            icon: ShieldCheck,
            title: "Insecure Protocol Detection",
            desc: "Automatic flagging of non-HTTPS connections and suspicious top-level domains commonly used in phishing campaigns.",
            color: "blue"
        },
        {
            icon: Code2,
            title: "Suspicious Tag Tracking",
            desc: "Deep inspection of <form> actions, <script> sources, and hidden input fields that indicate data exfiltration attempts.",
            color: "emerald"
        }
    ].filter(f => {
        if (import.meta.env.VITE_ENABLE_EMAIL_ANALYSIS === 'false' && f.title === "Email Signal Extraction") return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            <Navbar ToggleSidebar={() => { }} />

            {/* Ambient glows behind the card content */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse pointer-events-none -z-10"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

            {/* Cyber Grid Pattern */}
            <div className="absolute inset-0 cyber-grid pointer-events-none opacity-30 z-0"></div>

            <div className="max-w-7xl mx-auto px-4 py-32 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2 glass-card border border-white/10 rounded-full mb-8 shadow-xl"
                    >
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] pt-0.5">Core Features</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase italic leading-none"
                    >
                        Platform <span className="text-gradient-emerald">Capabilities</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-bold uppercase tracking-widest text-[11px] max-w-2xl mx-auto leading-relaxed shadow-sm"
                    >
                        Learn about the specialized tools we use to detect phishing attempts and protect your digital footprint.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {featureList.map((f, i) => (
                        <motion.div
                            key={i}
                            variants={{
                                hidden: { opacity: 0, scale: 0.95 },
                                visible: { opacity: 1, scale: 1 }
                            }}
                            whileHover={{ y: -12 }}
                            className="glass-card p-12 rounded-[3.5rem] border border-white/5 shadow-2xl hover:border-emerald-500/30 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
                            
                            <div className="w-20 h-20 rounded-[2rem] glass-card border-white/10 shadow-xl flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform duration-500 relative z-10">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <f.icon className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-6 tracking-tighter uppercase italic relative z-10">{f.title}</h3>
                            <p className="text-slate-500 font-bold uppercase tracking-widest leading-relaxed text-[10px] relative z-10">
                                {f.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Back to Home */}
                <div className="mt-32 text-center relative z-10">
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

export default Features;
