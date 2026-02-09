import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Tag, Box } from 'lucide-react';

const DomNode = ({ node, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(level < 2); // Auto-open first few levels
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="ml-4">
            <div
                className={`flex items-center gap-2 py-1 px-2 rounded-lg cursor-pointer transition-colors ${hasChildren ? 'hover:bg-white/5' : ''}`}
                onClick={() => hasChildren && setIsOpen(!isOpen)}
            >
                {hasChildren ? (
                    isOpen ? <ChevronDown className="w-4 h-4 text-white/30" /> : <ChevronRight className="w-4 h-4 text-white/30" />
                ) : (
                    <div className="w-4" />
                )}

                <Tag className="w-3.5 h-3.5 text-cyber-accent" />
                <span className="text-xs font-mono text-emerald-400 font-bold">&lt;{node.name}&gt;</span>

                {node.attributes && Object.keys(node.attributes).length > 0 && (
                    <span className="text-[10px] text-white/40 font-mono truncate max-w-[200px]">
                        {Object.entries(node.attributes).map(([k, v]) => ` ${k}="${Array.isArray(v) ? v.join(' ') : v}"`).join('')}
                    </span>
                )}
            </div>

            <AnimatePresence>
                {isOpen && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-l border-white/5"
                    >
                        {node.children.map((child, idx) => (
                            <DomNode key={idx} node={child} level={level + 1} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DomTreeView = ({ tree }) => {
    if (!tree) return null;

    return (
        <div className="p-6 bg-cyber-dark/50 rounded-2xl border border-white/5 max-h-[500px] overflow-auto custom-scrollbar">
            <div className="flex items-center gap-2 mb-4 text-white/50 text-[10px] uppercase tracking-widest font-bold">
                <Box className="w-4 h-4 text-cyber-accent" />
                Live DOM Hierarchy
            </div>
            <DomNode node={tree} />
        </div>
    );
};

export default DomTreeView;
