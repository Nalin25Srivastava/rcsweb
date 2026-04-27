import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Type, AlignLeft, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { createSlide } from '../../store/slices/carouselSlice';

const CarouselModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        order: 0,
        url: ''
    });
    const [preview, setPreview] = useState(null);
    const [fileType, setFileType] = useState('image'); // 'image' or 'video'

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileType(file.type.startsWith('video') ? 'video' : 'image');
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setFormData({ ...formData, url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.url) {
            alert('Please select a file');
            return;
        }
        await dispatch(createSlide(formData));
        onClose();
        setFormData({ title: '', subtitle: '', order: 0, url: '' });
        setPreview(null);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-[2.5rem] p-8 max-w-xl w-full relative shadow-2xl overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Add Carousel Slide</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* File Upload Area */}
                        <div className="relative group">
                            <div className={`aspect-video rounded-3xl border-4 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center gap-4 ${preview ? 'border-emerald-500' : 'border-slate-100 bg-slate-50 hover:border-emerald-300'}`}>
                                {preview ? (
                                    <>
                                        {fileType === 'video' ? (
                                            <video src={preview} className="w-full h-full object-cover" autoPlay muted loop />
                                        ) : (
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold cursor-pointer hover:bg-emerald-50 transition-colors flex items-center gap-2">
                                                <Upload className="w-5 h-5" /> Change File
                                                <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center cursor-pointer group">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 shadow-sm mb-2 transition-colors">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <span className="text-slate-500 font-bold">Click to upload image or video</span>
                                        <span className="text-slate-400 text-xs font-medium">1920x1080 recommended</span>
                                        <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Main Heading / Title</label>
                                <div className="relative">
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="text"
                                        placeholder="e.g. Empower Your Future"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Subtitle / Description</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="text"
                                        placeholder="e.g. Join the best placement network in Kota"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="w-1/3">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Display Order</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="number"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                        value={formData.order}
                                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex-[2] py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-sm"
                            >
                                Publish Slide
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CarouselModal;
