import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-cyber-dark relative">
            {/* Sidebar - Handles its own mobile state */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Mobile Sidebar Toggle - Only visible on small screens */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 right-4 z-40 p-3 bg-emerald-600 text-white rounded-xl shadow-lg border border-emerald-500/20 active:scale-95 transition-transform"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Main Content Area */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:pl-72' : 'lg:pl-72'}`}>
                <main className="p-4 md:p-8 lg:p-12 mx-auto max-w-7xl animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
