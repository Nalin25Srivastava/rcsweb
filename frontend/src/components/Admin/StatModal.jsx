import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, Star, CheckCircle2 } from 'lucide-react';
import { createStat, updateStat } from '../../store/slices/statsSlice';

const StatModal = ({ isOpen, onClose, stat = null, isEditing = false }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(() => {
        if (stat && isEditing) {
            return {
                label: stat.label || '',
                value: stat.value || '',
                iconName: stat.iconName || 'Briefcase'
            };
        }
        return {
            label: '',
            value: '',
            iconName: 'Briefcase'
        };
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (isEditing) {
                await dispatch(updateStat({ id: stat._id, statData: formData })).unwrap();
            } else {
                await dispatch(createStat(formData)).unwrap();
            }
            onClose();
        } catch (error) {
            alert(`Failed to save statistic: ${error}`);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                                {isEditing ? 'Edit Statistic' : 'Add New Stat'}
                            </h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Stat Label</label>
                            <input 
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                placeholder="e.g. Registered Candidates"
                                value={formData.label}
                                onChange={(e) => setFormData({...formData, label: e.target.value})}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Stat Value</label>
                            <input 
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                placeholder="e.g. 5000+"
                                value={formData.value}
                                onChange={(e) => setFormData({...formData, value: e.target.value})}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Icon Selection</label>
                            <select 
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none font-bold text-slate-700 appearance-none"
                                value={formData.iconName}
                                onChange={(e) => setFormData({...formData, iconName: e.target.value})}
                            >
                                <option value="Briefcase">Briefcase</option>
                                <option value="School">School</option>
                                <option value="People">People</option>
                                <option value="TrendingUp">TrendingUp</option>
                            </select>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit"
                                className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-sm flex items-center justify-center gap-2 group"
                            >
                                <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                {isEditing ? 'Update Statistic' : 'Publish Statistic'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default StatModal;
