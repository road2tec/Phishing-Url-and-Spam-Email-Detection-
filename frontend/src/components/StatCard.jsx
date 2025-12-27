import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, trend, trendUp, color }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-morphism p-6 rounded-3xl border border-white/5 shadow-xl transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-${color}-600/10`}>
                    <Icon className={`w-6 h-6 text-${color}-400`} />
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-white/50 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
            </div>
        </motion.div>
    );
};

export default StatCard;
