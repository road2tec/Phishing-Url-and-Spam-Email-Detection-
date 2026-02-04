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
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' }
        }
    };

    return (
        <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
            <Navbar ToggleSidebar={() => { }} />

            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mint-400/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* --- HERO SECTION --- */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 pt-20 pb-32 flex flex-col items-center text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
                        <Shield className="w-4 h-4" />
                        <span>Advanced Phishing Protection v2.0</span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                        Protect Yourself from <br />
                        <span className="text-gradient">Cyber Threats</span> with Confidence
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
                        An advanced, multi-modal phishing detection system powered by heuristic engines and real-time HTML analysis. Secure your data today.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="group flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all">
                            <span>Start Free Analysis</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/features" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all">
                            Explore Features
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* --- FEATURES SECTION --- */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Core Technology</h2>
                    <p className="text-white/50 max-w-2xl mx-auto">Powered by a hybrid engine combining machine learning and rule-based heuristics.</p>
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
                        title="URL Inspection"
                        desc="Fetch live HTML source code and analyze suspicious tags in real-time."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={Lock}
                        title="Email Scanning"
                        desc="Identify phishing patterns, urgent triggers, and sensitive data requests."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={AlertTriangle}
                        title="Explainable Results"
                        desc="Don't just get a result; understand why a site or email was flagged (XAI)."
                        delay={0.3}
                    />
                </motion.div>
            </div>

            {/* --- HOW IT WORKS SECTION --- */}
            <div className="relative z-10 bg-white/5 border-y border-white/5 py-24 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-2 block">Workflow</span>
                            <h2 className="text-4xl font-bold text-white mb-6">How PhishGuard Works</h2>
                            <p className="text-white/60 mb-8 leading-relaxed">
                                Our system intercepts suspicious links in real-time. When you browse or paste a URL, we dissect it layer by layer—checking the domain reputation, scanning the live HTML code for hidden forms, and running it through our ML models.
                            </p>

                            <div className="space-y-6">
                                <StepItem number="1" title="Data Collection" desc="We fetch the live HTML and extract structural features." />
                                <StepItem number="2" title="Hybrid Analysis" desc="ML models + Heuristic Rules evaluate risk simultaneously." />
                                <StepItem number="3" title="Actionable Insight" desc="Get a clear Safe/Unsafe verdict with a detailed XAI report." />
                            </div>
                        </div>
                        <div className="relative">
                            {/* Animated Graphic Placeholder */}
                            <div className="aspect-square bg-emerald-500/10 rounded-3xl border border-emerald-500/20 p-8 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="w-full h-full border-2 border-dashed border-emerald-500/30 rounded-full absolute"
                                ></motion.div>
                                <div className="text-center relative z-10">
                                    <Activity className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                    <div className="font-mono text-emerald-300 text-sm">Processing...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ABOUT US SECTION --- */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 text-center">
                <h2 className="text-3xl font-bold text-white mb-12">Meet the Protectors</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <TeamCard name="Cyber Analysis" role="Backend Engine" icon={Terminal} />
                    <TeamCard name="Threat Intel" role="Database & ML" icon={Database} />
                    <TeamCard name="User Defense" role="Frontend & UX" icon={Users} />
                </div>
                <p className="mt-12 text-white/40 max-w-2xl mx-auto">
                    Built by a dedicated team of security researchers and developers committed to making the internet safer for everyone.
                </p>
            </div>

            <Footer />
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } }
        }}
        className="glass-morphism p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all group hover:-translate-y-2"
    >
        <div className="w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon className="w-7 h-7 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-white/50">{desc}</p>
    </motion.div>
);

const StepItem = ({ number, title, desc }) => (
    <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
            {number}
        </div>
        <div>
            <h4 className="text-white font-bold">{title}</h4>
            <p className="text-white/50 text-sm">{desc}</p>
        </div>
    </div>
);

const TeamCard = ({ name, role, icon: Icon }) => (
    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center hover:bg-white/10 transition-colors">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-white/70" />
        </div>
        <h3 className="text-white font-bold">{name}</h3>
        <p className="text-emerald-400 text-sm">{role}</p>
    </div>
);

export default Home;
