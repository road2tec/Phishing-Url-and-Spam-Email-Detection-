import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, trend, trendUp, color }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group relative glass-morphism p-6 rounded-[2rem] border border-white/5 hover:border-white/10 shadow-xl transition-all overflow-hidden"
        >
            {/* Background Gradient Blob */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${color}-500/10 rounded-full blur-[40px] group-hover:bg-${color}-500/20 transition-all duration-500`} />

            <div className="relative z-10 flex items-start justify-between mb-6">
                <div className={`p-3.5 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 shadow-lg shadow-${color}-500/5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 text-${color}-400`} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${trendUp
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        <span className="text-xs font-bold">{trend}</span>
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <p className="text-white/50 text-sm font-medium mb-2 tracking-wide text-shadow-sm">{title}</p>
                <motion.h3
                    className="text-4xl font-bold text-white tracking-tight"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {value}
                </motion.h3>
            </div>
        </motion.div>
    );
};

export default StatCard;
