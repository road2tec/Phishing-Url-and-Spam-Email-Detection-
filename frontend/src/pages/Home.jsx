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
        <div className="min-h-screen bg-white relative overflow-hidden">
            <Navbar ToggleSidebar={() => { }} />

            {/* Subtle Gradient Backdrops */}
            <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-emerald-50 to-white -z-10"></div>
            <div className="absolute top-[10%] right-[-10%] w-[35%] h-[35%] bg-emerald-100/40 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-slow"></div>

            {/* --- HERO SECTION --- */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-32 flex flex-col items-center text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-sm border border-emerald-200">
                        <Shield className="w-3.5 h-3.5 fill-emerald-800" />
                        <span>Advanced Artificial Intelligence</span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black text-emerald-950 mb-8 leading-[1.05] tracking-tight">
                        Detection system <br />
                        <span className="text-emerald-500 italic">for Phishing attacks.</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-xl text-emerald-900/50 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Our platform uses machine learning to analyze web page structures and identify phishing threats in real-time. Secure your information with PhishGuard.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/register" className="group flex items-center gap-3 px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-[2rem] shadow-2xl shadow-emerald-500/30 transition-all active:scale-95">
                            <span>Get Started Now</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                        </Link>
                        <Link to="/features" className="px-10 py-5 bg-white text-emerald-900 font-bold text-lg rounded-[2rem] border-2 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all active:scale-95 shadow-sm">
                            Learn More
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* --- FEATURES SECTION --- */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 py-24">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest">Our Features</h2>
                    <h3 className="text-4xl font-black text-emerald-900 tracking-tight">Powerful Detection Tools</h3>
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
                        title="URL Analysis"
                        desc="Scan HTML source code to identify suspicious patterns and potential threats instantly."
                        delay={0.1}
                    />
                    {import.meta.env.VITE_ENABLE_EMAIL_ANALYSIS !== 'false' && (
                        <FeatureCard
                            icon={Lock}
                            title="Email Protection"
                            desc="Analyze email content for social engineering triggers and malicious payload links."
                            delay={0.2}
                        />
                    )}
                    <FeatureCard
                        icon={Activity}
                        title="Explained Results"
                        desc="Get detailed insights into why a URL or email was flagged, with specific threat indicators."
                        delay={0.3}
                    />
                </motion.div>
            </div>

            {/* --- HOW IT WORKS SECTION --- */}
            <div className="relative z-10 bg-emerald-50/50 py-32 border-y border-emerald-100/50">
                <div className="max-w-7xl auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-8">
                            <div>
                                <span className="text-emerald-500 font-black tracking-widest uppercase text-xs mb-4 block">Process Workflow</span>
                                <h2 className="text-5xl font-black text-emerald-950 tracking-tight mb-8">How PhishGuard Works</h2>
                                <p className="text-emerald-900/60 text-lg font-medium leading-relaxed">
                                    Our system analyzes data at multiple levels. By examining web page code and email metadata, we find anomalies before they cause any harm.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <StepItem number="01" title="Input Analysis" desc="We collect HTML structures and content for thorough scanning." />
                                <StepItem number="02" title="Machine Learning" desc="Our models evaluate the data against known phishing signatures." />
                                <StepItem number="03" title="Threat Report" desc="You receive a clear safety score and a breakdown of identified risks." />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-white rounded-[3rem] border border-emerald-100 p-12 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_32px_64px_-16px_rgba(6,78,59,0.08)]">
                                <div className="absolute inset-0 cyber-grid opacity-50"></div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                    className="w-[120%] h-[120%] border border-emerald-200/50 rounded-full absolute"
                                ></motion.div>
                                <div className="text-center relative z-10 space-y-6">
                                    <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                                        <Activity className="w-10 h-10 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="font-black text-emerald-900 text-lg">Analysis Engine</div>
                                        <div className="font-bold text-emerald-500 text-sm italic">Status: System Active</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ABOUT US SECTION --- */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 text-center">
                <div className="max-w-2xl mx-auto space-y-6 mb-20">
                    <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest">About Our Team</h2>
                    <h3 className="text-4xl font-black text-emerald-950 tracking-tight">Security Research Experts</h3>
                    <p className="text-emerald-900/50 font-medium">Dedicated to protecting users with advanced threat detection technology.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <TeamCard name="Analysis Lab" role="ML Research" icon={Terminal} />
                    <TeamCard name="Threat Intelligence" role="Data Analysis" icon={Database} />
                    <TeamCard name="Product Security" role="System Protection" icon={Shield} />
                </div>
            </div>

            <Footer />
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { delay, duration: 0.6 } }
        }}
        className="bg-white p-10 rounded-[2.5rem] border border-emerald-100 hover:border-emerald-300 transition-all group hover:-translate-y-3 cursor-default shadow-[0_12px_40px_-12px_rgba(6,78,59,0.03)]"
    >
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-colors">
            <Icon className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-2xl font-black text-emerald-900 mb-4 tracking-tight">{title}</h3>
        <p className="text-emerald-900/40 font-medium leading-relaxed">{desc}</p>
    </motion.div>
);

const StepItem = ({ number, title, desc }) => (
    <div className="flex gap-6 items-start group">
        <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl flex-shrink-0 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
            {number}
        </div>
        <div className="pt-2">
            <h4 className="text-emerald-950 font-black text-xl mb-2 tracking-tight">{title}</h4>
            <p className="text-emerald-900/40 font-medium text-sm leading-relaxed">{desc}</p>
        </div>
    </div>
);

const TeamCard = ({ name, role, icon: Icon }) => (
    <div className="p-10 bg-emerald-50/30 rounded-[2.5rem] border border-emerald-100/50 flex flex-col items-center hover:bg-emerald-50 transition-all group shadow-sm">
        <div className="w-20 h-20 bg-white border border-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
            <Icon className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-emerald-950 font-black text-xl mb-1">{name}</h3>
        <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest">{role}</p>
    </div>
);

export default Home;
