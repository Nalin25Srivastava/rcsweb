import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Briefcase, 
    Users, 
    Image as ImageIcon, 
    BarChart3, 
    Settings, 
    Search, 
    Plus, 
    LogOut,
    ChevronRight,
    Star,
    Bell,
    Mail,
    ArrowRight,
    Trash2,
    Pencil,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchJobs, deleteJob, createJob, updateJob } from '../store/slices/jobsSlice';
import { fetchPlacedStudents, deletePlacedStudent, createPlacedStudent, updatePlacedStudent } from '../store/slices/placedStudentsSlice';
import { fetchSlides, deleteSlide } from '../store/slices/carouselSlice';
import { fetchStats, deleteStat } from '../store/slices/statsSlice';
import { logout } from '../store/slices/authSlice';
import PlacementModal from '../components/Admin/PlacementModal';
import JobModal from '../components/Admin/JobModal';
import StatModal from '../components/Admin/StatModal';
import CarouselModal from '../components/Admin/CarouselModal';

const AdminPanel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isSecretVerified } = useSelector((state) => state.auth);
    const { jobs } = useSelector((state) => state.jobs);
    const { placedStudents } = useSelector((state) => state.placedStudents);
    const { stats } = useSelector((state) => state.stats);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { slides } = useSelector((state) => state.carousel);

    // Student Modal State
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [studentModalMode, setStudentModalMode] = useState({ isEditing: false, student: null });

    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [jobModalMode, setJobModalMode] = useState({ isEditing: false, job: null });

    // Stat Modal State
    const [isStatModalOpen, setIsStatModalOpen] = useState(false);
    const [statModalMode, setStatModalMode] = useState({ isEditing: false, stat: null });

    // Carousel Modal State
    const [isCarouselModalOpen, setIsCarouselModalOpen] = useState(false);

    const handleAddJob = () => {
        setJobModalMode({ isEditing: false, job: null });
        setIsJobModalOpen(true);
    };

    const handleEditJob = (job) => {
        setJobModalMode({ isEditing: true, job });
        setIsJobModalOpen(true);
    };

    const handleDeleteJob = (id) => {
        if (window.confirm('Are you sure you want to delete this job posting?')) {
            dispatch(deleteJob(id));
        }
    };

    const handleAddStat = () => {
        setStatModalMode({ isEditing: false, stat: null });
        setIsStatModalOpen(true);
    };

    const handleEditStat = (stat) => {
        setStatModalMode({ isEditing: true, stat });
        setIsStatModalOpen(true);
    };

    const handleDeleteStat = async (id) => {
        if (window.confirm('Are you sure you want to delete this statistic?')) {
            dispatch(deleteStat(id));
        }
    };

    const handleDeleteSlide = (id) => {
        if (window.confirm('Are you sure you want to delete this slide?')) {
            dispatch(deleteSlide(id));
        }
    };

    const handleAddStudent = () => {
        setStudentModalMode({ isEditing: false, student: null });
        setIsStudentModalOpen(true);
    };

    const handleEditStudent = (student) => {
        setStudentModalMode({ isEditing: true, student });
        setIsStudentModalOpen(true);
    };

    const handleDeleteStudent = (id) => {
        if (window.confirm('Are you sure you want to remove this record?')) {
            dispatch(deletePlacedStudent(id));
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'admin' || !isSecretVerified) {
            navigate('/login');
        }
    }, [user, isSecretVerified, navigate]);

    useEffect(() => {
        dispatch(fetchJobs());
        dispatch(fetchPlacedStudents());
        dispatch(fetchStats());
        dispatch(fetchSlides());
    }, [dispatch]);

    const getImageUrl = (image) => {
        if (!image) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&q=80&w=400';
        if (image.startsWith('http') || image.startsWith('/uploads') || image.startsWith('data:')) return image;
        return `/images/${image}`;
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'jobs', label: 'Manage Jobs', icon: Briefcase },
        { id: 'students', label: 'Placed Students', icon: Users },
        { id: 'stats', label: 'Statistics', icon: BarChart3 },
        { id: 'carousel', label: 'Carousel Slider', icon: ImageIcon },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardView jobs={jobs || []} students={placedStudents || []} stats={stats || []} onNavigate={setActiveTab} />;
            case 'jobs':
                return (
                    <JobManagementView 
                        jobs={jobs || []} 
                        onAdd={handleAddJob}
                        onEdit={handleEditJob}
                        onDelete={handleDeleteJob}
                    />
                );
            case 'students':
                return (
                    <StudentManagementView 
                        students={placedStudents || []} 
                        onAdd={handleAddStudent}
                        onEdit={handleEditStudent}
                        onDelete={handleDeleteStudent}
                        getImageUrl={getImageUrl}
                    />
                );
            case 'stats':
                return (
                    <StatManagementView 
                        stats={stats || []} 
                        onAdd={handleAddStat}
                        onEdit={handleEditStat}
                        onDelete={handleDeleteStat}
                    />
                );
            case 'carousel':
                return (
                    <CarouselManagementView 
                        slides={slides || []} 
                        onAdd={() => setIsCarouselModalOpen(true)}
                        onDelete={handleDeleteSlide}
                        getImageUrl={getImageUrl}
                    />
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Settings className="w-16 h-16 mb-4 animate-spin-slow" />
                        <h2 className="text-xl font-bold">This section is under development</h2>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden">
            {/* Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-slate-900 text-white flex flex-col relative z-20 shadow-2xl"
            >
                <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    {isSidebarOpen && (
                        <motion.h1 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-black text-xl tracking-tighter"
                        >
                            ADMIN<span className="text-emerald-500">PANEL</span>
                        </motion.h1>
                    )}
                </div>

                <nav className="flex-grow p-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                                    isActive 
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:text-emerald-400'}`} />
                                {isSidebarOpen && (
                                    <span className="font-bold text-sm tracking-wide">{item.label}</span>
                                )}
                                {isActive && isSidebarOpen && (
                                    <motion.div layoutId="activeInd" className="ml-auto w-1.5 h-1.5 bg-white rounded-full ring-4 ring-white/20" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="font-bold text-sm">Sign Out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-grow flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 p-4 px-8 flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                        </button>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search everything..." 
                                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-4">
                            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all">
                                <Mail className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="h-8 w-px bg-slate-200 selection:bg-transparent"></div>
                        <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-100">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold overflow-hidden shadow-inner">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-sm font-black text-slate-900">{user?.name || 'Administrator'}</span>
                                <span className="text-[10px] uppercase font-black text-emerald-600 tracking-tighter">Verified Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar min-h-screen">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <PlacementModal 
                    isOpen={isStudentModalOpen} 
                    onClose={() => setIsStudentModalOpen(false)} 
                    student={studentModalMode.student}
                    isEditing={studentModalMode.isEditing}
                />

                <JobModal 
                    isOpen={isJobModalOpen}
                    onClose={() => setIsJobModalOpen(false)}
                    job={jobModalMode.job}
                    isEditing={jobModalMode.isEditing}
                />

                <StatModal 
                    isOpen={isStatModalOpen}
                    onClose={() => setIsStatModalOpen(false)}
                    stat={statModalMode.stat}
                    isEditing={statModalMode.isEditing}
                />

                <CarouselModal 
                    isOpen={isCarouselModalOpen}
                    onClose={() => setIsCarouselModalOpen(false)}
                />
            </main>
        </div>
    );
};

// Sub-components
const DashboardView = ({ jobs = [], students = [], stats = [], onNavigate }) => {
    const cards = [
        { label: 'Total Jobs', value: jobs?.length || 0, color: 'emerald', icon: Briefcase },
        { label: 'Placed Students', value: students?.length || 0, color: 'blue', icon: Users },
        { label: 'Live Stats', value: stats?.length || 0, color: 'purple', icon: BarChart3 },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-widest">{card.label}</p>
                                <h3 className="text-4xl font-black text-slate-900">{card.value}</h3>
                            </div>
                            <div className={`w-14 h-14 bg-${card.color}-500/10 text-${card.color}-600 rounded-2xl flex items-center justify-center`}>
                                <Icon className="w-7 h-7" />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[400px]">
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Recent Job Postings
                    </h3>
                    <div className="space-y-4">
                        {(jobs || []).slice(0, 5).map((job, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-200 transition-colors">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div className="flex-grow cursor-pointer" onClick={() => onNavigate('jobs')}>
                                    <h4 className="font-black text-slate-900 leading-tight">{job.title}</h4>
                                    <p className="text-xs text-slate-500 font-bold mt-1">{job.location} • {job.salary}</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-end">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-black mb-4">Admin Insights</h3>
                        <p className="text-slate-400 font-medium mb-8">The platform is showing a 24% increase in student engagement this month. You have 3 pending carousel updates.</p>
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-xl transition-all flex items-center gap-2 uppercase tracking-widest text-xs">
                            View Full Report <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const JobManagementView = ({ jobs = [], onAdd, onEdit, onDelete }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">Manage Job Listings</h2>
                <button 
                    onClick={onAdd}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-widest text-xs"
                >
                    <Plus className="w-5 h-5" /> Add New Job
                </button>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Job Title</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Location</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Salary</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {(jobs || []).map((job, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <span className="font-bold text-slate-900 block">{job.title}</span>
                                    <span className="text-xs text-slate-400 font-bold">{job.companyName || 'RCS PLACEMENT'}</span>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-600">{job.location}</td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-600">{job.salary}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase border border-emerald-100 italic">Active</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => onEdit(job)}
                                            className="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all" 
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => onDelete(job._id)}
                                            className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all" 
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StudentManagementView = ({ students = [], onAdd, onEdit, onDelete, getImageUrl }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">Manage Placed Students</h2>
                <button 
                    onClick={onAdd}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-widest text-xs"
                >
                    <Plus className="w-5 h-5" /> Add Student
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(students || []).map((student, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => onEdit(student)}
                                className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => onDelete(student._id)}
                                className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-xl shadow-lg hover:bg-red-500 hover:text-white transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl mb-4 overflow-hidden shadow-inner border border-slate-200">
                                <img 
                                    src={getImageUrl?.(student?.image)} 
                                    alt={student?.name} 
                                    className="w-full h-full object-cover" 
                                />
                        </div>
                        <h4 className="font-black text-slate-900 text-lg">{student.name}</h4>
                        <p className="text-slate-500 font-bold text-sm mt-1">{student.company}</p>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">{student.position}</span>
                            <span className="text-slate-900 font-black text-sm">{student.package}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StatManagementView = ({ stats = [], onAdd, onEdit, onDelete }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">Manage Platform Statistics</h2>
                <button 
                    onClick={onAdd}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-widest text-xs"
                >
                    <Plus className="w-5 h-5" /> Add Stat
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(stats || []).map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:border-emerald-500 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => onEdit(stat)}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => onDelete(stat._id)}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <h4 className="text-3xl font-black text-slate-900">{stat.value}</h4>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CarouselManagementView = ({ slides = [], onAdd, onDelete, getImageUrl }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">Carousel Slider Management</h2>
                <button 
                    onClick={onAdd}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-widest text-sm"
                >
                    <Plus className="w-5 h-5" /> Upload Image
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(slides || []).map((slide, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group relative">
                        <div className="aspect-video relative overflow-hidden">
                            <img 
                                src={getImageUrl(slide.url)} 
                                alt={slide.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6">
                                <h4 className="text-white font-black text-xl leading-tight">{slide.title}</h4>
                                <p className="text-white/70 text-sm font-bold mt-1">{slide.subtitle}</p>
                            </div>
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => onDelete(slide._id)}
                                    className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Slide Order: {slide.order}</span>
                            <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Active</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPanel;
