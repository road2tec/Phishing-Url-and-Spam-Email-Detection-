import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    ShieldCheck,
    Eye,
    BarChart3,
    Code2,
    MailWarning
} from 'lucide-react';

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
    ];

    return (
        <div className="min-h-screen bg-cyber-dark py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        Powerful <span className="text-gradient">Security Features</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 max-w-2xl mx-auto"
                    >
                        Leverage state-of-the-art heuristic analysis to stay one step ahead of phishing attempts and protect your digital identity.
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
                                hidden: { opacity: 0, scale: 0.9 },
                                visible: { opacity: 1, scale: 1 }
                            }}
                            whileHover={{ y: -8 }}
                            className="glass-morphism p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all"
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-${f.color}-600/10`}>
                                <f.icon className={`w-6 h-6 text-${f.color}-400`} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{f.title}</h3>
                            <p className="text-white/50 leading-relaxed text-sm">
                                {f.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Features;
