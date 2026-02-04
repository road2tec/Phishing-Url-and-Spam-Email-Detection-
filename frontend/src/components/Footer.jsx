import React from 'react';
import { Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-cyber-dark border-t border-white/10 pt-10 pb-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 group">
                            <Shield className="w-8 h-8 text-cyber-accent" />
                            <span className="text-xl font-bold text-gradient">PhishGuard Pro</span>
                        </Link>
                        <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                            Advanced AI-driven protection against phishing threats. Secure your digital life with real-time heuristic analysis.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Product</h4>
                        <ul className="space-y-3">
                            <li><Link to="/features" className="text-white/60 hover:text-emerald-400 text-sm transition-colors">Features</Link></li>
                            <li><Link to="/how-it-works" className="text-white/60 hover:text-emerald-400 text-sm transition-colors">How it Works</Link></li>
                            <li><Link to="/dashboard" className="text-white/60 hover:text-emerald-400 text-sm transition-colors">Dashboard</Link></li>
                            <li><Link to="/extension" className="text-white/60 hover:text-emerald-400 text-sm transition-colors">Browser Extension</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-white/60 hover:text-emerald-400 text-sm transition-colors">About Us</Link></li>
                            <li><Link to="/blog" className="text-white/60 hover:text-emerald-400 text-sm transition-colors">Security Blog</Link></li>
                            <li><Link to="/contact" className="text-white/60 hover:text-emerald-400 text-sm transition-colors">Contact</Link></li>
                            <li><Link to="/privacy" className="text-white/60 hover:text-emerald-400 text-sm transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Stay Updated</h4>
                        <p className="text-white/50 text-sm mb-4">Get the latest security alerts directly to your inbox.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 flex-1 transition-all"
                            />
                            <button className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl transition-colors shadow-lg shadow-emerald-600/20">
                                <Mail className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm">© 2024 PhishGuard Pro. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
