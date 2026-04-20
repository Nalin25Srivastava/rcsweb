import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRegisteredStudents, reset } from '../store/slices/registeredStudentsSlice';
import { Users, GraduationCap, Calendar, CheckCircle2, Search } from 'lucide-react';

const RegisteredStudents = () => {
    const dispatch = useDispatch();
    const { registeredStudents, isLoading, isError, message } = useSelector((state) => state.registeredStudents);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchRegisteredStudents());
        return () => dispatch(reset());
    }, [dispatch]);

    const filteredStudents = registeredStudents.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getImageUrl = (image) => {
        if (!image) return 'https://images.unsplash.com/photo-1594673752579-40993cf394c5?fit=crop&q=80&w=400';
        if (image.startsWith('http') || image.startsWith('/uploads') || image.startsWith('data:')) return image;
        return `/images/${image}`;
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header Banner */}
            <div className="relative bg-slate-900 py-24 px-4 overflow-hidden flex flex-col items-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050853064-dbad323b7ff3?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-slate-900/60"></div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 text-center max-w-3xl mx-auto"
                >
                    <div className="inline-block px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full font-black uppercase tracking-widest text-sm mb-6 backdrop-blur-sm border border-emerald-500/30">
                        Our Community
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 drop-shadow-2xl">
                        Registered <span className="text-emerald-400">Students</span>
                    </h1>
                    <p className="text-slate-100 text-lg md:text-xl font-bold leading-relaxed drop-shadow-lg">
                        Meet the ambitious individuals currently advancing their careers through our specialized training programs.
                    </p>
                </motion.div>
            </div>

            {/* Search and Filters */}
            <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name or course..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl font-bold text-slate-900 transition-all outline-none"
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
                            <Users className="w-5 h-5" />
                            {filteredStudents.length} Students
                        </div>
                    </div>
                </div>
            </div>

            {/* Students Grid */}
            <div className="max-w-7xl mx-auto px-4 mt-16">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 border-t-transparent shadow-emerald-500/50 shadow-lg"></div>
                        <p className="mt-6 text-slate-500 font-black uppercase tracking-widest">Gathering talent...</p>
                    </div>
                ) : isError ? (
                    <div className="text-center py-20">
                        <div className="bg-red-50 text-red-600 px-8 py-6 rounded-3xl inline-block font-bold border border-red-100 shadow-sm">
                            Error: {message}
                        </div>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-black text-slate-900">No students found</h3>
                        <p className="text-slate-500 font-bold">Try adjusting your search criteria.</p>
                    </div>
                ) : (
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
                        {filteredStudents.map((student, index) => (
                            <motion.div 
                                key={student._id}
                                className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 group relative overflow-hidden flex flex-col"
                                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                                whileHover={{ y: -8 }}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100%] transition-transform duration-500 group-hover:scale-150 -z-10"></div>
                                
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                                        <img 
                                            src={getImageUrl(student.image)} 
                                            alt={student.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-emerald-600 transition-colors">
                                            {student.name}
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Verified Enrollment</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 flex-grow">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                                        <GraduationCap className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                                        <span className="text-sm font-bold text-slate-700">{student.course}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                                        <Calendar className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                                        <span className="text-sm font-bold text-slate-700">Batch: {student.batch}</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        student.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                        {student.status}
                                    </span>
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                        Since {new Date(student.registrationDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RegisteredStudents;
