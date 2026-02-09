import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Link as LinkIcon,
    Mail,
    ShieldAlert,
    LogOut,

    X,
    Shield,
    Instagram
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('phishguard_currentUser');
        navigate('/');
    };

    const enableEmailAnalysis = import.meta.env.VITE_ENABLE_EMAIL_ANALYSIS !== 'false';
    const enableInstagramAnalysis = import.meta.env.VITE_ENABLE_INSTAGRAM_ANALYSIS !== 'false';

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'URL Analysis', icon: LinkIcon, path: '/dashboard/url' },
        ...(enableInstagramAnalysis ? [{ name: 'Instagram Analysis', icon: Instagram, path: '/dashboard/instagram' }] : []),
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
                fixed top-0 left-0 z-50 h-screen w-72 glass-morphism border-r border-white/5
                transition-transform duration-300 ease-out shadow-2xl shadow-black/50
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full p-6">
                    {/* Brand Header */}
                    <div className="flex items-center justify-between mb-10 px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                <Shield className="w-6 h-6 text-emerald-400" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-wide">PhishGuard</span>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="p-2 lg:hidden text-white/50 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/dashboard'}
                                className={({ isActive }) => `
                                    group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden
                                    ${isActive
                                        ? 'text-white shadow-lg shadow-emerald-500/20'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'}
                                `}
                                onClick={() => {
                                    if (window.innerWidth < 1024) toggleSidebar();
                                }}
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Active State Background Gradient */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-90" />
                                        )}

                                        {/* Icon & Text */}
                                        <item.icon className={`w-5 h-5 relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-emerald-400'}`} />
                                        <span className="font-medium relative z-10 tracking-wide">{item.name}</span>

                                        {/* Active Indicator Dot */}
                                        {isActive && (
                                            <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile / Logout */}
                    <div className="mt-auto pt-6 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3.5 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group"
                        >
                            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
