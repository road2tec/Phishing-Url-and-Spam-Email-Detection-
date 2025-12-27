import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Lock, Search, AlertTriangle, ArrowRight } from 'lucide-react';

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
        <div className="relative min-h-screen bg-cyber-dark overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mint-400/10 rounded-full blur-[120px]"></div>

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

                {/* Feature Highlights */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full"
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
                        desc="Don't just get a result; understand why a site or email was flagged."
                        delay={0.3}
                    />
                </motion.div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } }
        }}
        className="glass-morphism p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group"
    >
        <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon className="w-7 h-7 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-white/50">{desc}</p>
    </motion.div>
);

export default Home;
