import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Database, ShieldCheck, Cpu, Code2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HowItWorks = () => {
    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            <Navbar ToggleSidebar={() => { }} />

            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">
                {/* Header */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-black uppercase tracking-widest text-[10px] mb-8"
                    >
                        <Cpu className="w-4 h-4" />
                        <span>System Architecture</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-emerald-950 mb-8 tracking-tighter"
                    >
                        How <span className="text-emerald-500 underline decoration-emerald-100 underline-offset-8">PhishGuard</span> Operates
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-emerald-900/40 max-w-2xl mx-auto text-xl font-bold italic leading-relaxed"
                    >
                        Our multi-layered defense engine combines real-time heuristic analysis with advanced machines to preemptively detect zero-day phishing attacks.
                    </motion.p>
                </div>

                {/* Steps */}
                <div className="space-y-24 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-emerald-50 hidden md:block"></div>

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
                        desc="We extract over 15 unique features from the URL and HTML, including dot counts, suspicious keywords (e.g., 'login', 'secure'), domain age, and HTTPS validity. These features form a numerical vector representing the site's fingerprint."
                        icon={Database}
                        side="left"
                    />

                    <WorkStep
                        number="04"
                        title="Neural Classification"
                        desc="The feature vector is fed into our Random Forest classifier. Simultaneously, a heuristic rule engine checks for immediate red flags. This hybrid approach ensures we catch both known patterns and novel attacks."
                        icon={Cpu}
                        side="right"
                    />

                    <WorkStep
                        number="05"
                        title="XAI & Verdict"
                        desc="Finally, we generate an Explainable AI (XAI) report using SHAP/LIME. This tells you not just IF a site is fishing, but WHY (e.g., 'Suspiciously long URL' + 'Asking for password'). You get a clear Risk Score and verdict."
                        icon={ShieldCheck}
                        side="left"
                    />
                </div>

                {/* CTA / Back */}
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

const WorkStep = ({ number, title, desc, icon: Icon, side }) => {
    const isLeft = side === 'left';
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col md:flex-row items-center gap-12 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
        >
            <div className={`flex-1 text-center ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-emerald-50 text-emerald-600 font-black text-xl mb-6 shadow-sm ${isLeft ? 'md:ml-auto' : 'md:mr-auto'}`}>
                    {number}
                </div>
                <h3 className="text-3xl font-black text-emerald-950 mb-6 tracking-tight uppercase underline decoration-emerald-100 underline-offset-8">{title}</h3>
                <p className="text-emerald-900/40 font-bold italic leading-relaxed text-lg">{desc}</p>
            </div>

            <div className="relative z-10 flex-shrink-0">
                <div className="w-28 h-28 bg-white border border-emerald-100 rounded-[2.5rem] flex items-center justify-center shadow-[0_24px_48px_-12px_rgba(6,78,59,0.08)] hover:scale-110 transition-transform duration-500 group">
                    <Icon className="w-12 h-12 text-emerald-600 group-hover:rotate-12 transition-transform" />
                    <div className="absolute inset-0 bg-emerald-500/5 rounded-[2.5rem] animate-pulse"></div>
                </div>
            </div>

            <div className="flex-1 hidden md:block"></div>
        </motion.div>
    );
}

export default HowItWorks;
