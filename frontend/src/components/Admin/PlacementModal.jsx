import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { createPlacedStudent, updatePlacedStudent } from '../../store/slices/placedStudentsSlice';

const PlacementModal = ({ isOpen, onClose, student = null, isEditing = false }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        position: '',
        package: '',
        image: ''
    });
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (student && isEditing) {
            setFormData({
                name: student.name || '',
                company: student.company || '',
                position: student.position || '',
                package: student.package || '',
                image: student.image || ''
            });
        } else {
            setFormData({
                name: '',
                company: '',
                position: '',
                package: '',
                image: ''
            });
        }
    }, [student, isEditing, isOpen]);

    const getImageUrl = (image) => {
        if (!image) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&q=80&w=200';
        if (image.startsWith('http') || image.startsWith('/uploads') || image.startsWith('data:')) return image;
        // If it's just a filename, assume it's in public/images/
        return `/images/${image}`;
    };

    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Compress to JPEG with 0.7 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        
        try {
            const compressedBase64 = await compressImage(file);
            setFormData({ ...formData, image: compressedBase64 });
            console.log('Image compressed and converted successfully');
            setIsUploading(false);
        } catch (error) {
            console.error('Compression/Upload process failed:', error);
            alert('Failed to process image file: ' + error.message);
            setIsUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing && student?._id) {
            dispatch(updatePlacedStudent({ id: student._id, studentData: formData }));
        } else {
            dispatch(createPlacedStudent(formData));
        }
        onClose();
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
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Package (CTC)</label>
                                    <input 
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
                                        placeholder="e.g. 6.5 LPA"
                                        value={formData.package}
                                        onChange={(e) => setFormData({...formData, package: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Candidate Photo</label>
                                
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-slate-100 overflow-hidden flex-shrink-0 shadow-inner group relative">
                                        <img 
                                            src={getImageUrl(formData.image)} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover"
                                        />
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
                                                accept="image/*"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploading}
                                                className="flex-1 px-4 py-3 bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-xl text-sm font-bold text-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <Upload className="w-4 h-4" />
                                                {isUploading ? 'Processing...' : 'Process Image'}
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input 
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white transition-all outline-none text-xs font-medium text-slate-600 placeholder:text-slate-300"
                                                placeholder="Or type local filename (e.g. photo1.jpg)"
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
                            <button 
                                type="submit"
                                className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-sm flex items-center justify-center gap-2 group"
                            >
                                {isEditing ? 'Update Success Story' : 'Publish Success Story'}
                                <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PlacementModal;
