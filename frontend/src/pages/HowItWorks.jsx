import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Database, ShieldCheck, Cpu, Code2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HowItWorks = () => {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            <Navbar ToggleSidebar={() => { }} />

            {/* Ambient glows behind the card content */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse pointer-events-none -z-10"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            
            {/* Cyber Grid Pattern */}
            <div className="absolute inset-0 cyber-grid pointer-events-none opacity-30 z-0"></div>

            <div className="max-w-7xl mx-auto px-4 py-32 relative z-10">
                {/* Header */}
                <div className="text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2 glass-card border border-white/10 rounded-full mb-8 shadow-xl"
                    >
                        <Cpu className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] pt-0.5">System Architecture</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter uppercase italic leading-none"
                    >
                        How <span className="text-gradient-emerald">PhishGuard</span> Operates
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-xl font-bold uppercase tracking-widest max-w-3xl mx-auto leading-relaxed"
                    >
                        Our multi-layered defense engine combines real-time heuristic analysis with advanced neural machines to preemptively detect zero-day phishing attacks.
                    </motion.p>
                </div>

                {/* Steps */}
                <div className="space-y-32 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 hidden md:block opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>

                    <WorkStep
                        number="01"
                        title="URL Ingestion & Parsing"
                        desc="When you submit a URL, our system first breaks it down into component parts (protocol, domain, path, query params). We use elite parsers for accurate domain extraction and verify local signatures."
                        icon={Search}
                        side="left"
                    />

                    <WorkStep
                        number="02"
                        title="Live HTML Extraction"
                        desc="We don't just look at the URL string. Our engine fetches the live HTML content of the target page in a sandboxed neural environment. This allows us to inspect the DOM for deceptive vectors and obfuscated code."
                        icon={Code2}
                        side="right"
                    />

                    <WorkStep
                        number="03"
                        title="Feature Engineering"
                        desc="We extract multi-dimensional features from the URL and HTML, including dot density, deceptive keyword triggers, domain age, and asymmetric SSL data. These form a numerical vector representing a digital fingerprint."
                        icon={Database}
                        side="left"
                    />

                    <WorkStep
                        number="04"
                        title="Neural Classification"
                        desc="The feature matrix is injected into our advanced random forest model. Simultaneously, a heuristic rule engine scans for immediate danger. This dual-hybrid architecture ensures full spectrum coverage."
                        icon={Cpu}
                        side="right"
                    />

                    <WorkStep
                        number="05"
                        title="XAI & Verdict"
                        desc="Finally, we generate an Explainable AI matrix matrix. This exposes not just IF a site is hazardous, but exactly WHY (e.g., 'Suspiciously extended URL' + 'Hidden form ingestion'). You receive a definitive Risk Score matrix."
                        icon={ShieldCheck}
                        side="left"
                    />
                </div>

                {/* CTA / Back */}
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

const WorkStep = ({ number, title, desc, icon: Icon, side }) => {
    const isLeft = side === 'left';
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col md:flex-row items-center gap-12 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} group`}
        >
            <div className={`flex-1 text-center ${isLeft ? 'md:text-right' : 'md:text-left'} relative z-10`}>
                <div className={`inline-flex items-center justify-center px-6 py-2 glass-card border border-white/10 text-emerald-400 font-black text-xl mb-6 shadow-xl ${isLeft ? 'md:ml-auto' : 'md:mr-auto'}`}>
                    PHASE {number}
                </div>
                <h3 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase italic">{title}</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest leading-relaxed text-[11px]">{desc}</p>
            </div>

            <div className="relative z-10 flex-shrink-0 mx-8">
                <div className="w-28 h-28 glass-card border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl hover:border-emerald-500/30 transition-all duration-500 group-hover:shadow-emerald-500/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-colors"></div>
                    <Icon className="w-12 h-12 text-emerald-400 group-hover:rotate-12 transition-transform relative z-10" />
                    <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                
                {/* Node connector dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] opacity-0 md:opacity-100 hidden"></div>
            </div>

            <div className="flex-1 hidden md:block"></div>
        </motion.div>
    );
}

export default HowItWorks;
