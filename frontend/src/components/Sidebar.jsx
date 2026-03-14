import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Link as LinkIcon,
    Mail,
    ShieldAlert,
    LogOut,

    X,
    Shield
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('phishguard_currentUser');
        navigate('/');
    };

    const enableEmailAnalysis = import.meta.env.VITE_ENABLE_EMAIL_ANALYSIS !== 'false';

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'URL Analysis', icon: LinkIcon, path: '/dashboard/url' },
        ...(enableEmailAnalysis ? [{ name: 'Email Analysis', icon: Mail, path: '/dashboard/email' }] : []),
        { name: 'Blocked Registry', icon: ShieldAlert, path: '/dashboard/blocked' },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside className={`
                fixed top-0 left-0 z-50 h-screen w-72 glass-card border-r border-white/5
                transition-transform duration-300 ease-out 
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full p-8">
                    {/* Brand Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 group-hover:rotate-12 transition-transform">
                                <Shield className="w-6 h-6 text-emerald-400 group-hover:fill-emerald-400/10" />
                            </div>
                            <span className="text-xl font-black text-white tracking-widest uppercase">PhishGuard</span>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="p-2 lg:hidden text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-3">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/dashboard'}
                                className={({ isActive }) => `
                                    group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden
                                    ${isActive
                                        ? 'text-white bg-emerald-500/10 border border-emerald-500/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}
                                `}
                                onClick={() => {
                                    if (window.innerWidth < 1024) toggleSidebar();
                                }}
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Glow effect on active */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-emerald-500/5 blur-xl pointer-events-none"></div>
                                        )}
                                        
                                        <item.icon className={`w-5 h-5 relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-400'}`} />
                                        <span className="font-bold text-xs relative z-10 tracking-[0.15em] uppercase">{item.name}</span>

                                        {/* Active Indicator Bar */}
                                        {isActive && (
                                            <motion.div 
                                                layoutId="sidebarActive"
                                                className="absolute left-0 top-3 bottom-3 w-1 bg-emerald-500 rounded-r-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile / Logout */}
                    <div className="mt-auto pt-8 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 w-full px-5 py-4 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all group font-black uppercase text-[10px] tracking-[0.2em]"
                        >
                            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            <span>System Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
