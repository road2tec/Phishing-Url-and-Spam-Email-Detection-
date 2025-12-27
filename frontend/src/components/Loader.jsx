import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Loader = ({ text }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-6">
            <div className="relative">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center"
                >
                    <Shield className="w-8 h-8 text-blue-400" />
                </motion.div>

                {/* Pulse rings */}
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 border border-blue-500/50 rounded-2xl"
                />
            </div>

            {text && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/50 text-sm font-medium animate-pulse"
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
};

export default Loader;
