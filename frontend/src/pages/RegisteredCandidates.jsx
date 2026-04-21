import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
    fetchRegisteredCandidates, 
    deleteRegisteredCandidate, 
    createRegisteredCandidate, 
    updateRegisteredCandidate, 
    reset 
} from '../store/slices/registeredCandidatesSlice';
import { fetchUsers } from '../store/slices/authSlice';
import { 
    Users, 
    GraduationCap, 
    Calendar, 
    CheckCircle2, 
    Search, 
    Plus, 
    Pencil, 
    Trash2, 
    ShieldCheck, 
    LayoutDashboard 
} from 'lucide-react';
import RegisteredCandidateModal from '../components/Admin/RegisteredCandidateModal';

const RegisteredCandidates = () => {
    const dispatch = useDispatch();
    const { registeredCandidates, isLoading, isError, message } = useSelector((state) => state.registeredCandidates);
    const { users } = useSelector((state) => state.auth);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('registered'); // 'registered' | 'discover'
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState({ isEditing: false, candidate: null });

    useEffect(() => {
        dispatch(fetchRegisteredCandidates());
        dispatch(fetchUsers());
        return () => dispatch(reset());
    }, [dispatch]);

    const getImageUrl = (image) => {
        if (!image) return 'https://images.unsplash.com/photo-1594673752579-40993cf394c5?fit=crop&q=80&w=400';
        if (image.startsWith('http') || image.startsWith('/uploads') || image.startsWith('data:')) return image;
        return `/images/${image}`;
    };

    const handleAdd = () => {
        setModalMode({ isEditing: false, candidate: null });
        setIsModalOpen(true);
    };

    const handleEdit = (candidate) => {
        setModalMode({ isEditing: true, candidate });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to remove this registered candidate?')) {
            dispatch(deleteRegisteredCandidate(id));
        }
    };

    // Filter logic
    const filteredCandidates = registeredCandidates.filter(candidate => 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const registeredUserIds = registeredCandidates.map(c => c.user);
    const availableUsers = users.filter(u => 
        !registeredUserIds.includes(u._id) && 
        (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Admin Header */}
            <div className="bg-slate-900 pt-32 pb-24 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-center md:text-left"
                    >
                        <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <LayoutDashboard className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-emerald-400 font-black uppercase tracking-[0.2em] text-xs">Management System</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">
                            Registered <span className="text-emerald-400">Hub</span>
                        </h1>
                        <p className="text-slate-400 font-bold text-lg max-w-xl">
                            Oversee current enrollments and discover new candidates from the platform's user records.
                        </p>
                    </motion.div>

                    <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
                        <button 
                            onClick={() => setViewMode('registered')}
                            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                                viewMode === 'registered' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            Registered ({registeredCandidates.length})
                        </button>
                        <button 
                            onClick={() => setViewMode('discover')}
                            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                                viewMode === 'discover' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            Discover ({availableUsers.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Action Bar */}
            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
                <div className="bg-white p-4 rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder={viewMode === 'registered' ? "Search gallery..." : "Search user records..."} 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                        />
                    </div>
                    <button 
                        onClick={handleAdd}
                        className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                    >
                        <Plus className="w-6 h-6" /> Add New
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 mt-16">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 border-t-transparent"></div>
                            <p className="mt-6 text-slate-500 font-bold uppercase tracking-widest">Updating Records...</p>
                        </motion.div>
                    ) : viewMode === 'registered' ? (
                        <motion.div 
                            key="registered-list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {isError && (
                                <div className="col-span-full mb-8 p-6 bg-red-50 border-2 border-red-100 rounded-3xl text-red-600 font-bold text-center">
                                    <p className="uppercase tracking-widest text-xs mb-2">Fetch Error Detected</p>
                                    <p>{message}</p>
                                </div>
                            )}
                            {filteredCandidates.length === 0 ? (
                                <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-4 border-dashed border-slate-100">
                                    <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                    <h3 className="text-2xl font-black text-slate-300 uppercase">No Registered Matches</h3>
                                    <p className="text-slate-400 font-bold mt-2">Check the database or adjust your search.</p>
                                </div>
                            ) : (
                                filteredCandidates.map((candidate) => (
                                    <motion.div 
                                        key={candidate._id}
                                        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 group relative overflow-hidden"
                                        whileHover={{ y: -8 }}
                                    >
                                        <div className="absolute top-0 right-0 p-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0 z-30">
                                            <button 
                                                onClick={() => handleEdit(candidate)}
                                                className="p-3 bg-white/95 backdrop-blur-sm text-blue-600 rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-all border border-slate-100"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(candidate._id)}
                                                className="p-3 bg-white/95 backdrop-blur-sm text-red-500 rounded-2xl shadow-xl hover:bg-red-500 hover:text-white transition-all border border-slate-100"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center gap-6 mb-8 relative z-10">
                                            <div className="w-24 h-24 rounded-3xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                                                <img 
                                                    src={getImageUrl(candidate.image)} 
                                                    alt={candidate.name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                                                    {candidate.name}
                                                </h3>
                                                <div className="flex items-center gap-1.5 mt-1 text-emerald-600">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Active Enrollment</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 relative z-10">
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                                                <GraduationCap className="w-5 h-5 text-slate-400" />
                                                <span className="text-sm font-bold text-slate-700">{candidate.course}</span>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch</span>
                                                <span className="text-slate-900 font-black text-sm uppercase">{candidate.batch}</span>
                                            </div>
                                            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                                                {candidate.status}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="discover-list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {availableUsers.length === 0 ? (
                                <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-4 border-dashed border-slate-100">
                                    <ShieldCheck className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                    <h3 className="text-2xl font-black text-slate-300 uppercase">No New Candidates Found</h3>
                                </div>
                            ) : (
                                availableUsers.map((u) => (
                                    <motion.div 
                                        key={u._id}
                                        className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:border-emerald-200 transition-colors"
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                                <Users className="w-8 h-8 text-emerald-500" />
                                            </div>
                                            <button 
                                                onClick={() => handleEdit(u)}
                                                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-lg shadow-slate-900/10"
                                            >
                                                Select & Register
                                            </button>
                                        </div>
                                        <h4 className="font-black text-slate-900 text-xl mb-1">{u.name}</h4>
                                        <p className="text-slate-400 font-bold text-sm truncate mb-6">{u.email}</p>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                            <p className="text-emerald-500 font-black text-xs uppercase flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                Verified Account
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <RegisteredCandidateModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                candidate={modalMode.candidate}
                isEditing={modalMode.isEditing}
                users={users || []}
            />
        </div>
    );
};

export default RegisteredCandidates;
