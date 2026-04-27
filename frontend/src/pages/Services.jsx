import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Users, Monitor, BarChart, Clock, CheckCircle2 } from 'lucide-react';

const services = [
    {
        id: 'career-development',
        title: 'Career Development',
        description: 'Personalized career mapping, resume optimization, and interview coaching to help you reach your full potential.',
        icon: <GraduationCap className="w-8 h-8" />,
        color: 'bg-emerald-50 text-emerald-600',
        borderColor: 'border-emerald-200'
    },
    {
        id: 'permanent-recruitment',
        title: 'Permanent Recruitment',
        description: 'End-to-end recruitment solutions for long-term organizational success. We find the perfect fit for your corporate culture.',
        icon: <Users className="w-8 h-8" />,
        color: 'bg-blue-50 text-blue-600',
        borderColor: 'border-blue-200'
    },
    {
        id: 'campus-recruitment',
        title: 'Campus Recruitment',
        description: 'Connecting top universities with industry leaders to secure fresh talent and build a pipeline for the future.',
        icon: <Briefcase className="w-8 h-8" />,
        color: 'bg-amber-50 text-amber-600',
        borderColor: 'border-amber-200'
    },
    {
        id: 'it-services',
        title: 'IT Services',
        description: 'Specialized IT staffing and project-based solutions for the technology sector, from software dev to cybersecurity.',
        icon: <Monitor className="w-8 h-8" />,
        color: 'bg-purple-50 text-purple-600',
        borderColor: 'border-purple-200'
    },
    {
        id: 'marketing',
        title: 'Marketing',
        description: 'Strategic placement of marketing professionals who can drive growth and build your brand in a digital-first world.',
        icon: <BarChart className="w-8 h-8" />,
        color: 'bg-rose-50 text-rose-600',
        borderColor: 'border-rose-200'
    },
    {
        id: 'temporary-recruitment',
        title: 'Temporary Recruitment',
        description: 'Flexible staffing solutions for seasonal demands, specialized projects, or short-term operational gaps.',
        icon: <Clock className="w-8 h-8" />,
        color: 'bg-indigo-50 text-indigo-600',
        borderColor: 'border-indigo-200'
    }
];

const Services = () => {
    const { hash } = useLocation();
    const [highlightedId, setHighlightedId] = useState(null);

    useEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            setHighlightedId(id);
            
            // Scroll to the element
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }

            // Remove highlight after 3 seconds
            const timer = setTimeout(() => {
                setHighlightedId(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [hash]);

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header Banner */}
            <div className="relative flex flex-col items-center justify-center min-h-[40vh] bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165833767-027ff8d99d8d?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <motion.div 
                    className="relative z-10 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
                        Our <span className="text-emerald-500">Excellence</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest mt-4 text-sm md:text-base">
                        Specialized Solutions for Every Human Capital Need
                    </p>
                    <div className="w-20 h-2 bg-emerald-500 mx-auto mt-8 rounded-full"></div>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            id={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative group p-8 bg-white rounded-[2.5rem] border-2 transition-all duration-500 ${
                                highlightedId === service.id 
                                ? `${service.borderColor} shadow-[0_0_40px_rgba(16,185,129,0.2)] ring-4 ring-emerald-500/10 scale-105 z-10` 
                                : 'border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-2'
                            }`}
                        >
                            {/* Highlight Pulse Effect */}
                            <AnimatePresence>
                                {highlightedId === service.id && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-emerald-500/5 rounded-[2.5rem] pointer-events-none"
                                    />
                                )}
                            </AnimatePresence>

                            <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                {service.icon}
                            </div>
                            
                            <h3 className={`text-2xl font-black mb-4 transition-colors ${highlightedId === service.id ? 'text-emerald-600' : 'text-slate-900'}`}>
                                {service.title}
                            </h3>
                            
                            <p className="text-slate-500 font-medium leading-relaxed mb-6">
                                {service.description}
                            </p>

                            <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Core Solution</span>
                            </div>

                            {/* Selection Indicator for Highlight */}
                            {highlightedId === service.id && (
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-3 -right-3 bg-emerald-500 text-white p-2 rounded-full shadow-lg"
                                >
                                    <CheckCircle2 className="w-6 h-6" />
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="max-w-4xl mx-auto px-4 text-center mt-12">
                <div className="p-12 bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500 opacity-20 rounded-full blur-[80px]"></div>
                    <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Need a Bespoke Solution?</h2>
                    <p className="text-slate-400 font-medium text-lg mb-8">
                        Our execution team can tailor our recruitment process to your specific organizational needs.
                    </p>
                    <a 
                        href="/contact" 
                        className="inline-flex px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20"
                    >
                        Schedule a Consult
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Services;
