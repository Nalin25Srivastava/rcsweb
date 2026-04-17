import { useState, useEffect } from 'react';
import { Download, Send, CheckCircle2, AlertCircle, MapPin, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { submitContact, reset } from '../store/slices/contactsSlice';

const Contact = () => {
    const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', subject: '', message: '' });
    const [formError, setFormError] = useState('');
    const [lastSubmitted, setLastSubmitted] = useState(null);
    const dispatch = useDispatch();
    const { isLoading, isSuccess, isError, message } = useSelector((state) => state.contacts);

    useEffect(() => {
        if (isSuccess) setFormData({ fullName: '', phone: '', email: '', subject: '', message: '' });
        const timer = setTimeout(() => {
            if (isSuccess || isError) dispatch(reset());
        }, 5000);
        return () => clearTimeout(timer);
    }, [isSuccess, isError, dispatch]);

    const handleInputChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
        if (formError) setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (lastSubmitted && JSON.stringify(formData) === JSON.stringify(lastSubmitted)) {
            setFormError('You have already submitted these details.');
            return;
        }
        const values = Object.values(formData).map(val => val.trim().toLowerCase()).filter(val => val !== '');
        if (new Set(values).size !== values.length) {
            setFormError('Fields cannot contain the exact same details.');
            return;
        }
        setLastSubmitted(formData);
        dispatch(submitContact(formData));
    };

    const handleDownload = () => window.open('/api/contacts/download', '_blank');

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="relative bg-slate-900 py-32 px-4 overflow-hidden flex flex-col items-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 text-center max-w-3xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
                        Let's Talk <span className="text-emerald-400">Business.</span>
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed mb-8">
                        Whether you are an enterprise looking for talent, or a candidate seeking your next big leap, our execution team is ready.
                    </p>
                    <motion.button 
                        onClick={handleDownload}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex flex-col sm:flex-row items-center gap-3 bg-white/10 hover:bg-emerald-500 text-white font-bold backdrop-blur-md px-8 py-4 rounded-full transition-all border border-white/20 uppercase tracking-widest text-sm"
                    >
                        <Download className="w-5 h-5" /> Download Contact Data
                    </motion.button>
                </motion.div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-3 gap-16">
                    
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-12">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Support Network</h2>
                            <div className="space-y-8">
                                <motion.div whileHover={{ x: 10 }} className="flex gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors flex-shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">Headquarters</h3>
                                        <p className="text-slate-500 font-medium whitespace-pre-line">Building No. 645, Behind Allahabad Bank,<br/>In front of Gumanpura Thana, Aerodrome Circle,<br/>Kota, Rajasthan - 324001</p>
                                    </div>
                                </motion.div>

                                <motion.div whileHover={{ x: 10 }} className="flex gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors flex-shrink-0">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">Call Center</h3>
                                        <p className="text-slate-500 font-medium">+91 800 123 4567<br/>Mon-Fri, 9am to 6pm IST</p>
                                    </div>
                                </motion.div>

                                <motion.div whileHover={{ x: 10 }} className="flex gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors flex-shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">Email Connect</h3>
                                        <p className="text-slate-500 font-medium">contact@rcsweb.com<br/>careers@rcsweb.com</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-900 rounded-3xl relative overflow-hidden border border-slate-800 shadow-2xl">
                            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-500 opacity-20 rounded-full blur-2xl"></div>
                            <h3 className="text-white font-black text-xl mb-3">Enterprise Dedicated?</h3>
                            <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6">
                                Connect directly with our enterprise lead management team for bulk hiring.
                            </p>
                            <a href="mailto:enterprise@rcsweb.com" className="text-emerald-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:text-white transition-colors">
                                enterprise@rcsweb.com <span className="text-lg">→</span>
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
                            
                            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Send a <span className="text-emerald-500">Message</span></h2>

                            <AnimatePresence>
                                {(isSuccess || isError || formError) && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        className={`px-6 py-4 rounded-xl flex items-center gap-4 ${isSuccess && !formError ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}
                                    >
                                        {isSuccess && !formError ? <CheckCircle2 className="w-6 h-6 flex-shrink-0" /> : <AlertCircle className="w-6 h-6 flex-shrink-0" />}
                                        <p className="font-bold">{formError || message || (isSuccess ? 'Message sent successfully!' : 'Something went wrong.')}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange(e, 'fullName')}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-4 px-5 outline-none transition-all text-slate-900 font-bold shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange(e, 'phone')}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-4 px-5 outline-none transition-all text-slate-900 font-bold shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange(e, 'email')}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-4 px-5 outline-none transition-all text-slate-900 font-bold shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={(e) => handleInputChange(e, 'subject')}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-4 px-5 outline-none transition-all text-slate-900 font-bold shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={(e) => handleInputChange(e, 'message')}
                                        required
                                        rows="4"
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-4 px-5 outline-none transition-all text-slate-900 font-bold shadow-sm resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full bg-slate-900 hover:bg-emerald-500 text-white font-black py-5 rounded-xl text-lg shadow-xl shadow-slate-200 transition-all cursor-pointer uppercase flex items-center justify-center gap-3 tracking-widest ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Transmitting...' : 'Submit Message'} 
                                <Send className={`w-6 h-6 ${isLoading ? 'animate-bounce' : ''}`} />
                            </motion.button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
