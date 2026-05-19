import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProfile, updateProfile, fetchAuditLogs } from '../store/slices/authSlice';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Calendar, Activity, Edit3, Save, History, FileText } from 'lucide-react';

const Profile = () => {
    const dispatch = useDispatch();
    const { user, profile, auditLogs, isLoading, isError, message, isSuccess } = useSelector((state) => state.auth);
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        mobileNo: '',
        qualification: '',
        gender: '',
        age: '',
        address: '',
        skills: '',
        experience: ''
    });

    useEffect(() => {
        dispatch(fetchProfile());
        if (user && user.role === 'admin') {
            dispatch(fetchAuditLogs());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                mobileNo: profile.mobileNo || '',
                qualification: profile.qualification || '',
                gender: profile.gender || '',
                age: profile.age || '',
                address: profile.address || '',
                skills: profile.skills || '',
                experience: profile.experience || ''
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProfile(formData));
        setIsEditing(false);
    };

    if (!profile) return (
        <div className="min-h-screen pt-24 flex items-center justify-center dark:bg-slate-950">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );

    const isAdmin = user && user.role === 'admin';
    const myEditsCount = auditLogs.filter(log => log.adminId === user._id).length;
    const otherEditsCount = auditLogs.filter(log => log.adminId !== user._id).length;

    return (
        <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 mb-8 flex flex-col md:flex-row items-center gap-8"
                >
                    <div className="w-32 h-32 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border-4 border-emerald-50 dark:border-slate-800 shadow-inner flex-shrink-0">
                        <User className="w-16 h-16" />
                    </div>
                    <div className="text-center md:text-left flex-grow">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white capitalize">{profile.name}</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2 mt-2">
                            <Mail className="w-4 h-4" /> {profile.email}
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${isAdmin ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                {isAdmin ? 'Admin' : 'User'} Account
                            </span>
                            {profile.isPaid && (
                                <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                    Premium
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${isEditing ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300' : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-md'}`}
                        >
                            {isEditing ? <><X className="w-4 h-4" /> Cancel</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Form/Details */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800"
                    >
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-emerald-500" /> 
                            {isEditing ? 'Edit Information' : 'Personal Information'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info - Always Editable */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        disabled={!isEditing}
                                        value={formData.name} 
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-70 font-medium" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mobile Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <input 
                                            type="text" 
                                            name="mobileNo"
                                            disabled={!isEditing}
                                            value={formData.mobileNo} 
                                            onChange={handleChange}
                                            placeholder="Not provided"
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-70 font-medium" 
                                        />
                                    </div>
                                </div>

                                {/* User Specific Info */}
                                {!isAdmin && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Qualification</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <GraduationCap className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    name="qualification"
                                                    disabled={!isEditing}
                                                    value={formData.qualification} 
                                                    onChange={handleChange}
                                                    placeholder="e.g. B.Tech, MCA"
                                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-70 font-medium" 
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Age</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <input 
                                                    type="number" 
                                                    name="age"
                                                    disabled={!isEditing}
                                                    value={formData.age} 
                                                    onChange={handleChange}
                                                    placeholder="Years"
                                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-70 font-medium" 
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Gender</label>
                                            <select 
                                                name="gender"
                                                disabled={!isEditing}
                                                value={formData.gender} 
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-70 font-medium"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Experience</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Briefcase className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    name="experience"
                                                    disabled={!isEditing}
                                                    value={formData.experience} 
                                                    onChange={handleChange}
                                                    placeholder="e.g. 2 Years"
                                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-70 font-medium" 
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Skills</label>
                                            <input 
                                                type="text" 
                                                name="skills"
                                                disabled={!isEditing}
                                                value={formData.skills} 
                                                onChange={handleChange}
                                                placeholder="e.g. React, Node.js, Python"
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-70 font-medium" 
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Address</label>
                                            <div className="relative">
                                                <div className="absolute top-3.5 left-3 pointer-events-none">
                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <textarea 
                                                    name="address"
                                                    disabled={!isEditing}
                                                    value={formData.address} 
                                                    onChange={handleChange}
                                                    rows="3"
                                                    placeholder="Full Address"
                                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-70 font-medium resize-none" 
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <AnimatePresence>
                                {isEditing && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="pt-4 flex justify-end"
                                    >
                                        <button 
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex items-center gap-2 bg-[#00c57d] text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-emerald-500/20 hover:bg-[#00ae6e] transition-colors disabled:opacity-70"
                                        >
                                            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                                            Save Changes
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </motion.div>

                    {/* Right Column: Admin Stats (Only visible to Admins) */}
                    {isAdmin && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-indigo-500" /> 
                                    Activity Dashboard
                                </h2>
                                
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-800/50">
                                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">My Edits</p>
                                        <p className="text-3xl font-black text-indigo-900 dark:text-indigo-300">{myEditsCount}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Other Admins</p>
                                        <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{otherEditsCount}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <History className="w-4 h-4" /> Recent Edits
                                    </h3>
                                </div>
                                
                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {auditLogs.length === 0 ? (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">No recent activity.</p>
                                    ) : (
                                        auditLogs.slice(0, 10).map((log) => (
                                            <div key={log._id} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-sm">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-bold text-slate-900 dark:text-white capitalize">{log.adminName}</span>
                                                    <span className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[9px] uppercase font-black tracking-widest px-1.5 rounded ${log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-700' : log.action === 'DELETE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {log.action}
                                                    </span>
                                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{log.entityType}</span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 truncate">{log.details}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
