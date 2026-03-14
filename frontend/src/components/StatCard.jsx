import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, trend, trendUp, color }) => {
    // Map tailwind colors to premium hex/rgba for consistent glow
    const glowColors = {
        emerald: 'rgba(16, 185, 129, 0.15)',
        red: 'rgba(239, 68, 68, 0.15)',
        cyan: 'rgba(6, 182, 212, 0.15)',
    };

    const accentColor = color === 'emerald' ? 'emerald' : color === 'red' ? 'red' : 'cyan';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative glass-card p-8 rounded-[3rem] border border-white/5 hover:border-white/10 shadow-2xl transition-all overflow-hidden"
        >
            {/* Dynamic Background Glow */}
            <div 
                className={`absolute -right-8 -top-8 w-40 h-40 rounded-full blur-[60px] group-hover:w-48 group-hover:h-48 transition-all duration-700 -z-10`}
                style={{ backgroundColor: glowColors[accentColor] || glowColors.emerald }}
            />

            <div className="relative z-10 flex items-start justify-between mb-10">
                <div className={`p-4 rounded-2xl bg-${accentColor}-500/10 border border-${accentColor}-500/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(0,0,0,0.2)]`}>
                    <Icon className={`w-7 h-7 text-${accentColor}-400 group-hover:glow-${accentColor}`} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border ${trendUp
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${trendUp ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{trend}</span>
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">{title}</p>
                <div className="flex items-baseline gap-2">
                    <motion.h3
                        className="text-5xl font-black text-white tracking-tighter"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {value}
                    </motion.h3>
                    {/* Tiny decorative dot */}
                    <div className={`w-2 h-2 rounded-full bg-${accentColor}-500 blur-[2px]`}></div>
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
