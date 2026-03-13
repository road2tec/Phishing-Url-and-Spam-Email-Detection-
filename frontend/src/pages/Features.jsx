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
        <div className="min-h-screen bg-white relative overflow-hidden">
            <Navbar ToggleSidebar={() => { }} />

            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-8"
                    >
                        <Zap className="w-4 h-4 text-emerald-600" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none pt-0.5">Core Features</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-emerald-950 mb-8 tracking-tighter"
                    >
                        Platform <span className="text-emerald-500 underline decoration-emerald-100 underline-offset-8">Capabilities</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-emerald-900/40 max-w-2xl mx-auto font-bold italic text-lg shadow-sm"
                    >
                        Learn about the specialized tools we use to detect phishing attempts and protect your digital footprint.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {featureList.map((f, i) => (
                        <motion.div
                            key={i}
                            variants={{
                                hidden: { opacity: 0, scale: 0.95 },
                                visible: { opacity: 1, scale: 1 }
                            }}
                            whileHover={{ y: -12 }}
                            className="bg-white p-10 rounded-[3rem] border border-emerald-100 shadow-[0_32px_64px_-16px_rgba(6,78,59,0.06)] hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group"
                        >
                            <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform duration-500 shadow-sm">
                                <f.icon className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-emerald-950 mb-4 tracking-tight uppercase underline decoration-emerald-50/50 underline-offset-4">{f.title}</h3>
                            <p className="text-emerald-900/40 font-bold italic leading-relaxed text-sm">
                                {f.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Back to Home */}
                <div className="mt-32 text-center">
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

export default Features;
