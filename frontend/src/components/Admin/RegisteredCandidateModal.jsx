import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Info, Search, List, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { createRegisteredCandidate, updateRegisteredCandidate } from '../../store/slices/registeredCandidatesSlice';

const RegisteredCandidateModal = ({ isOpen, onClose, candidate = null, isEditing = false, users = [] }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        userId: '',
        name: '',
        email: '',
        phone: '',
        course: '',
        batch: '',
        status: 'Active',
        image: ''
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [isUserListOpen, setIsUserListOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const getImageUrl = (image) => {
        if (!image) return 'https://images.unsplash.com/photo-1594673752579-40993cf394c5?fit=crop&q=80&w=400';
        
        let url = image;
        if (typeof url === 'string' && url.includes('localhost:5000')) {
            url = url.replace(/http:\/\/localhost:5000/g, '');
        }

        if (url.startsWith('http') || url.startsWith('/uploads') || url.startsWith('data:')) return url;
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

    useEffect(() => {
        if (candidate) {
            const isUserObject = !candidate.user && candidate.email;
            
            setFormData({
                userId: isUserObject ? candidate._id : (candidate.user || ''),
                name: candidate.name || '',
                email: candidate.email || '',
                phone: candidate.phone || (candidate.resume?.phone || ''),
                course: candidate.course || (candidate.resume?.functionalArea || ''),
                batch: candidate.batch || '',
                status: candidate.status || 'Active',
                image: candidate.image || (candidate.resume?.image || '')
            });
        } else {
            setFormData({
                userId: '',
                name: '',
                email: '',
                phone: '',
                course: '',
                batch: '',
                status: 'Active',
                image: ''
            });
        }
    }, [candidate, isOpen]);

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectUser = (u) => {
        setFormData({
            ...formData,
            userId: u._id,
            name: u.name,
            email: u.email,
            phone: u.resume?.phone || '',
            course: u.resume?.functionalArea || '',
            image: u.image || u.resume?.image || ''
        });
        setIsUserListOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await dispatch(updateRegisteredCandidate({ id: candidate._id, candidateData: formData })).unwrap();
            } else {
                await dispatch(createRegisteredCandidate(formData)).unwrap();
            }
            onClose();
        } catch (error) {
            alert(`Failed to save: ${error}`);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div 
                    className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                            {isEditing ? 'Edit Candidate Details' : 'Register New Candidate'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-2">
                        {!isEditing && (
                            <div className="relative">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Select from Registered Candidates List</label>
                                <div 
                                    className="relative cursor-pointer"
                                    onClick={() => setIsUserListOpen(!isUserListOpen)}
                                >
                                    <div className="w-full pl-12 pr-4 py-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl font-bold text-slate-900 flex items-center">
                                        <Search className="absolute left-4 w-5 h-5 text-emerald-500" />
                                        {formData.name ? `${formData.name} (${formData.email})` : 'Search & Select from Fetched Records...'}
                                        <List className="ml-auto w-5 h-5 text-emerald-300" />
                                    </div>
                                </div>

                                {isUserListOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute z-50 w-full mt-2 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden max-h-60 overflow-y-auto"
                                    >
                                        <div className="p-2 bg-slate-50 sticky top-0">
                                            <input 
                                                autoFocus
                                                type="text" 
                                                placeholder="Type to search candidates..." 
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full px-4 py-2 rounded-xl text-sm border-none focus:ring-2 focus:ring-emerald-500/20"
                                            />
                                        </div>
                                        {filteredUsers.length === 0 ? (
                                            <div className="p-4 text-center text-slate-400 text-sm font-bold">No candidates found</div>
                                        ) : (
                                            filteredUsers.map(u => (
                                                <div 
                                                    key={u._id}
                                                    onClick={() => handleSelectUser(u)}
                                                    className="px-4 py-3 hover:bg-emerald-50 cursor-pointer border-b border-slate-50 flex flex-col"
                                                >
                                                    <span className="font-black text-slate-800 text-sm">{u.name}</span>
                                                    <span className="text-slate-400 text-xs font-bold">{u.email}</span>
                                                </div>
                                            ))
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Candidate Name</label>
                                <input 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                    placeholder="Confirm Name" 
                                    required 
                                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                <input 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                    placeholder="Confirm Email" 
                                    required 
                                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contact Number</label>
                                <input 
                                    value={formData.phone} 
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                                    placeholder="e.g. +91 9999999999" 
                                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Training Domain</label>
                                <input 
                                    value={formData.course} 
                                    onChange={(e) => setFormData({...formData, course: e.target.value})} 
                                    placeholder="e.g. Full Stack Web Development" 
                                    required
                                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Candidate Media (Photo/Video)</label>
                            
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div className="w-24 h-24 rounded-3xl bg-slate-50 border-2 border-slate-100 overflow-hidden flex-shrink-0 shadow-inner group relative">
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
                                        <button 
                                            type="button" 
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="flex-1 px-4 py-3 bg-white border-2 border-slate-100 hover:border-emerald-500 rounded-xl text-[10px] font-bold text-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Upload className="w-4 h-4 text-emerald-500" />
                                            {isUploading ? 'Processing...' : 'Upload Media'}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-emerald-500 focus:bg-white transition-all outline-none text-[10px] font-medium text-slate-600 placeholder:text-slate-300"
                                            placeholder="Or enter media URL"
                                            value={formData.image}
                                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                                        />
                                        <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Batch Identifier</label>
                                <input 
                                    value={formData.batch} 
                                    onChange={(e) => setFormData({...formData, batch: e.target.value})} 
                                    placeholder="e.g. BATCH-2024-C" 
                                    required
                                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Current Enrollment Status</label>
                                <select 
                                    value={formData.status} 
                                    onChange={(e) => setFormData({...formData, status: e.target.value})} 
                                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 outline-none appearance-none"
                                >
                                    <option value="Active">Active Participant</option>
                                    <option value="Completed">Training Completed</option>
                                    <option value="Dropped">Discontinued</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="flex-1 px-4 py-4 border-2 border-slate-100 rounded-2xl font-black text-slate-400 uppercase tracking-widest text-xs hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={!formData.userId}
                                className="flex-[2] bg-slate-900 hover:bg-emerald-500 text-white font-black py-4 px-4 rounded-2xl shadow-xl transition-colors uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isEditing ? 'Update Records' : 'Confirm Registration'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RegisteredCandidateModal;
