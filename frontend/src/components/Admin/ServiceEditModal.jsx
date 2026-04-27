import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, CheckCircle2, Layout, FileText, List, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { updateService } from '../../store/slices/servicesSlice';

const ServiceEditModal = ({ isOpen, onClose, service }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: '',
        shortDesc: '',
        description: '',
        features: [''],
        iconName: '',
        color: '',
        borderColor: '',
        accentColor: '',
        order: 0
    });
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    useEffect(() => {
        if (service) {
            setFormData({
                title: service.title || '',
                shortDesc: service.shortDesc || '',
                description: service.description || '',
                features: service.features?.length > 0 ? service.features : [''],
                iconName: service.iconName || '',
                color: service.color || '',
                borderColor: service.borderColor || '',
                accentColor: service.accentColor || '',
                order: service.order || 0
            });
        }
    }, [service]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    };

    const removeFeature = (index) => {
        if (formData.features.length > 1) {
            const newFeatures = formData.features.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, features: newFeatures }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            // Filter out empty features
            const cleanedData = {
                ...formData,
                features: formData.features.filter(f => f.trim() !== '')
            };

            await dispatch(updateService({ id: service.id, serviceData: cleanedData })).unwrap();
            setStatus({ loading: false, success: true, error: null });
            
            setTimeout(() => {
                onClose();
                setStatus(prev => ({ ...prev, success: false }));
            }, 2000);
        } catch (err) {
            setStatus({ loading: false, success: false, error: err || 'Failed to update service' });
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
                    className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-200">
                                <Layout className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Edit Service</h2>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{service?.title}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-8">
                        {status.error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100">
                                <AlertCircle className="w-5 h-5" />
                                <p className="font-bold">{status.error}</p>
                            </div>
                        )}
                        
                        {status.success && (
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-3 border border-emerald-100">
                                <CheckCircle2 className="w-5 h-5" />
                                <p className="font-bold">Service updated successfully!</p>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Basic Info */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> Service Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Zap className="w-3 h-3" /> Short Description
                                    </label>
                                    <input
                                        type="text"
                                        name="shortDesc"
                                        value={formData.shortDesc}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> Full Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="4"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-900 resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <List className="w-3 h-3" /> Key Features
                                        </label>
                                        <button 
                                            type="button" 
                                            onClick={addFeature}
                                            className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700"
                                        >
                                            + Add Feature
                                        </button>
                                    </div>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {formData.features.map((feature, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={feature}
                                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                    placeholder="Enter feature..."
                                                    className="flex-grow bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-900 text-sm"
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeFeature(index)}
                                                    className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Icon Name</label>
                                        <select 
                                            name="iconName" 
                                            value={formData.iconName} 
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none focus:border-emerald-500 font-bold"
                                        >
                                            <option value="GraduationCap">Graduation Cap</option>
                                            <option value="Users">Users</option>
                                            <option value="Briefcase">Briefcase</option>
                                            <option value="Monitor">Monitor</option>
                                            <option value="BarChart">Bar Chart</option>
                                            <option value="Clock">Clock</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Display Order</label>
                                        <input
                                            type="number"
                                            name="order"
                                            value={formData.order}
                                            onChange={handleInputChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 outline-none focus:border-emerald-500 font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-8 py-4 bg-white text-slate-500 font-black uppercase tracking-widest rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            onClick={handleSubmit}
                            disabled={status.loading}
                            className="px-12 py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all flex items-center gap-3 disabled:opacity-50"
                        >
                            {status.loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : <Save className="w-5 h-5" />}
                            Update Service
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ServiceEditModal;
