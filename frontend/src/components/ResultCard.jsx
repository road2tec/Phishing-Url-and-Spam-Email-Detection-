import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle, ListChecks } from 'lucide-react';

const ResultCard = ({ prediction, score, reasons }) => {
    const isPhishing = prediction?.toLowerCase() === 'phishing';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`glass-morphism p-8 rounded-3xl border ${isPhishing ? 'border-red-500/20 shadow-red-500/10' : 'border-emerald-500/20 shadow-emerald-500/10'} shadow-2xl relative overflow-hidden`}
        >
            {/* Decorative gradient background */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] ${isPhishing ? 'bg-red-600/20' : 'bg-emerald-600/20'}`}></div>

            <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isPhishing ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                        {isPhishing ? (
                            <ShieldAlert className="w-12 h-12 text-red-500" />
                        ) : (
                            <ShieldCheck className="w-12 h-12 text-emerald-500" />
                        )}
                    </div>
                    <div>
                        <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${isPhishing ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {prediction}
                        </span>
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <h4 className="text-white font-bold flex items-center gap-2">
                                <AlertTriangle className={`w-5 h-5 ${isPhishing ? 'text-red-400' : 'text-emerald-400'}`} />
                                Risk Assessment Score
                            </h4>
                            <span className={`text-2xl font-black ${isPhishing ? 'text-red-400' : 'text-emerald-400'}`}>{score}/100</span>
                        </div>
                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className={`h-full ${isPhishing ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'}`}
                            />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white/70 text-sm font-bold flex items-center gap-2 mb-4 uppercase tracking-widest">
                            <ListChecks className="w-4 h-4" />
                            Reasons for Detection
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {reasons && reasons.length > 0 ? (
                                reasons.map((reason, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-white/50 leading-relaxed"
                                    >
                                        • {reason}
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-white/30 text-xs italic">No obvious phishing indicators found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ResultCard;
