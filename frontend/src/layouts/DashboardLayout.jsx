import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-cyber-dark">
            {/* Sidebar - Handles its own mobile state */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content Area */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-64'}`}>
                <Navbar toggleSidebar={toggleSidebar} />

                <main className="p-4 md:p-8 lg:p-12 mx-auto max-w-7xl">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
