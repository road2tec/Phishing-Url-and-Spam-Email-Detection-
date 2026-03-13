import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Loader = ({ text }) => {
    return (
        <div className="flex flex-col items-center justify-center p-16 space-y-8">
            <div className="relative">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 90, 180, 270, 360],
                        borderRadius: ["2rem", "1.5rem", "2rem"]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="w-24 h-24 bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center shadow-inner"
                >
                    <Shield className="w-10 h-10 text-emerald-600 fill-emerald-600/5" />
                </motion.div>

                {/* Pulse rings */}
                <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-x-[-10px] inset-y-[-10px] border-2 border-emerald-500/20 rounded-[2.5rem]"
                />
            </div>

            {text && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-2"
                >
                    <p className="text-emerald-950/60 text-xs font-black uppercase tracking-[0.3em] animate-pulse">
                        {text}
                    </p>
                    <div className="flex gap-1">
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 rounded-full bg-emerald-400"></motion.div>
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 rounded-full bg-emerald-400"></motion.div>
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 rounded-full bg-emerald-400"></motion.div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Loader;
