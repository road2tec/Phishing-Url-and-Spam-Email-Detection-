import React from 'react';
import { Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-emerald-950 border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    {/* Brand */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <Shield className="w-12 h-12 text-emerald-400 fill-emerald-400/5 group-hover:rotate-12 transition-transform shadow-2xl" />
                            <span className="text-2xl font-black text-white tracking-tighter italic uppercase">PhishGuard <span className="text-emerald-500">Pro</span></span>
                        </Link>
                        <p className="text-emerald-100/30 text-xs font-black uppercase tracking-widest leading-relaxed max-w-xs italic">
                            Advanced AI-driven protection against phishing threats. Secure your digital life with real-time heuristic analysis.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-10 pb-2 border-b border-emerald-500/20 inline-block">Product</h4>
                        <ul className="space-y-5">
                            <li><Link to="/features" className="text-emerald-100/40 hover:text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] transition-all flex items-center gap-3 group/link"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 group-hover/link:bg-emerald-400 transition-all"></div>Features</Link></li>
                            <li><Link to="/how-it-works" className="text-emerald-100/40 hover:text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] transition-all flex items-center gap-3 group/link"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 group-hover/link:bg-emerald-400 transition-all"></div>How it Works</Link></li>
                            <li><Link to="/dashboard" className="text-emerald-100/40 hover:text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] transition-all flex items-center gap-3 group/link"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 group-hover/link:bg-emerald-400 transition-all"></div>Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-10 pb-2 border-b border-emerald-500/20 inline-block">Company</h4>
                        <ul className="space-y-5">
                            <li><Link to="/about" className="text-emerald-100/40 hover:text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] transition-all flex items-center gap-3 group/link"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 group-hover/link:bg-emerald-400 transition-all"></div>About Us</Link></li>
                            <li><Link to="/contact" className="text-emerald-100/40 hover:text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] transition-all flex items-center gap-3 group/link"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 group-hover/link:bg-emerald-400 transition-all"></div>Contact</Link></li>
                            <li><Link to="/privacy" className="text-emerald-100/40 hover:text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] transition-all flex items-center gap-3 group/link"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 group-hover/link:bg-emerald-400 transition-all"></div>Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-10 pb-2 border-b border-emerald-500/20 inline-block">Stay Updated</h4>
                        <p className="text-emerald-100/20 text-[10px] font-black uppercase tracking-widest mb-8 italic">Get the latest security alerts directly to your inbox.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-emerald-900/50 border border-white/5 rounded-2xl px-5 py-4 text-[10px] font-black text-white placeholder:text-emerald-100/10 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 flex-1 transition-all"
                            />
                            <button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 p-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 group">
                                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-emerald-100/10 text-[10px] font-black uppercase tracking-[0.4em]">© 2024 PhishGuard Pro. All rights reserved.</p>
                    <div className="flex items-center gap-10">
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-emerald-100/20 hover:text-emerald-400 transition-all hover:scale-110">
                            <Github className="w-6 h-6" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-emerald-100/20 hover:text-emerald-400 transition-all hover:scale-110">
                            <Twitter className="w-6 h-6" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-emerald-100/20 hover:text-emerald-400 transition-all hover:scale-110">
                            <Linkedin className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
