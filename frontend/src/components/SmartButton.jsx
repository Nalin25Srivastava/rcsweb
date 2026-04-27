import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertCircle } from 'lucide-react';

/**
 * SmartButton - A button that provides feedback when disabled
 * @param {boolean} disabled - Whether the button is disabled
 * @param {string} disabledReason - The reason why the button is disabled
 * @param {string} howToCorrect - Actionable step to fix the issue
 * @param {function} onClick - Click handler for active state
 * @param {React.ReactNode} children - Button content
 * @param {string} className - Additional CSS classes
 * @param {boolean} isLoading - Loading state
 */
const SmartButton = ({ 
    disabled, 
    disabledReason, 
    howToCorrect, 
    onClick, 
    children, 
    className = "", 
    isLoading = false,
    type = "button"
}) => {
    const [showPopup, setShowPopup] = useState(false);

    const handleDisabledClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled && !isLoading) {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 4000); // Auto hide after 4s
        }
    };

    return (
        <div className="relative inline-block w-full sm:w-auto">
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-[1000] w-64 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-md"
                    >
                        <div className="flex gap-3">
                            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg h-fit">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-widest text-amber-400">Why disabled?</p>
                                <p className="text-sm font-bold text-slate-100">{disabledReason || "Required action pending"}</p>
                                {howToCorrect && (
                                    <div className="pt-2 mt-2 border-t border-slate-800">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">How to correct:</p>
                                        <p className="text-xs font-medium text-slate-300">{howToCorrect}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Triangle Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-slate-900"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type={type}
                onClick={disabled ? handleDisabledClick : onClick}
                className={`relative overflow-hidden transition-all duration-300 ${className} ${
                    disabled ? 'cursor-help opacity-60 grayscale-[0.5]' : ''
                }`}
            >
                {children}
                
                {/* Visual feedback for being disabled (subtle lock icon overlay on hover) */}
                {disabled && !isLoading && (
                    <div className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity bg-black flex items-center justify-center">
                        {/* No content needed, just the overlay effect */}
                    </div>
                )}
            </button>
        </div>
    );
};

export default SmartButton;
