import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle, ListChecks } from 'lucide-react';

const ResultCard = ({ prediction, score, risk_score, reasons, explanation }) => {
    const isPhishing = prediction?.toLowerCase() === 'phishing';
    const displayScore = risk_score !== undefined ? risk_score : score;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`glass-card p-12 rounded-[4rem] border relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] ${isPhishing ? 'border-rose-500/20 shadow-rose-500/5' : 'border-emerald-500/20 shadow-emerald-500/5'}`}
        >
            {/* Ambient glows behind the card content */}
            <div className={`absolute top-0 right-0 w-80 h-80 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-40 ${isPhishing ? 'bg-rose-500/10' : 'bg-emerald-500/10'}`}></div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16 relative z-10">
                <div className="flex flex-col items-center gap-10 text-center shrink-0">
                    <div className={`w-36 h-36 rounded-[3rem] flex items-center justify-center glass-card border-white/5 shadow-2xl relative group ${isPhishing ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {/* Recursive border glow */}
                        <div className={`absolute inset-0 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity ${isPhishing ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                        
                        {isPhishing ? (
                            <ShieldAlert className="w-20 h-20 relative z-10 animate-pulse" />
                        ) : (
                            <ShieldCheck className="w-20 h-20 relative z-10" />
                        )}
                    </div>
                    <div>
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`inline-block px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl border transition-all ${isPhishing 
                                ? 'bg-rose-600 border-rose-500 text-white shadow-rose-900/40' 
                                : 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-900/40'}`}
                        >
                            {prediction} DETECTED
                        </motion.span>
                    </div>
                </div>

                <div className="flex-1 w-full space-y-12">
                    <div className="space-y-6">
                        <div className="flex justify-between items-end mb-2">
                            <h4 className="text-white font-black text-2xl uppercase tracking-tighter flex items-center gap-4">
                                <AlertTriangle className={`w-8 h-8 ${isPhishing ? 'text-rose-400' : 'text-emerald-400'}`} />
                                Threat Assessment Score
                            </h4>
                            <span className={`text-5xl font-black tracking-tighter ${isPhishing ? 'text-rose-400' : 'text-emerald-400'}`}>{displayScore}%</span>
                        </div>
                        <div className="h-4 w-full bg-white/[0.03] rounded-full overflow-hidden shadow-inner border border-white/5 p-[2px]">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${displayScore}%` }}
                                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                                className={`h-full rounded-full shadow-[0_0_20px_currentColor] ${isPhishing ? 'bg-gradient-to-r from-rose-600 to-rose-400 text-rose-500/50' : 'bg-gradient-to-r from-emerald-600 to-emerald-400 text-emerald-500/50'}`}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-slate-500 text-[10px] font-black flex items-center gap-3 uppercase tracking-[0.4em]">
                            <ListChecks className="w-5 h-5" />
                            Behavioral Intelligence Indicators
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-white/80">
                            {reasons && reasons.length > 0 ? (
                                reasons.map((reason, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-6 glass-card border-white/5 rounded-3xl text-xs font-bold leading-relaxed flex items-start gap-4 hover:border-white/10 transition-colors shadow-lg"
                                    >
                                        <div className={`mt-1 shrink-0 w-2 h-2 rounded-full ${isPhishing ? 'bg-rose-500' : 'bg-emerald-500'} shadow-[0_0_8px_currentColor]`}></div>
                                        <span>{reason}</span>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-slate-700 text-xs font-black uppercase tracking-widest pl-4">No critical anomalies isolated.</p>
                            )}
                        </div>
                    </div>

                    {/* Explanation section for XAI */}
                    {explanation && explanation.top_features ? (
                        <div className="pt-12 border-t border-white/5">
                            <h4 className="text-slate-500 text-[10px] font-black flex items-center gap-3 mb-8 uppercase tracking-[0.4em]">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                Model Interpretation Protocol (SHAP)
                            </h4>
                            <div className="p-10 glass-card border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group border border-white/5 hover:border-white/10 transition-all">
                                <div className={`absolute top-0 right-0 w-48 h-48 blur-[80px] rounded-full pointer-events-none -mr-24 -mt-24 transition-opacity opacity-20 group-hover:opacity-40 ${isPhishing ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                                <p className="text-[11px] text-slate-400 mb-8 leading-relaxed font-bold uppercase tracking-widest relative z-10">
                                    Strategic lexical feature analysis for <span className="text-white underline decoration-emerald-500/50 underline-offset-4">high-probability</span> detection nodes.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 text-white">
                                    {explanation.top_features.map((feat, i) => (
                                        <div key={i} className="flex items-center justify-between text-[11px] font-black bg-white/[0.02] p-4 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group/feat hover:scale-[1.02]">
                                            <span className="font-mono tracking-tight uppercase opacity-70 group-hover/feat:opacity-100 transition-opacity">{feat}</span>
                                            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${isPhishing ? 'bg-rose-500/80' : 'bg-emerald-500/80'}`}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </motion.div>
    );
};

export default ResultCard;
