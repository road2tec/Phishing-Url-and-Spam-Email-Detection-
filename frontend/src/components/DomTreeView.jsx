import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Tag, Box } from 'lucide-react';

const DomNode = ({ node, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(level < 2); // Auto-open first few levels
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="ml-4">
            <div
                className={`flex items-center gap-2 py-1 px-2 rounded-lg cursor-pointer transition-colors ${hasChildren ? 'hover:bg-emerald-50' : ''}`}
                onClick={() => hasChildren && setIsOpen(!isOpen)}
            >
                {hasChildren ? (
                    isOpen ? <ChevronDown className="w-4 h-4 text-emerald-950/20" /> : <ChevronRight className="w-4 h-4 text-emerald-950/20" />
                ) : (
                    <div className="w-4" />
                )}

                <Tag className="w-3.5 h-3.5 text-emerald-600/50" />
                <span className="text-xs font-mono text-emerald-600 font-black italic">&lt;{node.name}&gt;</span>

                {node.attributes && Object.keys(node.attributes).length > 0 && (
                    <span className="text-[10px] text-emerald-900/30 font-mono truncate max-w-[200px] italic">
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
                        className="overflow-hidden border-l border-emerald-100/50 ml-2"
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
        <div className="p-8 bg-white rounded-[2.5rem] border border-emerald-100 max-h-[600px] overflow-auto custom-scrollbar-emerald shadow-inner">
            <div className="flex items-center gap-2 mb-6 text-emerald-900/40 text-[10px] uppercase tracking-[0.2em] font-black">
                <Box className="w-4 h-4 text-emerald-500" />
                Forensic DOM Hierarchy
            </div>
            <DomNode node={tree} />
        </div>
    );
};

export default DomTreeView;
