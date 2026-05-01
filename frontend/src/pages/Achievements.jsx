import React from 'react';
import { Trophy, Users, Building, Target, Award, Star, TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Achievements = () => {
    const stats = [
        { icon: <Users className="w-8 h-8" />, label: 'Students Placed', value: '15,000+', color: 'bg-blue-500' },
        { icon: <Building className="w-8 h-8" />, label: 'Corporate Partners', value: '850+', color: 'bg-emerald-500' },
        { icon: <Trophy className="w-8 h-8" />, label: 'Years of Excellence', value: '12+', color: 'bg-amber-500' },
        { icon: <Target className="w-8 h-8" />, label: 'Selection Rate', value: '94%', color: 'bg-indigo-500' },
    ];

    const milestones = [
        {
            year: '2024',
            title: 'National Excellence Award',
            description: 'Recognized as the most reliable recruitment partner in North India by the Industry Council.',
            icon: <Award className="w-6 h-6 text-amber-500" />
        },
        {
            year: '2023',
            title: '10,000 Placements Milestone',
            description: 'Successfully crossed the mark of 10,000 career placements in various sectors.',
            icon: <Star className="w-6 h-6 text-blue-500" />
        },
        {
            year: '2021',
            title: 'Expansion to PAN India',
            description: 'Established operational networks across 15+ states to better serve our corporate clients.',
            icon: <TrendingUp className="w-6 h-6 text-emerald-500" />
        },
        {
            year: '2012',
            title: 'Foundation of RCS',
            description: 'RCS Placement Kota was founded with a mission to bridge the gap between talent and opportunity.',
            icon: <CheckCircle2 className="w-6 h-6 text-indigo-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 mb-4 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700 text-sm font-black uppercase tracking-widest"
                    >
                        Our Journey of Success
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tight"
                    >
                        Milestones & <span className="text-emerald-500">Achievements</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600 max-w-2xl mx-auto font-bold"
                    >
                        At RCS Placement Kota, our success is measured by the thousands of careers we've helped shape and the enduring partnerships we've built.
                    </motion.p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center group hover:border-emerald-500 transition-all duration-500"
                        >
                            <div className={`${stat.color} p-4 rounded-2xl text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{stat.value}</h3>
                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Timeline Section */}
                <div className="relative">
                    <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-slate-200 hidden md:block"></div>
                    
                    <div className="space-y-12">
                        {milestones.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >
                                <div className="flex-1 text-center md:text-right">
                                    <div className={`bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-transparent hover:border-emerald-500 transition-all duration-500 group ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <div className={`inline-flex items-center justify-center p-3 bg-slate-50 rounded-2xl mb-4 group-hover:bg-emerald-50 transition-colors`}>
                                            {item.icon}
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{item.title}</h3>
                                        <p className="text-slate-600 font-bold leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                                
                                <div className="z-10 w-16 h-16 bg-emerald-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white font-black text-lg">
                                    {item.year}
                                </div>
                                
                                <div className="flex-1 hidden md:block"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-32 bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tight">Ready to be our next <span className="text-emerald-400 text-5xl italic block mt-2">Success Story?</span></h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto font-bold">Join thousands of successful candidates who have found their dream careers through RCS.</p>
                        <a 
                            href="/postres" 
                            className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 px-12 rounded-2xl text-lg transition-all shadow-2xl hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest"
                        >
                            Register Today <ArrowRight className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ArrowRight = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

export default Achievements;
