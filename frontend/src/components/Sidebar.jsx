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
                fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-emerald-100/50
                transition-transform duration-300 ease-out shadow-[10px_0_30px_-15px_rgba(6,78,59,0.05)]
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full p-8">
                    {/* Brand Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="p-2.5 rounded-2xl bg-emerald-100 border border-emerald-200 group-hover:rotate-12 transition-transform">
                                <Shield className="w-6 h-6 text-emerald-600 fill-emerald-600/10" />
                            </div>
                            <span className="text-xl font-black text-emerald-950 tracking-tight">PhishGuard</span>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="p-2 lg:hidden text-emerald-800/40 hover:text-emerald-800 transition-colors"
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
                                    group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 relative overflow-hidden
                                    ${isActive
                                        ? 'text-emerald-950 bg-emerald-50'
                                        : 'text-emerald-950/40 hover:text-emerald-950 hover:bg-emerald-50/50'}
                                `}
                                onClick={() => {
                                    if (window.innerWidth < 1024) toggleSidebar();
                                }}
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Icon & Text */}
                                        <item.icon className={`w-5 h-5 relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-600' : 'text-emerald-800/40 group-hover:text-emerald-600'}`} />
                                        <span className="font-black text-sm relative z-10 tracking-wide uppercase italic">{item.name}</span>

                                        {/* Active Indicator Dot */}
                                        {isActive && (
                                            <motion.div 
                                                layoutId="sidebarActive"
                                                className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-emerald-600 rounded-l-full" 
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile / Logout */}
                    <div className="mt-auto pt-8 border-t border-emerald-50">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 w-full px-5 py-4 text-emerald-800/30 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all group font-black uppercase text-xs tracking-[0.2em]"
                        >
                            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
