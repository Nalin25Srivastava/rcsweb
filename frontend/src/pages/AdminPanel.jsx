import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Briefcase, 
    Users, 
    GraduationCap,
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
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchJobs, deleteJob } from '../store/slices/jobsSlice';
import { fetchPlacedStudents, deletePlacedStudent } from '../store/slices/placedStudentsSlice';
import { fetchStats, deleteStat } from '../store/slices/statsSlice';
import { fetchSlides, deleteSlide } from '../store/slices/carouselSlice';
import { fetchServices } from '../store/slices/servicesSlice';
import { logout, fetchUsers } from '../store/slices/authSlice';
import PlacementModal from '../components/Admin/PlacementModal';
import JobModal from '../components/Admin/JobModal';
import StatModal from '../components/Admin/StatModal';
import CarouselModal from '../components/Admin/CarouselModal';
import ServiceEditModal from '../components/Admin/ServiceEditModal';

const AdminPanel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isSecretVerified } = useSelector((state) => state.auth);
    const { jobs } = useSelector((state) => state.jobs);
    const { placedStudents } = useSelector((state) => state.placedStudents);
    const { stats } = useSelector((state) => state.stats);
    const { users } = useSelector((state) => state.auth);
    const { services } = useSelector((state) => state.services);

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

    const [isCarouselModalOpen, setIsCarouselModalOpen] = useState(false);

    // Service Modal State
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

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

    const handleEditService = (service) => {
        setSelectedService(service);
        setIsServiceModalOpen(true);
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
        dispatch(fetchUsers());
        dispatch(fetchServices());
    }, [dispatch]);

    const getImageUrl = (image) => {
        if (!image) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&q=80&w=400';
        
        let url = image;
        if (typeof url === 'string' && url.includes('localhost:5000')) {
            url = url.replace(/http:\/\/localhost:5000/g, '');
        }

        if (url.startsWith('http') || url.startsWith('/uploads') || url.startsWith('data:')) return url;
        return `/images/${url}`;
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'jobs', label: 'Manage Jobs', icon: Briefcase },
        { id: 'students', label: 'Placed Students', icon: Users },
        { id: 'services', label: 'Platform Services', icon: LayoutDashboard },
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
            case 'services':
                return (
                    <ServiceManagementView 
                        services={services || []} 
                        onEdit={handleEditService}
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex overflow-hidden transition-colors duration-300">
            {/* Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-slate-900 dark:bg-black text-white flex flex-col relative z-20 shadow-2xl"
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
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                                    activeTab === item.id 
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
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
            <main className="flex-grow flex flex-col h-full overflow-hidden bg-white dark:bg-slate-900">
                {/* Header */}
                <header className="h-20 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 relative z-10">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                            {activeTab}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-100 dark:bg-slate-800"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{user?.name || 'Admin User'}</p>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Platform Admin</p>
                            </div>
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black border border-emerald-200 dark:border-emerald-500/20">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-grow overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950/50">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>

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

                <ServiceEditModal 
                    isOpen={isServiceModalOpen}
                    onClose={() => setIsServiceModalOpen(false)}
                    service={selectedService}
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
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {(students || []).map((student, i) => (
                    <div key={i} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm relative group overflow-hidden transition-all hover:border-emerald-500">
                        <div className="absolute top-0 right-0 p-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button 
                                onClick={() => onEdit(student)}
                                className="p-1.5 bg-white/95 backdrop-blur-sm text-blue-600 rounded-lg shadow-md hover:bg-blue-600 hover:text-white transition-all"
                            >
                                <Pencil className="w-3 h-3" />
                            </button>
                            <button 
                                onClick={() => onDelete(student._id)}
                                className="p-1.5 bg-white/95 backdrop-blur-sm text-red-500 rounded-lg shadow-md hover:bg-red-500 hover:text-white transition-all"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="w-12 h-12 bg-slate-100 rounded-lg mb-2 overflow-hidden shadow-inner border border-slate-200 mx-auto">
                                <img 
                                    src={getImageUrl?.(student?.image)} 
                                    alt={student?.name} 
                                    className="w-full h-full object-cover" 
                                />
                        </div>
                        <div className="text-center">
                            <h4 className="font-black text-slate-900 text-[11px] line-clamp-1 leading-tight">{student.name}</h4>
                            <p className="text-slate-500 font-bold text-[9px] uppercase tracking-wider line-clamp-1 mt-0.5">{student.company}</p>
                            <div className="mt-2 pt-1.5 border-t border-slate-50 flex flex-col items-center gap-0.5">
                                <span className="text-emerald-600 font-black text-[8px] uppercase tracking-tighter truncate w-full">{student.position}</span>
                                <span className="text-slate-900 font-black text-[9px]">{student.package}</span>
                            </div>
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

const ServiceManagementView = ({ services = [], onEdit }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">Platform Services Management</h2>
                <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl border border-amber-100 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Read-Only Order</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(services || []).map((service, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group transition-all hover:shadow-xl hover:shadow-slate-200">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 ${service.color} rounded-2xl`}>
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <button 
                                onClick={() => onEdit(service)}
                                className="p-3 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-emerald-500 transition-all transform hover:scale-105"
                            >
                                <Pencil className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <h4 className="text-xl font-black text-slate-900 mb-2">{service.title}</h4>
                        <p className="text-slate-500 font-bold text-sm leading-relaxed mb-6 line-clamp-2">{service.shortDesc}</p>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${service.accentColor.replace('text-', 'bg-')}`}></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order: {service.order}</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Active</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPanel;
