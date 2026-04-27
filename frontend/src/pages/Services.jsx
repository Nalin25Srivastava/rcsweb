import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Users, Monitor, BarChart, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { fetchServices, reset as resetServices } from '../store/slices/servicesSlice';

const getIcon = (iconName) => {
    const iconProps = { className: "w-full h-full" };
    switch (iconName) {
        case 'GraduationCap': return <GraduationCap {...iconProps} />;
        case 'Users': return <Users {...iconProps} />;
        case 'Briefcase': return <Briefcase {...iconProps} />;
        case 'Monitor': return <Monitor {...iconProps} />;
        case 'BarChart': return <BarChart {...iconProps} />;
        case 'Clock': return <Clock {...iconProps} />;
        default: return <Briefcase {...iconProps} />;
    }
};

const Services = () => {
    const dispatch = useDispatch();
    const { hash } = useLocation();
    const { services, isLoading, isError, message } = useSelector((state) => state.services);
    const [activeTabId, setActiveTabId] = useState(null);

    useEffect(() => {
        dispatch(fetchServices());
        return () => dispatch(resetServices());
    }, [dispatch]);

    useEffect(() => {
        if (services.length > 0) {
            if (hash) {
                const id = hash.replace('#', '');
                const service = services.find(s => s.id === id);
                if (service) {
                    setActiveTabId(id);
                    const element = document.getElementById('services-tabs-container');
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                } else {
                    setActiveTabId(services[0].id);
                }
            } else if (!activeTabId) {
                setActiveTabId(services[0].id);
            }
        }
    }, [hash, services]);

    const activeService = services.find(s => s.id === activeTabId) || (services.length > 0 ? services[0] : null);

    if (isLoading && services.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 dark:bg-slate-950 text-white transition-colors duration-300">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="font-black uppercase tracking-[0.4em] text-sm animate-pulse">Initializing Excellence</p>
                </div>
            </div>
        );
    }

    if (isError && services.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300">
                <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-red-100 dark:border-red-900/20 text-center max-w-lg">
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Monitor className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Connection Failed</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">{message}</p>
                    <button onClick={() => dispatch(fetchServices())} className="px-8 py-4 bg-slate-900 dark:bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl">Retry Connection</button>
                </div>
            </div>
        );
    }

    if (!activeService) return null;

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 transition-colors duration-300">
            {/* Header Banner */}
            <div className="relative flex flex-col items-center justify-center min-h-[40vh] bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165833767-027ff8d99d8d?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <motion.div 
                    className="relative z-10 text-center px-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
                        Our <span className="text-emerald-500">Excellence</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] mt-4 text-xs md:text-sm">
                        Strategic Human Capital Solutions
                    </p>
                    <div className="w-20 h-1.5 bg-emerald-500 mx-auto mt-8 rounded-full"></div>
                </motion.div>
            </div>

            {/* Tabs Section */}
            <div id="services-tabs-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                    {services.map((service) => {
                        const isActive = activeTabId === service.id;
                        return (
                            <button
                                key={service.id}
                                onClick={() => setActiveTabId(service.id)}
                                className={`group relative p-6 rounded-3xl transition-all duration-500 text-left overflow-hidden border-2 flex flex-col items-center justify-center text-center ${
                                    isActive 
                                    ? `${service.borderColor} bg-white dark:bg-slate-800 shadow-2xl shadow-slate-200 dark:shadow-none ring-4 ring-emerald-500/5` 
                                    : 'border-transparent bg-slate-100/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                                }`}
                            >
                                <div className={`w-12 h-12 ${service.color} rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 ${isActive ? 'scale-110 rotate-3' : 'group-hover:scale-110'}`}>
                                    {getIcon(service.iconName)}
                                </div>
                                <h3 className={`text-[10px] md:text-xs font-black uppercase tracking-widest leading-tight ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {service.title}
                                </h3>
                                
                                {/* Active Indicator Line */}
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-500"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area - Expanded Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTabId}
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[500px] flex flex-col lg:flex-row"
                    >
                        {/* Visual Section */}
                        <div className="lg:w-2/5 relative min-h-[300px] lg:min-h-auto bg-slate-50 dark:bg-slate-950/50">
                            <div className={`absolute inset-0 ${activeService.color} opacity-10`}></div>
                            <div className="absolute inset-0 flex items-center justify-center p-12">
                                <motion.div 
                                    initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                                    className={`w-48 h-48 md:w-64 md:h-64 rounded-[3rem] ${activeService.color} flex items-center justify-center shadow-inner`}
                                >
                                    {getIcon(activeService.iconName)}
                                </motion.div>
                            </div>
                        </div>

                        {/* Text Section */}
                        <div className="lg:w-3/5 p-8 md:p-16 flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-6">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${activeService.color}`}>
                                    Core Expertise
                                </span>
                                <div className="h-px flex-grow bg-slate-100 dark:bg-slate-800"></div>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-none">
                                {activeService.title}
                            </h2>

                            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-10">
                                {activeService.description}
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 mb-12">
                                {activeService.features.map((feature, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + (i * 0.1) }}
                                        className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:bg-white dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <CheckCircle2 className={`w-5 h-5 ${activeService.accentColor} flex-shrink-0`} />
                                        <span className="text-slate-800 dark:text-slate-200 font-bold text-sm">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => window.location.href = '/contact'}
                                className={`inline-flex items-center justify-between px-8 py-5 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white font-black uppercase tracking-widest group shadow-xl hover:shadow-2xl transition-all`}
                            >
                                <span>Get Started with {activeService.title}</span>
                                <ChevronRight className="w-6 h-6 text-emerald-400 dark:text-white group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom CTA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-12 bg-slate-900 dark:bg-slate-800 rounded-[4rem] border border-slate-800 dark:border-slate-700 shadow-2xl relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500 opacity-10 rounded-full blur-[100px]"></div>
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Not sure which service fits?</h2>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed">
                            Our advisors are ready to analyze your current organizational state and recommend the perfect hiring or career strategy.
                        </p>
                    </div>
                    <a 
                        href="/contact" 
                        className="relative z-10 shrink-0 px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                    >
                        Schedule Discovery Call
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Services;
