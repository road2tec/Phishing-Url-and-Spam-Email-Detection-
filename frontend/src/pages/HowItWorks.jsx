import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Database, ShieldCheck, Cpu, Code2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HowItWorks = () => {
    return (
        <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
            <Navbar ToggleSidebar={() => { }} />

            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
                    >
                        <Cpu className="w-4 h-4" />
                        <span>System Architecture</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold text-white mb-6"
                    >
                        How <span className="text-gradient">PhishGuard Pro</span> Works
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 max-w-2xl mx-auto text-lg"
                    >
                        Our multi-layered defense engine combines real-time heuristic analysis with advanced machine learning to detect zero-day phishing attacks across URLs, Emails, and Social Media.
                    </motion.p>
                </div>

                {/* Steps */}
                <div className="space-y-20 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 hidden md:block"></div>

                    <WorkStep
                        number="01"
                        title="URL Ingestion & Parsing"
                        desc="When you submit a URL, our system first breaks it down into component parts (protocol, domain, path, query params). We use 'tldextract' for accurate domain parsing and check against a local cache of known malicious sites."
                        icon={Search}
                        side="left"
                    />

                    <WorkStep
                        number="02"
                        title="Live HTML Extraction"
                        desc="We don't just look at the URL string. Our engine fetches the live HTML content of the target page in a sandboxed environment. This allows us to inspect the DOM for hidden forms, deceptive iframes, and obfuscated JavaScript."
                        icon={Code2}
                        side="right"
                    />

                    <WorkStep
                        number="03"
                        title="Feature Engineering"
                        desc="We extract over 15 unique features from the URL and HTML, including dot counts, suspicious keywords (e.g., 'login', 'secure'), domain age, and HTTPS validity. These features form a numerical vector representing the site's 'fingerprint'."
                        icon={Database}
                        side="left"
                    />

                    <WorkStep
                        number="04"
                        title="ML & Heuristic Classification"
                        desc="The feature vector is fed into our Random Forest classifier. Simultaneously, a heuristic rule engine checks for immediate red flags. This hybrid approach ensures we catch both known patterns and novel attacks."
                        icon={Cpu}
                        side="right"
                    />

                    <WorkStep
                        number="05"
                        title="XAI & Verdict"
                        desc="Finally, we generate an Explainable AI (XAI) report using SHAP/LIME. This tells you not just IF a site is fishing, but WHY (e.g., 'Suspiciously long URL' + 'Asking for password'). You get a clear Risk Score and Block/Allow verdict."
                        icon={ShieldCheck}
                        side="left"
                    />
                </div>

                {/* CTA / Back */}
                <div className="mt-32 text-center">
                    <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
};

const WorkStep = ({ number, title, desc, icon: Icon, side }) => {
    const isLeft = side === 'left';
    return (
        <motion.div
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col md:flex-row items-center gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
        >
            <div className={`flex-1 text-center ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full border border-emerald-500/30 text-emerald-400 font-bold mb-4 ${isLeft ? 'md:ml-auto' : 'md:mr-auto'}`}>
                    {number}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
                <p className="text-white/60 leading-relaxed">{desc}</p>
            </div>

            <div className="relative z-10 flex-shrink-0">
                <div className="w-24 h-24 bg-cyber-dark border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <Icon className="w-10 h-10 text-emerald-400" />
                </div>
            </div>

            <div className="flex-1 hidden md:block"></div>
        </motion.div>
    );
}

export default HowItWorks;
