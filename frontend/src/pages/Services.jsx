import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Users, Monitor, BarChart, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

const services = [
    {
        id: 'career-development',
        title: 'Career Development',
        shortDesc: 'Strategic career mapping and professional optimization.',
        description: 'Our Career Development program is designed to transform candidates into high-value professionals. We provide personalized roadmaps that align your skills with market demands, ensuring you don\'t just find a job, but build a career.',
        features: ['Resume & LinkedIn Optimization', 'Personal Branding Workshops', 'Interview Simulation & Coaching', 'Long-term Career Pathing'],
        icon: <GraduationCap className="w-8 h-8" />,
        color: 'bg-emerald-50 text-emerald-600',
        borderColor: 'border-emerald-200',
        accentColor: 'text-emerald-500'
    },
    {
        id: 'permanent-recruitment',
        title: 'Permanent Recruitment',
        shortDesc: 'Strategic hiring for long-term organizational growth.',
        description: 'We specialize in finding the "perfect fit" for permanent roles. Our deep-dive screening process evaluates not just technical competency, but cultural alignment, ensuring high retention rates and immediate impact for organizations.',
        features: ['Executive Search & Headhunting', 'Technical Competency Mapping', 'Cultural Alignment Assessment', 'Retention Strategy Consulting'],
        icon: <Users className="w-8 h-8" />,
        color: 'bg-blue-50 text-blue-600',
        borderColor: 'border-blue-200',
        accentColor: 'text-blue-500'
    },
    {
        id: 'campus-recruitment',
        title: 'Campus Recruitment',
        shortDesc: 'Connecting fresh talent with industry leaders.',
        description: 'Bridging the gap between academia and the corporate world. We partner with premier institutions to identify raw talent and facilitate seamless transitions into professional roles through structured campus drives.',
        features: ['University Relationship Management', 'Pre-placement Talk Orchestration', 'Aptitude & Technical Testing', 'On-campus Interview Logistics'],
        icon: <Briefcase className="w-8 h-8" />,
        color: 'bg-amber-50 text-amber-600',
        borderColor: 'border-amber-200',
        accentColor: 'text-amber-500'
    },
    {
        id: 'it-services',
        title: 'IT Services',
        shortDesc: 'Specialized staffing for the technology ecosystem.',
        description: 'From software architecture to cybersecurity, our IT services focus on placing highly skilled tech professionals in roles where they can drive innovation. We understand the nuances of modern tech stacks and agile methodologies.',
        features: ['Full-stack Developer Sourcing', 'Cloud & DevOps Specialists', 'Cybersecurity Expert Placement', 'Project-based Tech Staffing'],
        icon: <Monitor className="w-8 h-8" />,
        color: 'bg-purple-50 text-purple-600',
        borderColor: 'border-purple-200',
        accentColor: 'text-purple-500'
    },
    {
        id: 'marketing',
        title: 'Marketing',
        shortDesc: 'Finding growth drivers and brand builders.',
        description: 'In a digital-first world, your marketing team is your growth engine. We source professionals who blend creative thinking with data-driven strategy to build brands and scale customer acquisition across all channels.',
        features: ['Performance Marketing Leads', 'Brand Strategy Consultants', 'Content & Creative Directors', 'SEO & SEM Specialists'],
        icon: <BarChart className="w-8 h-8" />,
        color: 'bg-rose-50 text-rose-600',
        borderColor: 'border-rose-200',
        accentColor: 'text-rose-500'
    },
    {
        id: 'temporary-recruitment',
        title: 'Temporary Recruitment',
        shortDesc: 'Flexible staffing for dynamic business needs.',
        description: 'Agility is key to modern business. Our temporary recruitment services provide rapid access to skilled professionals for short-term projects, seasonal surges, or specialized tasks without the long-term overhead.',
        features: ['Contractual Talent Sourcing', 'Seasonal Peak Management', 'Replacement Staffing Solutions', 'Compliance & Payroll Handling'],
        icon: <Clock className="w-8 h-8" />,
        color: 'bg-indigo-50 text-indigo-600',
        borderColor: 'border-indigo-200',
        accentColor: 'text-indigo-500'
    }
];

const Services = () => {
    const { hash } = useLocation();
    const [activeTabId, setActiveTabId] = useState(services[0].id);

    useEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            const service = services.find(s => s.id === id);
            if (service) {
                setActiveTabId(id);
                // Smooth scroll to the tabs section
                const element = document.getElementById('services-tabs-container');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    }, [hash]);

    const activeService = services.find(s => s.id === activeTabId) || services[0];

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
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
                    {services.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => setActiveTabId(service.id)}
                            className={`group relative p-6 rounded-3xl transition-all duration-500 text-left overflow-hidden border-2 flex flex-col items-center justify-center text-center ${
                                activeTabId === service.id 
                                ? `${service.borderColor} bg-white shadow-2xl shadow-slate-200 ring-4 ring-emerald-500/5` 
                                : 'border-transparent bg-slate-100/50 hover:bg-white hover:border-slate-200'
                            }`}
                        >
                            <div className={`w-12 h-12 ${service.color} rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 ${activeTabId === service.id ? 'scale-110 rotate-3' : 'group-hover:scale-110'}`}>
                                {service.icon}
                            </div>
                            <h3 className={`text-[10px] md:text-xs font-black uppercase tracking-widest leading-tight ${activeTabId === service.id ? 'text-slate-900' : 'text-slate-400'}`}>
                                {service.title}
                            </h3>
                            
                            {/* Active Indicator Line */}
                            {activeTabId === service.id && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-500"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area - Expanded Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTabId}
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden min-h-[500px] flex flex-col lg:flex-row"
                    >
                        {/* Visual Section */}
                        <div className="lg:w-2/5 relative min-h-[300px] lg:min-h-auto">
                            <div className={`absolute inset-0 ${activeService.color} opacity-10`}></div>
                            <div className="absolute inset-0 flex items-center justify-center p-12">
                                <motion.div 
                                    initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                                    className={`w-48 h-48 md:w-64 md:h-64 rounded-[3rem] ${activeService.color} flex items-center justify-center shadow-inner`}
                                >
                                    {React.cloneElement(activeService.icon, { className: "w-24 h-24 md:w-32 md:h-32" })}
                                </motion.div>
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute top-8 left-8">
                                <div className={`w-3 h-3 rounded-full ${activeService.accentColor} animate-pulse`}></div>
                            </div>
                        </div>

                        {/* Text Section */}
                        <div className="lg:w-3/5 p-8 md:p-16 flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-6">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${activeService.color}`}>
                                    Core Expertise
                                </span>
                                <div className="h-px flex-grow bg-slate-100"></div>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-none">
                                {activeService.title}
                            </h2>

                            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-10">
                                {activeService.description}
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 mb-12">
                                {activeService.features.map((feature, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + (i * 0.1) }}
                                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-emerald-200 transition-colors"
                                    >
                                        <CheckCircle2 className={`w-5 h-5 ${activeService.accentColor} flex-shrink-0`} />
                                        <span className="text-slate-800 font-bold text-sm">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => window.location.href = '/contact'}
                                className={`inline-flex items-center justify-between px-8 py-5 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest group shadow-xl hover:shadow-2xl transition-all`}
                            >
                                <span>Get Started with {activeService.title}</span>
                                <ChevronRight className="w-6 h-6 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom CTA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-12 bg-slate-900 rounded-[4rem] border border-slate-800 shadow-2xl relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
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
