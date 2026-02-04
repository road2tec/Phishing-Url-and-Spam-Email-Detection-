import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, User } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    return (
        <nav className="sticky top-0 z-50 w-full glass-morphism border-b border-white/10 px-4 py-3">
            <div className="flex items-center justify-between mx-auto max-w-7xl">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-white/10 rounded-lg lg:hidden transition-colors"
                    >
                        <Menu className="w-6 h-6 text-cyber-accent" />
                    </button>
                    <Link to="/" className="flex items-center gap-2 group">
                        <Shield className="w-8 h-8 text-cyber-accent group-hover:scale-110 transition-transform" />
                        <span className="text-xl font-bold text-gradient">PhishGuard Pro</span>
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Home</Link>
                    <Link to="/features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Features</Link>
                    <Link to="/how-it-works" className="text-sm font-medium text-white/70 hover:text-white transition-colors">How it Works</Link>
                    <Link to="/about" className="text-sm font-medium text-white/70 hover:text-white transition-colors">About Us</Link>
                    <Link to="/login" className="px-4 py-2 text-sm font-medium text-white hover:text-white/90 bg-white/10 hover:bg-white/20 rounded-lg transition-all">Login</Link>
                    <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20 transition-all">Get Started</Link>
                </div>

                <div className="flex items-center md:hidden">
                    <Link to="/login" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <User className="w-6 h-6 text-white/70" />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
