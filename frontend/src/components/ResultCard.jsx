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
            className={`bg-white p-10 rounded-[2.5rem] border ${isPhishing ? 'border-red-100 shadow-red-500/5' : 'border-emerald-100 shadow-emerald-500/5'} shadow-2xl relative overflow-hidden`}
        >
            {/* Decorative background gradients */}
            <div className={`absolute top-0 right-0 w-48 h-48 blur-[100px] ${isPhishing ? 'bg-red-50' : 'bg-emerald-50'}`}></div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center ${isPhishing ? 'bg-red-50 border border-red-100' : 'bg-emerald-50 border border-emerald-100'}`}>
                        {isPhishing ? (
                            <ShieldAlert className="w-14 h-14 text-red-500" />
                        ) : (
                            <ShieldCheck className="w-14 h-14 text-emerald-500" />
                        )}
                    </div>
                    <div>
                        <span className={`px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-[0.2em] ${isPhishing ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                            {prediction} DETECTED
                        </span>
                    </div>
                </div>

                <div className="flex-1 w-full space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <h4 className="text-emerald-950 font-black text-lg flex items-center gap-3">
                                <AlertTriangle className={`w-6 h-6 ${isPhishing ? 'text-red-500' : 'text-emerald-500'}`} />
                                Threat Vector Score
                            </h4>
                            <span className={`text-4xl font-black ${isPhishing ? 'text-red-600' : 'text-emerald-600'}`}>{displayScore}%</span>
                        </div>
                        <div className="h-4 w-full bg-emerald-50 rounded-full overflow-hidden shadow-inner border border-emerald-100/50">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${displayScore}%` }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                className={`h-full rounded-full ${isPhishing ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'}`}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-emerald-900/40 text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.2em]">
                            <ListChecks className="w-4 h-4" />
                            Behavioral Indicators
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reasons && reasons.length > 0 ? (
                                reasons.map((reason, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl text-xs text-emerald-900/60 font-medium leading-relaxed"
                                    >
                                        • {reason}
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-emerald-900/20 text-xs italic">No critical anomalies detected in the payload.</p>
                            )}
                        </div>
                    </div>

                    {/* Explanation section for XAI */}
                    {explanation && explanation.top_features ? (
                        <div className="pt-8 border-t border-emerald-50">
                            <h4 className="text-emerald-900/40 text-[10px] font-black flex items-center gap-2 mb-6 uppercase tracking-[0.2em]">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                Model Interpretation (SHAP)
                            </h4>
                            <div className="p-6 bg-white border border-emerald-100 rounded-[2rem] shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 blur-2xl rounded-full pointer-events-none group-hover:bg-emerald-100 transition-colors"></div>
                                <p className="text-xs text-emerald-900/40 mb-6 leading-relaxed font-bold">
                                    Strategic lexical feature analysis for <span className="text-emerald-950">high-probability</span> detection.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                                    {explanation.top_features.map((feat, i) => (
                                        <div key={i} className="flex items-center justify-between text-[11px] text-emerald-900 font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-100/50 hover:border-emerald-200 transition-colors">
                                            <span className="font-mono tracking-tight">{feat}</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
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
