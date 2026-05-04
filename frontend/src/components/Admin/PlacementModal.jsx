import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { createPlacedStudent, updatePlacedStudent } from '../../store/slices/placedStudentsSlice';
import SmartButton from '../SmartButton';

const PlacementModal = ({ isOpen, onClose, student = null, isEditing = false }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(() => {
        if (student && isEditing) {
            return {
                name: student.name || '',
                company: student.company || '',
                position: student.position || '',
                compensation: student.compensation || '',
                image: student.image || ''
            };
        }
        return {
            name: '',
            company: '',
            position: '',
            compensation: '',
            image: ''
        };
    });
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const getImageUrl = (image) => {
        if (!image) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&q=80&w=200';
        
        let url = image;
        if (typeof url === 'string' && url.includes('localhost:5000')) {
            url = url.replace(/http:\/\/localhost:5000/g, '');
        }

        if (url.startsWith('http') || url.startsWith('/uploads') || url.startsWith('data:')) return url;
        // If it's just a filename, assume it's in public/images/
        return `/images/${url}`;
    };

    const isVideo = (url) => {
        if (!url) return false;
        return url.match(/\.(mp4|webm|ogg)$/i) || url.startsWith('data:video');
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Limit file size to 50MB for media
        if (file.size > 50 * 1024 * 1024) {
            alert('File is too large. Please select a file under 50MB.');
            return;
        }

        setIsUploading(true);
        
        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result;
                setFormData({ ...formData, image: base64String });
                setIsUploading(false);
            };
            reader.onerror = (error) => {
                console.error('Base64 conversion error:', error);
                alert('Failed to process file.');
                setIsUploading(false);
            };
        } catch (error) {
            console.error('Upload process failed:', error);
            alert('Error: ' + error.message);
            setIsUploading(false);
        }
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (isEditing && student?._id) {
            dispatch(updatePlacedStudent({ id: student._id, studentData: formData }));
        } else {
            dispatch(createPlacedStudent(formData));
        }
        onClose();
    };

    const isFormIncomplete = !formData.name || !formData.company || !formData.position || !formData.compensation;
    const getDisabledReason = () => {
        if (isFormIncomplete) return "Form details missing";
        if (isUploading) return "Media processing...";
        return "";
    };
    const getCorrectionStep = () => {
        if (isFormIncomplete) return "Please fill in all candidate details (Name, Company, Position, and CTC).";
        if (isUploading) return "Please wait while we process the media file.";
        return "";
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                            {isEditing ? 'Edit Success Story' : 'Add Success Story'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600 shadow-sm border border-transparent hover:border-slate-100">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Candidate Name</label>
                                <input 
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
                                <input 
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
                                    placeholder="e.g. Google, Microsoft, Accenture"
                                    value={formData.company}
                                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Position</label>
                                    <input 
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
                                        placeholder="e.g. Software Engineer"
                                        value={formData.position}
                                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Compensation (CTC)</label>
                                    <input 
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
                                        placeholder="e.g. 6.5 LPA"
                                        value={formData.compensation}
                                        onChange={(e) => setFormData({...formData, compensation: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Candidate Media (Photo/Video)</label>
                                
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-slate-100 overflow-hidden flex-shrink-0 shadow-inner group relative">
                                        {isVideo(formData.image) ? (
                                            <video src={getImageUrl(formData.image)} className="w-full h-full object-cover" autoPlay muted loop />
                                        ) : (
                                            <img 
                                                src={getImageUrl(formData.image)} 
                                                alt="Preview" 
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 space-y-3 w-full">
                                        <div className="flex gap-2">
                                            <input 
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                accept="image/*,video/*"
                                            />
                                            <SmartButton 
                                                disabled={isUploading}
                                                isLoading={isUploading}
                                                disabledReason="Upload in progress"
                                                howToCorrect="Please wait for the current file to finish processing before selecting a new one."
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-xl text-sm font-bold text-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <Upload className="w-4 h-4" />
                                                {isUploading ? 'Processing...' : 'Process Media'}
                                            </SmartButton>
                                        </div>
                                        <div className="relative">
                                            <input 
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white transition-all outline-none text-xs font-medium text-slate-600 placeholder:text-slate-300"
                                                placeholder="Or type local filename"
                                                value={formData.image}
                                                onChange={(e) => setFormData({...formData, image: e.target.value})}
                                            />
                                            <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <SmartButton 
                                type="submit"
                                disabled={isUploading || isFormIncomplete}
                                disabledReason={getDisabledReason()}
                                howToCorrect={getCorrectionStep()}
                                onClick={handleSubmit}
                                className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-sm flex items-center justify-center gap-2 group"
                            >
                                {isEditing ? 'Update Success Story' : 'Publish Success Story'}
                                <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                            </SmartButton>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PlacementModal;
