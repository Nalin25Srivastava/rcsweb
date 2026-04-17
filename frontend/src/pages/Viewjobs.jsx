import React, { useState, useEffect } from 'react';
import { Briefcase, Mail, X, ArrowRight, Plus, Pencil, Phone, Globe, Clock, MapPin, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs, deleteJob, reset, createJob, updateJob } from '../store/slices/jobsSlice';

const Viewjobs = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { jobs, isLoading, isError, message } = useSelector((state) => state.jobs);
    const { user: reduxUser } = useSelector((state) => state.auth);
    
    // Safer localStorage access
    const getStoredUser = () => {
        try {
            const stored = localStorage.getItem('rcs_user');
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    };
    
    const user = reduxUser || getStoredUser();
    const isVIP = user?.email === 'hitkarikusum.ngo@gmail.com' || user?.email === 'hitkarikusu.org@gmail.com';

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isJobFormOpen, setIsJobFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [jobFormData, setJobFormData] = useState({
        title: '',
        qualification: '',
        salary: '',
        location: '',
        dutyTime: '',
        gender: '',
        description: '', // Used for "Note"
        email: 'r.c.sindiaconcept@gmail.com',
        contactNumbers: ['8104083002', '9783945080', '8209635081'],
        callingTime: '10:00am to 5:00pm',
        website: 'www.rcsconsultant.com',
        companyName: 'RCS PLACEMENT KOTA'
    });
    const itemsPerPage = 8;

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15
            }
        },
        hover: {
            y: -10,
            scale: 1.02,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 10
            }
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 25
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.8, 
            y: 50,
            transition: {
                duration: 0.2
            }
        }
    };

    useEffect(() => {

        dispatch(fetchJobs());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            await dispatch(deleteJob(id));
            setSelectedJob(null);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        // Prepare the job data structure expected by the backend
        const jobData = {
            ...jobFormData,
            job_posting: {
                profile: jobFormData.title,
                location: jobFormData.location,
                urgency: 'URGENT',
                requirements: {
                    education: jobFormData.qualification,
                    gender_preference: jobFormData.gender
                },
                working_hours: {
                    shift: jobFormData.dutyTime
                },
                compensation_and_benefits: {
                    base_salary: jobFormData.salary
                },
                application_details: {
                    email: jobFormData.email,
                    contact_numbers: jobFormData.contactNumbers,
                    website: jobFormData.website,
                    calling_window: jobFormData.callingTime,
                    agency_name: jobFormData.companyName
                }
            }
        };

        if (isEditing) {
            await dispatch(updateJob({ id: editingId, jobData }));
        } else {
            await dispatch(createJob(jobData));
        }

        setIsJobFormOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setJobFormData({
            title: '',
            qualification: '',
            salary: '',
            location: '',
            dutyTime: '',
            gender: '',
            description: '',
            email: 'r.c.sindiaconcept@gmail.com',
            contactNumbers: ['8104083002', '9783945080', '8209635081'],
            callingTime: '10:00am to 5:00pm',
            website: 'www.rcsconsultant.com',
            companyName: 'RCS PLACEMENT KOTA'
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const openEditForm = (job) => {
        setSelectedJob(null);
        setIsEditing(true);
        setEditingId(job._id);
        
        // Try to pre-fill from structured data or fallbacks
        const jp = job.job_posting || {};
        const req = jp.requirements || {};
        const cb = jp.compensation_and_benefits || {};
        const wh = jp.working_hours || {};
        const ad = jp.application_details || {};

        setJobFormData({
            title: job.title || jp.profile || '',
            qualification: job.qualification || (Array.isArray(req.education) ? req.education.join(', ') : req.education) || '',
            salary: job.salary || cb.base_salary || '',
            location: job.location || jp.location || '',
            dutyTime: job.dutyTime || wh.shift || '',
            gender: job.gender || req.gender_preference || '',
            description: job.description || '',
            email: job.email || ad.email || 'r.c.sindiaconcept@gmail.com',
            contactNumbers: job.contactNumbers || ad.contact_numbers || ['8104083002', '9783945080', '8209635081'],
            callingTime: ad.calling_window || '10:00am to 5:00pm',
            website: ad.website || 'www.rcsconsultant.com',
            companyName: job.companyName || ad.agency_name || 'RCS PLACEMENT KOTA'
        });
        setIsJobFormOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJobFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (index, value) => {
        const newPhones = [...jobFormData.contactNumbers];
        newPhones[index] = value;
        setJobFormData(prev => ({ ...prev, contactNumbers: newPhones }));
    };

    const addPhoneField = () => {
        setJobFormData(prev => ({ ...prev, contactNumbers: [...prev.contactNumbers, ''] }));
    };

    const removePhoneField = (index) => {
        const newPhones = jobFormData.contactNumbers.filter((_, i) => i !== index);
        setJobFormData(prev => ({ ...prev, contactNumbers: newPhones }));
    };

    // Close modal on ESC key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedJob(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const totalPages = Math.ceil(jobs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentJobs = jobs.slice(startIndex, startIndex + itemsPerPage);

    const goToFirst = () => setCurrentPage(1);
    const goToPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToNext = () => {
        if (!isVIP && (!user || (!user._id && !user.id))) {
            alert('Register first');
            navigate('/signup');
            return;
        }

        // Check if standard user has completed profile registration (resume submission)
        if (!isVIP && user.role === 'user' && !user.isPaid) {
            alert('Please complete your profile registration first to see more jobs!');
            navigate('/postres');
            return;
        }

        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };
    const goToLast = () => {
        if (!isVIP && (!user || (!user._id && !user.id))) {
            alert('Register first');
            navigate('/signup');
            return;
        }

        if (!isVIP && user.role === 'user' && !user.isPaid) {
            alert('Please complete your profile registration first to see more jobs!');
            navigate('/postres');
            return;
        }

        setCurrentPage(totalPages);
    };
 
    const getJobCategory = (title) => {
        if (!title) return 'Active Hiring';
        const upperTitle = title.toUpperCase();
        if (upperTitle.includes('MAINTENANCE')) return 'MAINTENANCE';
        if (upperTitle.includes('PRODUCTION')) return 'PRODUCTION';
        if (upperTitle.includes('ON ROLL')) return 'ON ROLL';
        return 'Active Hiring';
    };

    const getCategoryStyles = (category) => {
        switch (category) {
            case 'MAINTENANCE': return 'bg-blue-600 border-blue-200 text-white';
            case 'PRODUCTION': return 'bg-orange-500 border-orange-200 text-white';
            case 'ON ROLL': return 'bg-emerald-600 border-emerald-200 text-white';
            default: return 'bg-green-500 border-green-200 text-white';
        }
    };

    // Helper to parse unstructured description into key-value pairs
    const parseJobDetails = (desc) => {
        if (!desc) return null;
        
        const details = {
            phones: [],
        };
        const lines = desc.split('\n');
        
        // Define common patterns to look for
        const patterns = {
            profile: /PROFILE\s*:\s*(.*)/i,
            qualification: /QUALIFICATION\s*:\s*(.*)/i,
            salary: /Salary\s*:\s*(.*)/i,
            time: /Time\s*:\s*(.*)/i,
            location: /Location\s*-\s*(.*)/i,
            age: /AGE\s*:\s*(.*)/i,
            candidate: /(.*candidate.*apply)/i,
            note: /Note\s*:\s*(.*)/i,
            callingTime: /CALLING TIME\s*[:_]\s*(.*)/i,
            website: /Website\s*[:]\s*(.*)/i,
            gender: /GENDER\s*:\s*(.*)/i,
            company: /COMPANY\s*:\s*(.*)/i,
        };

        lines.forEach(line => {
            const trimmed = line.trim();
            for (const [key, regex] of Object.entries(patterns)) {
                const match = trimmed.match(regex);
                if (match && match[1]) {
                    details[key] = match[1].trim();
                }
            }
            
            // Extract phones
            const phoneMatch = trimmed.match(/(\d{10})/g);
            if (phoneMatch) {
                details.phones = [...new Set([...details.phones, ...phoneMatch])];
            }

            // Extract Website specifically if not caught by patterns
            if (trimmed.toLowerCase().includes('website')) {
                const webMatch = trimmed.match(/(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-z]{2,})/i);
                if (webMatch) details.website = webMatch[0];
            }
        });

        return Object.keys(details).length > 1 ? details : null;
    };

    return (
        <div className="bg-white min-h-screen ">
            {/* Header Section */}
            {/* Header Banner */}
            <div className="relative bg-slate-900 py-20 px-4 overflow-hidden flex flex-col items-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-slate-900/40"></div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 text-center max-w-3xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 drop-shadow-2xl">
                        Explore <span className="text-emerald-400">Opportunities</span>
                    </h1>
                    <p className="text-slate-100 text-lg md:text-xl font-bold leading-relaxed drop-shadow-lg">
                        Find unparalleled career paths across our enterprise network.
                    </p>
                    
                    {user?.role === 'admin' && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { resetForm(); setIsJobFormOpen(true); }}
                            className="mt-8 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center gap-3 mx-auto uppercase tracking-widest text-sm"
                        >
                            <Plus className="w-5 h-5" /> Post New Job
                        </motion.button>
                    )}
                </motion.div>
            </div>

            {/* Jobs Grid */}
            <motion.div 
                key={currentPage} 
                className="max-w-9xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2 px-4"
                variants={containerVariants}
                initial="visible"
                animate="visible"
            >

                {isLoading ? (
                    <div className="col-span-full text-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">Loading jobs...</p>
                    </div>
                ) : isError ? (
                    <div className="col-span-full text-center py-10 text-red-500">
                        <p>Error: {message}</p>
                    </div>
                ) : currentJobs.length > 0 ? (
                    currentJobs.map((job, index) => (
                        <motion.div 
                            key={index} 
                            className="flex flex-col p-6 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer h-full relative overflow-hidden group"
                            variants={cardVariants}
                            initial="visible"
                            whileHover="hover"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full"></div>
                            
                            {/* Job Title */}
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight mb-4 flex items-center line-clamp-2 min-h-[3rem]">
                                {job.title} 
                            </h3>
                            
                            {/* Description */}
                            <p className="text-slate-500 font-medium mb-6 text-sm leading-relaxed flex-grow line-clamp-3">
                                {job.description}
                            </p>
                            
                            {/* Contact Email & Action */}
                            <div className="mt-auto">
                                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-6 bg-emerald-50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100">
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate">{job.email}</span>
                                </div>

                                <motion.button 
                                    onClick={() => setSelectedJob(job)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-slate-900 group-hover:bg-emerald-500 text-white font-black py-4 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                                >
                                    View Requirements <ArrowRight className="w-4 h-4 ml-1" />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-900 mb-2">No Jobs Available</h3>
                        <p className="text-slate-500 font-bold">Check back later for new opportunities or contact us directly.</p>
                    </div>
                )}
            </motion.div>

            {/* Pagination Controls */}
            {!isLoading && !isError && totalPages > 1 && (
                <div className="max-w-7xl mx-auto flex flex-col items-end gap-4 pb-20 px-4">
                    <div className="text-gray-500 font-medium text-lg">
                        Page <span className="text-gray-900 font-bold">{currentPage}</span> of <span className="text-gray-900 font-bold">{totalPages}</span>
                    </div>
                    <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                        <button 
                            onClick={goToFirst}
                            disabled={currentPage === 1}
                            className="px-8 py-4 text-lg font-bold text-gray-700 hover:bg-gray-50 border-r-2 border-gray-100 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            First
                        </button>
                        <button 
                            onClick={goToPrev}
                            disabled={currentPage === 1}
                            className="px-8 py-4 text-lg font-bold text-gray-700 hover:bg-gray-50 border-r-2 border-gray-100 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Prev
                        </button>
                        <button 
                            onClick={goToNext}
                            disabled={currentPage === totalPages}
                            className="px-8 py-4 text-lg font-bold text-gray-700 hover:bg-gray-50 border-r-2 border-gray-100 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                        <button 
                            onClick={goToLast}
                            disabled={currentPage === totalPages}
                            className="px-8 py-4 text-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Last
                        </button>
                    </div>
                </div>
            )}

            {/* Job Detail Modal */}
            {/* Job Form Modal (Add/Edit) */}
            <AnimatePresence>
                {isJobFormOpen && (
                    <motion.div 
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                                    {isEditing ? 'Edit Job Posting' : 'Create New Job'}
                                </h2>
                                <button onClick={() => setIsJobFormOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-6">
                                {/* Profile / Title */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Job Profile / Title</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                                        <input 
                                            name="title" 
                                            value={jobFormData.title} 
                                            onChange={handleInputChange} 
                                            placeholder="e.g. Mechanical Engineer" 
                                            required 
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Qualification */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Qualification</label>
                                        <input 
                                            name="qualification" 
                                            value={jobFormData.qualification} 
                                            onChange={handleInputChange} 
                                            placeholder="e.g. B.Tech / Diploma" 
                                            className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                        />
                                    </div>
                                    {/* Salary */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Salary</label>
                                        <input 
                                            name="salary" 
                                            value={jobFormData.salary} 
                                            onChange={handleInputChange} 
                                            placeholder="e.g. 15k - 25k" 
                                            className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                        />
                                    </div>
                                    {/* Location */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input 
                                                name="location" 
                                                value={jobFormData.location} 
                                                onChange={handleInputChange} 
                                                placeholder="e.g. Kota, Rajasthan" 
                                                className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    {/* Time */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Work Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input 
                                                name="dutyTime" 
                                                value={jobFormData.dutyTime} 
                                                onChange={handleInputChange} 
                                                placeholder="e.g. 10am to 6pm" 
                                                className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Gender */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Gender Preference</label>
                                        <select 
                                            name="gender" 
                                            value={jobFormData.gender} 
                                            onChange={handleInputChange} 
                                            className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none appearance-none"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male Only</option>
                                            <option value="Female">Female Only</option>
                                            <option value="Any">Male / Female both</option>
                                        </select>
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contact Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input 
                                                name="email" 
                                                type="email"
                                                value={jobFormData.email} 
                                                onChange={handleInputChange} 
                                                className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Description / Note */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Additional Note / Description</label>
                                    <textarea 
                                        name="description" 
                                        value={jobFormData.description} 
                                        onChange={handleInputChange} 
                                        rows="3"
                                        placeholder="e.g. Interview going on, reach soon..." 
                                        className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none resize-none"
                                    ></textarea>
                                </div>

                                {/* Technical Fields */}
                                <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Agency / Contact Branding</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            < Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input 
                                                name="website" 
                                                value={jobFormData.website} 
                                                onChange={handleInputChange} 
                                                placeholder="Website"
                                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input 
                                                name="callingTime" 
                                                value={jobFormData.callingTime} 
                                                onChange={handleInputChange} 
                                                placeholder="Calling Time"
                                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contact Numbers</label>
                                        <div className="space-y-2">
                                            {jobFormData.contactNumbers.map((phone, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <div className="relative flex-grow">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <input 
                                                            value={phone} 
                                                            onChange={(e) => handlePhoneChange(idx, e.target.value)}
                                                            placeholder="10 digit number"
                                                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none"
                                                        />
                                                    </div>
                                                    {jobFormData.contactNumbers.length > 1 && (
                                                        <button type="button" onClick={() => removePhoneField(idx)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" onClick={addPhoneField} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:text-emerald-700 transition-colors ml-1 mt-2">
                                                <Plus className="w-3 h-3" /> Add Number
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 sticky bottom-0 bg-white pb-2 flex gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsJobFormOpen(false)}
                                        className="flex-1 px-4 py-4 border-2 border-slate-100 rounded-2xl font-black text-slate-400 uppercase tracking-widest text-xs hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-[2] bg-slate-900 hover:bg-emerald-500 text-white font-black py-4 px-4 rounded-2xl shadow-xl transition-colors uppercase tracking-widest text-xs"
                                    >
                                        {isEditing ? 'Save Changes' : 'Post Job Listing'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedJob && (
                    <motion.div 
                        className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedJob(null)}
                    >
                        <motion.div 
                            className="bg-white rounded-[2rem] p-4 md:p-6 max-w-5xl w-full relative shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                        >

                        {/* Compact Header */}
                        <div className="flex justify-between items-start mb-3 pb-3 border-b-2 border-gray-100 px-1">
                            <X 
                                className="w-8 h-8 text-gray-400 hover:text-red-500 cursor-pointer transition-colors mt-[-0.5rem] mr-[-0.5rem] ml-auto" 
                                onClick={() => setSelectedJob(null)}
                            />
                        </div>

                        <div className="flex-grow overflow-y-auto pr-3 custom-scrollbar px-1">
                            {(() => {
                                const jp = selectedJob.job_posting || {};
                                const req = jp.requirements || {};
                                const cb = jp.compensation_and_benefits || {};
                                const wh = jp.working_hours || {};
                                const ad = jp.application_details || {};
                                
                                const details = parseJobDetails(selectedJob.description) || { phones: [] };
                                
                                // Unified data source with fallbacks
                                const jobData = {
                                    title: jp.profile || details.profile || selectedJob.title,
                                    company: ad.agency_name || selectedJob.companyName || details.company || 'RCS Placement Kota',
                                    industry: jp.industry || 'Recruitment',
                                    urgency: jp.urgency || 'Standard',
                                    location: jp.location || selectedJob.location || details.location || 'Kota',
                                    salary: cb.base_salary || selectedJob.salary || details.salary || 'Standard',
                                    education: req.education ? (Array.isArray(req.education) ? req.education.join(', ') : req.education) : (selectedJob.qualification || details.qualification || 'As per norms'),
                                    gender: req.gender_preference || selectedJob.gender || details.gender || 'Any',
                                    age: req.age_range || selectedJob.ageLimit || details.age || '18-35 Years',
                                    shift: wh.shift || selectedJob.dutyTime || details.time || 'Standard',
                                    email: ad.email || selectedJob.email,
                                    phones: ad.contact_numbers ? (Array.isArray(ad.contact_numbers) ? ad.contact_numbers : [ad.contact_numbers]) : [...new Set([...(selectedJob.contactNumbers || []), ...(details.phones || [])])],
                                    website: ad.website || details.website,
                                    callingTime: ad.calling_window || details.callingTime,
                                    techSkills: req.technical_skills || [],
                                    softSkills: req.soft_skills || [],
                                    status: jp.status || (details.candidate ? 'Limited seats' : 'Active')
                                };

                                return (
                                    <div className="flex flex-col space-y-6 pb-10">
                                        {/* Primary Info & Sidebar Grid */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            {/* Main Content (Left/Center) */}
                                            <div className="lg:col-span-2 space-y-6">
                                                {/* Profile & Note Summary */}
                                                <div className="bg-green-500 p-6 rounded-3xl border border-green-100 relative overflow-hidden">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <Briefcase className="w-6 h-6 text-green-700" />
                                                            <span className="text-[18px] font-black text-green-800 uppercase tracking-widest block">Job Title / Designation</span>
                                                        </div>
                                                        {jobData.urgency !== 'Standard' && (
                                                            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse uppercase tracking-wider shadow-lg">
                                                                {jobData.urgency} HIRING
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase mb-4 leading-tight">{jobData.title}</h2>
                                                    
                                                    <div className="flex flex-wrap gap-4 mt-4">
                                                        <div className="flex items-baseline gap-3">
                                                            <span className="text-[14px] font-black text-blue-900 uppercase tracking-widest block">Industry:</span>
                                                            <span className="text-xl font-bold text-gray-800 uppercase bg-white/30 px-3 py-0.5 rounded-lg border border-white/50">{jobData.industry}</span>
                                                        </div>
                                                        <div className="flex items-baseline gap-3">
                                                            <span className="text-[14px] font-black text-blue-900 uppercase tracking-widest block">Hiring Co:</span>
                                                            <span className="text-xl font-bold text-gray-800 uppercase">{jobData.company}</span>
                                                        </div>
                                                    </div>

                                                    {(details.note || jobData.status) && (
                                                        <div className="mt-6 p-4 bg-white/80 rounded-2xl border-l-4 border-green-700 italic text-gray-700 font-bold shadow-sm flex items-center justify-between">
                                                            <span>" {details.note || 'Apply today for a brighter career tomorrow.'} "</span>
                                                            {jobData.status && <span className="text-[10px] not-italic font-black text-green-700 uppercase ml-4 bg-green-100 px-3 py-1 rounded-full border border-green-200">{jobData.status}</span>}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Facts Grid */}
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    <div className="p-3 bg-white rounded-xl border-2 border-gray-50 flex items-center gap-3 hover:border-green-200 transition-colors">
                                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-black text-lg">₹</div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Salary Range</p>
                                                            <p className="text-sm font-black text-gray-900">{jobData.salary}</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-white rounded-xl border-2 border-gray-50 flex items-center gap-3 hover:border-purple-200 transition-colors">
                                                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Duty Timings</p>
                                                            <p className="text-sm font-black text-gray-900">{jobData.shift}</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-white rounded-xl border-2 border-gray-50 flex items-center gap-3 hover:border-orange-200 transition-colors">
                                                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Job Location</p>
                                                            <p className="text-sm font-black text-gray-900 uppercase">{jobData.location}</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-white rounded-xl border-2 border-gray-50 flex items-center gap-3 hover:border-green-200 transition-colors">
                                                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Age Limit</p>
                                                            <p className="text-sm font-black text-gray-900">{jobData.age}</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-white rounded-xl border-2 border-gray-50 flex items-center gap-3 hover:border-pink-200 transition-colors">
                                                        <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Gender</p>
                                                            <p className="text-sm font-black text-gray-900 uppercase">{jobData.gender}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Eligibility & Skills */}
                                                <div className="space-y-4">
                                                    <div className="bg-gray-900 p-6 rounded-3xl text-white shadow-xl">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-50">Qualification & Eligibility</h4>
                                                        <p className="text-xl font-black uppercase leading-tight">
                                                            {jobData.education}
                                                        </p>
                                                        {details.candidate && (
                                                            <p className="mt-3 text-[10px] font-black opacity-90 uppercase bg-green-500/20 text-green-400 inline-block px-3 py-1 rounded-lg border border-green-500/30">
                                                                {details.candidate}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {(jobData.techSkills.length > 0 || jobData.softSkills.length > 0) && (
                                                        <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-sm">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {jobData.techSkills.length > 0 && (
                                                                    <div>
                                                                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Technical Skills</h5>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {jobData.techSkills.map((skill, si) => (
                                                                                <span key={si} className="bg-blue-50 text-blue-700 text-[10px] font-black px-2 py-1 rounded-md border border-blue-100 uppercase">{skill}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {jobData.softSkills.length > 0 && (
                                                                    <div>
                                                                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Soft Skills</h5>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {jobData.softSkills.map((skill, si) => (
                                                                                <span key={si} className="bg-purple-50 text-purple-700 text-[10px] font-black px-2 py-1 rounded-md border border-purple-100 uppercase">{skill}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Sidebar (Right) */}
                                            <div className="lg:col-span-1 space-y-6">
                                                {/* Contact Details Card */}
                                                <div className="bg-white p-6 rounded-3xl border-4 border-gray-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                                    <h3 className="text-base font-black text-gray-900 uppercase mb-4 flex items-center gap-2">
                                                        <span className="w-8 h-8 bg-gray-900 text-white rounded-xl flex items-center justify-center text-sm">📞</span>
                                                        Direct Inquiry
                                                    </h3>
                                                    
                                                    <div className="space-y-4">
                                                        <div className="p-3 bg-gray-50 hover:bg-green-50 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-green-200" onClick={() => window.location.href = `mailto:${jobData.email}`}>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Official Email</p>
                                                            <p className="text-xs font-black text-green-600 break-all">{jobData.email}</p>
                                                        </div>
                                                        
                                                        {jobData.phones.length > 0 && (
                                                            <div className="space-y-2">
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Lines</p>
                                                                <div className="flex flex-col gap-2">
                                                                    {jobData.phones.map((phone, pi) => (
                                                                        <a 
                                                                            key={pi} 
                                                                            href={`tel:${phone}`}
                                                                            className="bg-gray-900 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all text-center shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                                                                        >
                                                                            {phone}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {jobData.website && (
                                                            <div className="p-3 bg-blue-50 hover:bg-blue-100 rounded-2xl cursor-pointer transition-colors border border-blue-100" onClick={() => window.open(jobData.website.startsWith('http') ? jobData.website : `https://${jobData.website}`, '_blank')}>
                                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Company Website</p>
                                                                <p className="text-xs font-black text-blue-600 break-all underline">{jobData.website}</p>
                                                            </div>
                                                        )}

                                                        {jobData.callingTime && (
                                                            <p className="text-[10px] font-black text-red-500 uppercase flex items-center gap-2 mt-3 p-2 bg-red-50 rounded-xl border border-red-100 font-bold">
                                                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                                                Call: {jobData.callingTime}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Quick Actions */}
                                                <div className="space-y-4">
                                                    {user?.role !== 'admin' && (
                                                        <Link 
                                                            to="/postres"
                                                            className="w-full bg-green-500 hover:bg-gray-900 text-white font-black py-4 px-4 rounded-2xl text-lg transition-all shadow-xl flex items-center justify-center gap-3 group uppercase"
                                                        >
                                                            Apply Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                        </Link>
                                                    )}
                                                    <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                        {jp.application_details?.interview_date ? `Interview Date: ${jp.application_details.interview_date}` : 'Interviews Are Ongoing'}
                                                    </p>
                                                </div>

                                                {/* Admin Actions */}
                                                <div className="pt-6 mt-6 border-t border-gray-100 space-y-4">
                                                    <div className="flex flex-col gap-1 px-1">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Posted On</span>
                                                        <span className="text-xs font-bold text-gray-600">
                                                            {new Date(selectedJob.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })} at {new Date(selectedJob.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </span>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleDelete(selectedJob._id)}
                                                        className="w-full bg-red-50 hover:bg-red-500 text-red-600 hover:text-white font-black py-3 px-4 rounded-2xl text-[10px] transition-all border border-red-200 hover:border-red-500 uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete Listing
                                                    </button>
                                                    
                                                    {user?.role === 'admin' && (
                                                        <button 
                                                            onClick={() => openEditForm(selectedJob)}
                                                            className="w-full bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white font-black py-3 px-4 rounded-2xl text-[10px] transition-all border border-blue-200 hover:border-blue-500 uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                                                        >
                                                            <Pencil className="w-4 h-4" /> Edit Listing
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Full Description Section - Outside the grid for full width */}
                                        <div className="bg-green-400 p-8 rounded-[2rem] border-2 border-green-500/20 shadow-xl relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-green-700 transition-all group-hover:w-3"></div>
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white/40 rounded-2xl flex items-center justify-center text-green-900 shadow-inner">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-green-800/60">Detailed overview</h4>
                                                        <h3 className="text-2xl font-black text-gray-900 uppercase">Complete Job Description</h3>
                                                    </div>
                                                </div>
                                                <div className="h-px bg-green-500/20 flex-grow mx-8 hidden sm:block"></div>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-lg font-bold text-red-900 uppercase leading-relaxed whitespace-pre-wrap">
                                                    {selectedJob.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Viewjobs;
