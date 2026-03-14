import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Lock, Search, AlertTriangle, ArrowRight, Activity, Terminal, Database, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden text-slate-200">
            <Navbar ToggleSidebar={() => { }} />

            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full cyber-grid opacity-20 pointer-events-none -z-10"></div>
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
            <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

            {/* --- HERO SECTION --- */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 pt-40 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-left"
                    >
                        <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black mb-10 leading-[1.1] tracking-tighter">
                            Protect Your <br />
                            <span className="text-gradient-emerald">Cyber Security</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-lg text-slate-400 mb-12 max-w-xl font-medium leading-relaxed">
                            <strong className="text-emerald-400 font-black block mb-2">Keep your software up to date:</strong>
                            Regularly update your operating system, antivirus software, web browsers, and other applications to ensure you have the latest security patches.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6">
                            <Link to="/register" className="btn-primary flex items-center gap-3 group px-12 py-5">
                                <span>Get Started Now</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                            </Link>
                            <Link to="/features" className="btn-outline px-12 py-5">
                                Architecture
                            </Link>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full -z-10"></div>
                        <img src="/cyber_security_hero_1773507159226.png" alt="Cyber Security" className="w-[120%] max-w-none ml-[-10%] h-auto relative z-10 drop-shadow-[0_0_30px_rgba(16,185,129,0.2)]" />
                    </motion.div>
                </div>
            </div>



            {/* --- FEATURES SECTION --- */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="space-y-4 max-w-xl">
                        <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Expert Security Services</h2>
                        <h3 className="text-4xl font-black text-white tracking-tight">Enterprise-Grade Protection</h3>
                    </div>
                    <p className="text-slate-400 max-w-md font-medium">Our platform leverages high-fidelity machine learning models to detect anomalies across multiple attack vectors.</p>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <FeatureCard
                        icon={Search}
                        title="URL Diagnostics"
                        desc="Deep behavioral analysis of web page structures and scripts to reveal hidden phishing skeletons."
                        delay={0.1}
                    />
                    {import.meta.env.VITE_ENABLE_EMAIL_ANALYSIS !== 'false' && (
                        <FeatureCard
                            icon={Lock}
                            title="Email Guard"
                            desc="Real-time scanning of email metadata and body content for social engineering triggers."
                            delay={0.2}
                            isCyan
                        />
                    )}
                    <FeatureCard
                        icon={Activity}
                        title="Explained AI"
                        desc="Detailed forensic reports showing exactly why a threat was flagged, with structural evidence."
                        delay={0.3}
                        isPurple
                    />
                </motion.div>
            </div>

            {/* --- STATS / HOW IT WORKS --- */}
            <div className="relative z-10 py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full -z-10"></div>
                            <img src="/cyber_security_servers_1773507341093.png" alt="Security Threats" className="w-[120%] max-w-none ml-[-10%] h-auto drop-shadow-[0_0_30px_rgba(6,182,212,0.2)] relative z-10" />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-12 pl-0 lg:pl-10"
                        >
                            <div>
                                <span className="text-cyan-400 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">Operational Logic</span>
                                <h2 className="text-5xl font-black text-white tracking-tight mb-8">Tackling Modern Security Threats</h2>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                    In today's fast-moving business environment, companies are faced with a number of challenges when it comes to information technology and ensuring their employees can stay productive and secure. Cyberthreats like phishing and ransomware are causing business disruptions.
                                </p>
                            </div>

                            <div className="space-y-10">
                                <StepItem icon={AlertTriangle} title="Impact to Business" desc="Cybersecurity breaches can have severe impacts on businesses. They can result in financial losses due to operational downtime." />
                                <StepItem icon={Terminal} title="Heuristic Scan" desc="Complex cross-referencing against millions of known phishing patterns." />
                                <StepItem icon={Shield} title="Active Protection" desc="Immediate threat classification with a comprehensive forensic breakdown." />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, delay, isCyan, isPurple }) => {
    const accentClass = isCyan ? 'text-cyan-400' : isPurple ? 'text-purple-400' : 'text-emerald-400';
    const borderClass = isCyan ? 'hover:border-cyan-500/30' : isPurple ? 'hover:border-purple-500/30' : 'hover:border-emerald-500/30';
    const bgClass = isCyan ? 'bg-cyan-500/10' : isPurple ? 'bg-purple-500/10' : 'bg-emerald-500/10';

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, scale: 0.95, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { delay, duration: 0.6 } }
            }}
            className={`glass-card p-10 rounded-[3rem] border border-white/5 ${borderClass} transition-all group hover:-translate-y-4`}
        >
            <div className={`w-16 h-16 ${bgClass} rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform`}>
                <Icon className={`w-8 h-8 ${accentClass}`} />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{title}</h3>
            <p className="text-slate-400 font-medium leading-relaxed text-sm">{desc}</p>
        </motion.div>
    );
}

const StepItem = ({ icon: Icon, title, desc }) => (
    <div className="flex gap-8 items-start group">
        <div className="w-16 h-16 rounded-[1.5rem] glass-card flex items-center justify-center flex-shrink-0 transition-all group-hover:bg-emerald-500/10 group-hover:scale-105 border-white/10 group-hover:border-emerald-500/20 shadow-xl">
            <Icon className="w-7 h-7 text-emerald-400" />
        </div>
        <div className="pt-2">
            <h4 className="text-white font-black text-xl mb-2 tracking-tight group-hover:text-emerald-400 transition-colors uppercase italic">{title}</h4>
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-sm">{desc}</p>
        </div>
    </div>
);


export default Home;
