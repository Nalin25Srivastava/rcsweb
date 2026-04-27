import React from 'react';
import { motion } from 'framer-motion';
import { IoCheckmarkCircle } from 'react-icons/io5';

const About = () => {
    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            {/* Header Banner */}
            <div className="relative flex flex-col items-center justify-center min-h-[50vh] bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <motion.div 
                    className="relative z-10 text-center uppercase"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mt-4 tracking-tighter">
                        About <span className="text-emerald-500">RCS</span>
                    </h1>
                    <div className="w-24 h-2 bg-emerald-500 mx-auto mt-6 rounded-full self-center"></div>
                </motion.div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-sm font-black text-emerald-500 uppercase tracking-widest mb-3">Our Core Philosophy</h2>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight mb-6">
                            Redefining the <br />Recruitment Process.
                        </h3>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-6">
                            Recruitment & Consulting Services (RCS) is a premiere professional services firm focused exclusively on creating powerful synergies between top-tier talent and industry-leading organizations.
                        </p>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            With over a decade of excellence in the staffing sector, we've developed proprietary methodologies for screening, mapping, and placing candidates globally. We don't just fill vacancies—we build high-performing teams infrastructure.
                        </p>

                        <div className="mt-8 space-y-4">
                            {[
                                "Proprietary Competency Mapping Algorithms",
                                "Exclusive Network of Unlisted Positions",
                                "Guaranteed 98% Candidate Retention Rate"
                            ].map((item, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-bold bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"
                                >
                                    <IoCheckmarkCircle className="text-emerald-500 w-6 h-6 flex-shrink-0" />
                                    <span>{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="absolute inset-0 bg-emerald-500 rounded-3xl blur-3xl opacity-20 transform rotate-3"></div>
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-2xl relative border border-white dark:border-slate-800">
                            <img 
                                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1000" 
                                alt="RCS Team Culture" 
                                className="rounded-2xl"
                            />
                            
                            <div className="absolute -bottom-8 -left-8 bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
                                <div className="text-5xl font-black text-emerald-400 mb-1">10+</div>
                                <div className="text-sm font-bold uppercase tracking-widest text-slate-300">Years of<br/>Excellence</div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Mission & Vision */}
            <div className="bg-slate-900 py-24 px-4 sm:px-6 lg:px-8 mt-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 text-center md:text-left">
                    <motion.div 
                        className="bg-slate-800/50 backdrop-blur-md p-10 rounded-3xl border border-slate-700 hover:border-emerald-500/50 transition-colors"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4">Our Mission</h3>
                        <p className="text-slate-300 font-medium leading-relaxed">
                            To empower enterprises by delivering unparalleled human capital solutions, and to transform candidate careers by unlocking access to premium organizational environments.
                        </p>
                    </motion.div>

                    <motion.div 
                        className="bg-slate-800/50 backdrop-blur-md p-10 rounded-3xl border border-slate-700 hover:border-blue-500/50 transition-colors"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4">Our Vision</h3>
                        <p className="text-slate-300 font-medium leading-relaxed">
                            To be the global benchmark in recruiting ecosystems where technology, psychology, and organizational strategy converge to create perfect professional alignments.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
