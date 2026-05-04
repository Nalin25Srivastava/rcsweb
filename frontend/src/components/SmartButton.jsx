import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

/**
 * SmartButton - A button that provides feedback when disabled
 * Uses Portals to escape parent overflow-hidden and ensure visibility
 */
const Popup = ({ showPopup, coords, disabledReason, howToCorrect }) => {
    if (!showPopup) return null;

    return createPortal(
        <AnimatePresence mode="wait">
            <motion.div
                key="popup"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                style={{ 
                    position: 'fixed',
                    top: coords.y - 12, // Gap above the button
                    left: coords.x,
                    transform: 'translateX(-50%) translateY(-100%)', // Anchor to bottom of popup
                    zIndex: 99999, // Extremely high to stay above modals
                    pointerEvents: 'none'
                }}
                className="w-72 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-md"
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
        </AnimatePresence>,
        document.body
    );
};

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
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const buttonRef = useRef(null);

    const handleDisabledClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (disabled && !isLoading) {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setCoords({
                    x: rect.left + rect.width / 2,
                    y: rect.top
                });
            }
            setShowPopup(true);
            // Hide after 4 seconds
            setTimeout(() => setShowPopup(false), 4000);
        }
    };

    return (
        <div className="relative inline-block w-full sm:w-auto">
            <button
                ref={buttonRef}
                type={type}
                onClick={disabled ? handleDisabledClick : onClick}
                className={`relative overflow-hidden transition-all duration-300 ${className} ${
                    disabled ? 'cursor-help opacity-60 grayscale-[0.5]' : ''
                }`}
            >
                {children}
                
                {disabled && !isLoading && (
                    <div className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity bg-black flex items-center justify-center">
                    </div>
                )}
            </button>
            <Popup 
                showPopup={showPopup} 
                coords={coords} 
                disabledReason={disabledReason} 
                howToCorrect={howToCorrect} 
            />
        </div>
    );
};

export default SmartButton;
