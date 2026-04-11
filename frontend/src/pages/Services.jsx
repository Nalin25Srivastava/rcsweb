import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices, reset } from '../store/slices/servicesSlice';

const Services = () => {
    const [selectedService, setSelectedService] = useState(null);
    const dispatch = useDispatch();
    const { services, isLoading, isError, message } = useSelector((state) => state.services);

    useEffect(() => {
        dispatch(fetchServices());
        return () => dispatch(reset());
    }, [dispatch]);

    // Close modal on ESC key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedService(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header Banner */}
            <div className="relative flex flex-col items-center justify-center min-h-[40vh] bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div>
                
                <motion.div 
                    className="relative z-10 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full font-black uppercase tracking-widest text-sm mb-4 backdrop-blur-sm border border-emerald-500/30">
                        What We Do
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mt-2 tracking-tighter mix-blend-hard-light text-white">
                        Premium <span className="text-emerald-400">Services</span>
                    </h1>
                </motion.div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-20">
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                >
                    {isLoading ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 border-t-transparent shadow-emerald-500/50 shadow-lg"></div>
                            <p className="mt-6 text-slate-500 font-black uppercase tracking-widest">Loading solutions...</p>
                        </div>
                    ) : isError ? (
                        <div className="col-span-full text-center py-20">
                            <div className="bg-red-50 text-red-600 px-8 py-6 rounded-3xl inline-block font-bold border border-red-100 shadow-sm">
                                Error connecting to services: {message}
                            </div>
                        </div>
                    ) : (
                        services.map((service, index) => (
                            <motion.div 
                                key={index} 
                                className="bg-white rounded-[2rem] p-8 flex flex-col shadow-xl shadow-slate-200/50 border border-slate-100 group relative overflow-hidden h-[400px]"
                                variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                                whileHover={{ y: -8 }}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100%] transition-transform duration-500 group-hover:scale-150 -z-10"></div>
                                
                                <div className="flex-grow z-10">
                                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:bg-emerald-500 transition-colors">
                                        <span className="font-black font-mono">0{index + 1}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-emerald-600 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-slate-500 font-medium line-clamp-4 leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>

                                <motion.button 
                                    onClick={() => setSelectedService(service)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mt-6 w-full bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white font-black py-4 rounded-xl transition duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-widest border border-slate-200 z-10"
                                >
                                    Explore Details <span className="text-lg leading-none">→</span>
                                </motion.button>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </div>

            {/* Modal Detail View */}
            <AnimatePresence>
                {selectedService && (
                    <motion.div 
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedService(null)}
                    >
                        <motion.div 
                            className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-3xl w-full relative shadow-2xl overflow-hidden border border-white"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-400 to-blue-500"></div>

                            <motion.button 
                                onClick={() => setSelectedService(null)}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute top-8 right-8 p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-slate-500 hover:text-slate-800"
                            >
                                <X className="w-5 h-5 font-bold" />
                            </motion.button>
                            
                            <div className="pt-4 pr-12">
                                <span className="text-emerald-500 font-black uppercase tracking-widest text-xs mb-2 block">Service Detail</span>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
                                    {selectedService.title}
                                </h2>
                                <div className="text-slate-600 font-medium leading-relaxed overflow-y-auto max-h-[50vh] pr-4 space-y-4 custom-scrollbar text-lg">
                                    <p className="whitespace-pre-line">{selectedService.description}</p>
                                </div>
                            </div>

                            <div className="mt-12 flex justify-between items-center border-t border-slate-100 pt-8">
                                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest flex-[2]">
                                    Contact our consulting team for custom deployments.
                                </p>
                                <motion.button 
                                    onClick={() => setSelectedService(null)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black uppercase text-sm tracking-widest hover:bg-emerald-500 transition-colors cursor-pointer shadow-lg flex-1 text-center"
                                >
                                    Got it
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Services;
