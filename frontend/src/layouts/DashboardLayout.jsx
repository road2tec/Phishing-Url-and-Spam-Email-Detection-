import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full cyber-grid opacity-20 pointer-events-none"></div>
            {/* Sidebar - Handles its own mobile state */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Mobile Sidebar Toggle - Only visible on small screens */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-6 right-6 z-[60] p-4 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Main Content Area */}
            <div className={`transition-all duration-300 lg:pl-72`}>
                <main className="p-4 md:p-8 lg:p-12 mx-auto max-w-7xl animate-fade-in min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
