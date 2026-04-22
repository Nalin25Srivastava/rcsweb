import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Mail, MapPin, DollarSign, GraduationCap, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { createJob, updateJob } from '../../store/slices/jobsSlice';

const JobModal = ({ isOpen, onClose, job = null, isEditing = false }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        location: '',
        salary: '',
        description: '',
        qualification: '',
        ageLimit: '',
        gender: 'Both',
        dutyTime: '',
        email: '',
        contactNumbers: '',
        profiles: '',
        customFields: [] // Array of { label: '', value: '' }
    });

    useEffect(() => {
        if (job && isEditing) {
            setFormData({
                title: job.title || '',
                companyName: job.companyName || '',
                location: job.location || '',
                salary: job.salary || '',
                description: job.description || '',
                qualification: job.qualification || '',
                ageLimit: job.ageLimit || '',
                gender: job.gender || 'Both',
                dutyTime: job.dutyTime || '',
                email: job.email || '',
                contactNumbers: job.contactNumbers || '',
                profiles: job.profiles || '',
                customFields: job.job_posting?.custom_fields ? Object.entries(job.job_posting.custom_fields).map(([label, value]) => ({ label, value })) : []
            });
        } else {
            setFormData({
                title: '',
                companyName: '',
                location: '',
                salary: '',
                description: '',
                qualification: '',
                ageLimit: '',
                gender: 'Both',
                dutyTime: '',
                email: '',
                contactNumbers: '',
                profiles: '',
                customFields: []
            });
        }
    }, [job, isEditing, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Transform custom fields array to object
        const customFieldsObj = formData.customFields.reduce((acc, field) => {
            if (field.label.trim() && field.value.trim()) {
                acc[field.label.trim()] = field.value.trim();
            }
            return acc;
        }, {});

        const submissionData = {
            ...formData,
            job_posting: {
                ...job?.job_posting,
                custom_fields: customFieldsObj
            }
        };

        if (isEditing && job?._id) {
            dispatch(updateJob({ id: job._id, jobData: submissionData }));
        } else {
            dispatch(createJob(submissionData));
        }
        onClose();
    };

    const addCustomField = () => {
        setFormData({
            ...formData,
            customFields: [...formData.customFields, { label: '', value: '' }]
        });
    };

    const removeCustomField = (index) => {
        const newFields = [...formData.customFields];
        newFields.splice(index, 1);
        setFormData({ ...formData, customFields: newFields });
    };

    const handleCustomFieldChange = (index, field, value) => {
        const newFields = [...formData.customFields];
        newFields[index][field] = value;
        setFormData({ ...formData, customFields: newFields });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl my-8 overflow-hidden border border-slate-100 flex flex-col"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                                    {isEditing ? 'Edit Job Posting' : 'Add New Job'}
                                </h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Post a new career opportunity</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-all text-slate-400 hover:text-red-500 shadow-sm border border-transparent hover:border-slate-100">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                        {/* Section 1: Basic Info */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Job Title</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                                        <input 
                                            className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                            placeholder="e.g. Software Engineer"
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
                                    <input 
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                        placeholder="Company Name"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Details */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Location & Compensation
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                                        <input 
                                            className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                            placeholder="e.g. Remote, New Delhi"
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Salary Range</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                                        <input 
                                            className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                            placeholder="e.g. 5-8 LPA"
                                            value={formData.salary}
                                            onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Requirements */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" /> Requirements
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Qualification</label>
                                    <input 
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                        placeholder="e.g. B.Tech, MBA"
                                        value={formData.qualification}
                                        onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Age Limit</label>
                                    <input 
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                        placeholder="e.g. 18-35"
                                        value={formData.ageLimit}
                                        onChange={(e) => setFormData({...formData, ageLimit: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Contact */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Contact Email</label>
                                    <input 
                                        type="email"
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                        placeholder="hr@company.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Numbers</label>
                                    <input 
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                        placeholder="Comma separated"
                                        value={formData.contactNumbers}
                                        onChange={(e) => setFormData({...formData, contactNumbers: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        </div>
                        
                        {/* Section 6: Custom Fields */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Custom Fields
                                </h3>
                                <button 
                                    type="button"
                                    onClick={addCustomField}
                                    className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:text-emerald-700 transition-colors"
                                >
                                    <Plus className="w-3 h-3" /> Add Field
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {formData.customFields.map((field, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="md:col-span-3 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Field Name</label>
                                            <input 
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 transition-all outline-none font-bold text-slate-700 text-sm"
                                                placeholder="e.g. Experience"
                                                value={field.label}
                                                onChange={(e) => handleCustomFieldChange(index, 'label', e.target.value)}
                                            />
                                        </div>
                                        <div className="md:col-span-3 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Value</label>
                                            <input 
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 transition-all outline-none font-bold text-slate-700 text-sm"
                                                placeholder="e.g. 2+ Years"
                                                value={field.value}
                                                onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                                            />
                                        </div>
                                        <div className="md:col-span-1 flex justify-center pb-1">
                                            <button 
                                                type="button" 
                                                onClick={() => removeCustomField(index)}
                                                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {formData.customFields.length === 0 && (
                                    <p className="text-xs text-slate-400 italic">No custom fields added yet. Dynamic fields will be stored in the database.</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button 
                                type="submit"
                                className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-6 rounded-3xl transition-all shadow-2xl shadow-slate-200 uppercase tracking-widest text-sm flex items-center justify-center gap-3 group"
                            >
                                <CheckCircle2 className="w-5 h-5 group-hover:scale-125 transition-transform" />
                                {isEditing ? 'Update Job Posting' : 'Publish Job Listing'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default JobModal;
