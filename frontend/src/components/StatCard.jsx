import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, trend, trendUp, color }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative bg-white p-8 rounded-[2.5rem] border border-emerald-100 hover:border-emerald-300 shadow-[0_12px_40px_-12px_rgba(6,78,59,0.03)] transition-all overflow-hidden"
        >
            {/* Background Gradient Blob */}
            <div className={`absolute -right-6 -top-6 w-32 h-32 bg-${color}-500/5 rounded-full blur-[40px] group-hover:bg-${color}-500/10 transition-all duration-700`} />

            <div className="relative z-10 flex items-start justify-between mb-8">
                <div className={`p-4 rounded-2xl bg-${color === 'emerald' ? 'emerald' : color}-50 border border-${color === 'emerald' ? 'emerald' : color}-100 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={`w-6 h-6 text-${color === 'emerald' ? 'emerald' : color}-600`} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border ${trendUp
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                            : 'bg-red-50 border-red-100 text-red-600'
                        }`}>
                        <span className="text-[10px] font-black uppercase tracking-widest">{trend}</span>
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <p className="text-emerald-900/40 text-[10px] font-black uppercase tracking-widest mb-2">{title}</p>
                <motion.h3
                    className="text-4xl font-black text-emerald-950 tracking-tight"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {value}
                </motion.h3>
            </div>
        </motion.div>
    );
};

export default StatCard;
