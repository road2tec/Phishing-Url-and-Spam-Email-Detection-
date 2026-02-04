import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Globe, Shield, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
            <Navbar ToggleSidebar={() => { }} />

            <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-24">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-extrabold text-white mb-8"
                    >
                        We Are <span className="text-gradient">PhishGuard Pro</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 text-xl max-w-3xl mx-auto leading-relaxed"
                    >
                        A passionate team of security researchers, data scientists, and developers dedicated to making the internet a safer place for everyone.
                    </motion.p>
                </div>

                {/* Mission / Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-10 rounded-3xl bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-all"
                    >
                        <Target className="w-12 h-12 text-emerald-400 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                        <p className="text-white/60 leading-relaxed text-lg">
                            To democratize advanced cybersecurity. We believe that state-of-the-art phishing detection shouldn't be limited to large enterprises. We bring ML-powered defense to every browser.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-10 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all"
                    >
                        <Globe className="w-12 h-12 text-blue-400 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">Global Vision</h3>
                        <p className="text-white/60 leading-relaxed text-lg">
                            A world where digital trust is restored. Where users can click with confidence, knowing that an intelligent guardian is always watching their back against social engineering.
                        </p>
                    </motion.div>
                </div>

                {/* Team Section */}
                <div className="text-center mb-24">
                    <h2 className="text-3xl font-bold text-white mb-16">The Core Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        <TeamMember name="Alex Chen" role="Lead Architect" />
                        <TeamMember name="Sarah Jones" role="ML Engineer" />
                        <TeamMember name="David Kim" role="Frontend Lead" />
                        <TeamMember name="Maria Garcia" role="Threat Intel" />
                        <TeamMember name="James Wilson" role="DevOps" />
                        <TeamMember name="Your Name" role="Project Lead" />
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transition-all group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
};

const TeamMember = ({ name, role }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-6 bg-white/5 rounded-2xl border border-white/5 group"
    >
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full mb-4 flex items-center justify-center">
            <Users className="w-10 h-10 text-white/50 group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
        <p className="text-emerald-400 text-sm font-medium">{role}</p>
    </motion.div>
);

export default AboutUs;
