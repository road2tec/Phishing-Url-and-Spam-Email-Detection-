import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, User } from 'lucide-react';

const Navbar = ({ ToggleSidebar }) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-emerald-950/90 backdrop-blur-xl border-b border-white/5 h-20 shadow-2xl">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover:rotate-12 transition-transform">
                        <Shield className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter uppercase italic">PhishGuard</span>
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    <Link to="/features" className="text-[10px] font-black text-emerald-100/50 hover:text-emerald-400 uppercase tracking-[0.2em] transition-all">Features</Link>
                    <Link to="/how-it-works" className="text-[10px] font-black text-emerald-100/50 hover:text-emerald-400 uppercase tracking-[0.2em] transition-all">How it Works</Link>
                    <Link to="/about" className="text-[10px] font-black text-emerald-100/50 hover:text-emerald-400 uppercase tracking-[0.2em] transition-all">About Us</Link>
                    
                    <div className="flex items-center gap-4 ml-6">
                        <Link to="/login" className="px-6 py-2.5 text-[10px] font-black text-white hover:text-emerald-400 uppercase tracking-widest transition-all">Login</Link>
                        <Link to="/register" className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20">Sign Up</Link>
                    </div>
                </div>
                {/* Mobile menu button - assuming this is what the user intended to keep/modify */}
                <div className="flex items-center md:hidden">
                    <button
                        onClick={ToggleSidebar} // Use the new prop name
                        className="p-2 hover:bg-emerald-800 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6 text-emerald-400" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
