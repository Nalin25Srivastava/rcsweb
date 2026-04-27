import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { IoBriefcase, IoSchool, IoPeople, IoTrendingUp } from "react-icons/io5";
import { Plus, Pencil, Trash2, X, Download, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import Carousel from '../components/Carousel';
import PlacementModal from '../components/Admin/PlacementModal';
import { fetchPlacedStudents, reset as resetPlacedStudents, deletePlacedStudent } from '../store/slices/placedStudentsSlice';
import { fetchStats, reset as resetStats } from '../store/slices/statsSlice';
import { Link } from 'react-router-dom';

const Home = () => {
    const dispatch = useDispatch();
    const { placedStudents, isLoading: studentsLoading, isError: studentsError, message: studentsMessage } = useSelector((state) => state.placedStudents);
    const { stats, isLoading: statsLoading } = useSelector((state) => state.stats);
    const { user } = useSelector((state) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState({ isEditing: false, student: null });

    useEffect(() => {
        dispatch(fetchPlacedStudents());
        dispatch(fetchStats());
        return () => {
            dispatch(resetPlacedStudents());
            dispatch(resetStats());
        };
    }, [dispatch]);

    const handleAdd = () => {
        setModalMode({ isEditing: false, student: null });
        setIsModalOpen(true);
    };

    const handleEdit = (student) => {
        setModalMode({ isEditing: true, student });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to remove this success story?')) {
            dispatch(deletePlacedStudent(id));
        }
    };

    const getImageUrl = (image) => {
        if (!image) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&q=80&w=400';
        
        let url = image;
        if (typeof url === 'string' && url.includes('localhost:5000')) {
            url = url.replace(/http:\/\/localhost:5000/g, '');
        }

        if (url.startsWith('http') || url.startsWith('/uploads') || url.startsWith('data:')) return url;
        return `/images/${url}`;
    };

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'Briefcase': return <IoBriefcase className="w-8 h-8"/>;
            case 'School': return <IoSchool className="w-8 h-8"/>;
            case 'People': return <IoPeople className="w-8 h-8"/>;
            case 'TrendingUp': return <IoTrendingUp className="w-8 h-8"/>;
            default: return <IoBriefcase className="w-8 h-8"/>;
        }
    };

    return (
        <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            {/* Hero Section */}
            <Carousel />

            {/* Placement Modal */}
            <PlacementModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                isEditing={modalMode.isEditing}
                student={modalMode.student}
            />

            {/* Stats Section with Glassmorphism */}
            <div className="relative -mt-24 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 border border-white/50 dark:border-slate-800/50"
                >
                    {statsLoading ? (
                        <div className="col-span-full flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : stats.map((stat, i) => (
                        <div key={i} className="text-center group">
                            <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                {getIcon(stat.iconName)}
                            </div>
                            <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stat.value}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-sm mt-1">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Value Proposition */}
            <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-emerald-400 rounded-3xl blur-3xl opacity-20 transform -rotate-6"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
                            alt="Team working" 
                            className="relative rounded-3xl shadow-2xl border border-white z-10"
                        />
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold uppercase tracking-widest text-sm">
                            Why RCS Placement?
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                            Accelerating Careers, <span className="text-emerald-500">Bridging the Gap.</span>
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            We don't just find jobs; we build careers. Our exclusive partnerships with top-tier technology and corporate enterprises ensure our registered members always have access to premium unlisted opportunities.
                        </p>
                        <ul className="space-y-4 pt-4">
                            {['Exclusive Top-Tier Partnerships', 'Dedicated Placement Guidance', 'Resume & Interview Prep', 'Transparent Agency Ecosystem'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        {user?.role === 'admin' && (
                            <div className="pt-8">
                                <Link 
                                    to="/registered-candidates" 
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-slate-200 group"
                                >
                                    Manage Records
                                    <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Placed Students Section */}
            <div className="bg-slate-50 dark:bg-slate-900 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500 rounded-full blur-[150px] opacity-10"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[150px] opacity-10"></div>
                
                            whileTap={{ scale: 0.95 }}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl transition-all border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1"
                        >
                            <Plus className="w-6 h-6" /> Add Success Story
                        </motion.button>
                    )}
                </div>

                <motion.div 
                    className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {studentsLoading ? (
                        <div className="col-span-full flex justify-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-500 border-t-transparent"></div>
                        </div>
                    ) : studentsError ? (
                        <div className="col-span-full text-center py-20 text-red-400 font-bold bg-red-900/10 rounded-3xl border border-red-500/20">
                            <p>Error loading success stories: {studentsMessage}</p>
                            <button onClick={() => dispatch(fetchPlacedStudents())} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">Retry</button>
                        </div>
                    ) : (placedStudents && Array.isArray(placedStudents) && placedStudents.length > 0) ? (
                        placedStudents.map((student, index) => (
                            <motion.div 
                                key={index} 
                                className="bg-slate-800/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-700/50 group relative"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10, boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.2)' }}
                            >
                                {/* Admin Actions Overlay */}
                                {user?.role === 'admin' && (
                                    <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleEdit(student); }}
                                            className="p-2 bg-white/10 hover:bg-emerald-500 backdrop-blur-md rounded-xl text-white transition-all border border-white/20 hover:border-emerald-400 shadow-xl"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(student._id); }}
                                            className="p-2 bg-white/10 hover:bg-red-500 backdrop-blur-md rounded-xl text-white transition-all border border-white/20 hover:border-red-400 shadow-xl"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <div className="relative h-72 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                                    <img 
                                        src={getImageUrl(student.image)} 
                                        alt={student.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{student.name}</h3>
                                        <p className="text-emerald-500 font-bold text-sm tracking-widest uppercase">{student.position}</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-800 text-center flex flex-col justify-between">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Hired By</p>
                                        <div className="bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{student.compensation || '---'}</p>
                                        </div>
                                    </div>
                                    <p className="text-xl font-extrabold text-white truncate">{student.company}</p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-slate-400 font-bold bg-slate-800/30 rounded-3xl border border-slate-700 border-dashed">
                            <p>Our success database is currently updating.</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Call to Action */}
            <div className="bg-emerald-500 py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center relative z-10 px-4"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to Transform Your Future?</h2>
                    <p className="text-xl text-emerald-100 font-medium mb-10 max-w-2xl mx-auto">
                        Join thousands of professionals securing high-status organizational roles through the RCS Placement Hub.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {user?.role !== 'admin' && (
                            <Link to="/postres" className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest rounded-full transition-colors shadow-2xl flex items-center justify-center gap-2">
                                Register Now <span className="text-emerald-400 text-xl">→</span>
                            </Link>
                        )}
                        <Link to="/viewjobs" className="px-8 py-4 bg-emerald-400 hover:bg-emerald-300 text-emerald-900 border-2 border-emerald-300 font-black uppercase tracking-widest rounded-full transition-colors shadow-lg shadow-emerald-600/50 flex items-center justify-center gap-2">
                            Explore Opportunities
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
