import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Link as LinkIcon,
    Mail,
    LogOut,
    X
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('phishguard_currentUser');
        navigate('/');
    };
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'URL Analysis', icon: LinkIcon, path: '/dashboard/url' },
        { name: 'Email Analysis', icon: Mail, path: '/dashboard/email' },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 glass-morphism border-r border-white/10
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full p-4">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <span className="text-xl font-bold text-gradient">Dashboard</span>
                        <button onClick={toggleSidebar} className="p-2 lg:hidden">
                            <X className="w-5 h-5 text-white/70" />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/dashboard'}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive
                                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'}
                `}
                                onClick={() => {
                                    if (window.innerWidth < 1024) toggleSidebar();
                                }}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-auto pt-4 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-white/60 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
