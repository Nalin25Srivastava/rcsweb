import { useState, useEffect } from 'react';
import { Download, Send, CheckCircle2, AlertCircle, MapPin, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { submitContact, reset } from '../store/slices/contactsSlice';
import SmartButton from '../components/SmartButton';

const Contact = () => {
    const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', subject: '', message: '' });
    const [formError, setFormError] = useState('');
    const [lastSubmitted, setLastSubmitted] = useState(null);
    const dispatch = useDispatch();
    const { isLoading, isSuccess, isError, message } = useSelector((state) => state.contacts);

    useEffect(() => {
        if (isSuccess) {
            // Trigger WhatsApp redirect
            const waMessage = `*New Contact Enquiry - RCS*\n\n*Name:* ${formData.fullName}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email}\n*Subject:* ${formData.subject}\n\n*Message:* ${formData.message}`;
            const encodedMsg = encodeURIComponent(waMessage);
            const waUrl = `https://wa.me/919783945080?text=${encodedMsg}`;
            
            // Small delay to let user see success message before redirect
            setTimeout(() => {
                window.open(waUrl, '_blank');
            }, 1000);

            setFormData({ fullName: '', phone: '', email: '', subject: '', message: '' });
        }
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
        if (e) e.preventDefault();
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

    const isFormIncomplete = !formData.fullName || !formData.phone || !formData.email || !formData.subject || !formData.message;
    const getDisabledReason = () => {
        if (isFormIncomplete) return "Contact form incomplete";
        return "";
    };
    const getCorrectionStep = () => {
        if (isFormIncomplete) return "Please fill in all fields (Name, Phone, Email, Subject, and Message) before submitting.";
        return "";
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
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
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Support Network</h2>
                            <div className="space-y-8">
                                <motion.div whileHover={{ x: 10 }} className="flex gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors flex-shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Headquarters</h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium whitespace-pre-line text-sm">Building No. 645, Behind Allahabad Bank,<br/>In front of Gumanpura Thana, Aerodrome Circle,<br/>Kota, Rajasthan - 324001</p>
                                    </div>
                                </motion.div>

                                <motion.div whileHover={{ x: 10 }} className="flex gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors flex-shrink-0">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Call Center</h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                                            +91 8104083002, +91 9783945080,<br/>
                                            +91 8209635081<br/>
                                            Mon-Sat, 10am to 5pm IST
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div whileHover={{ x: 10 }} className="flex gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors flex-shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Email Connect</h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                                            r.c.sindiaconcept@gmail.com
                                        </p>
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
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                            
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Send a <span className="text-emerald-500">Message</span></h2>

                            <AnimatePresence>
                                {(isSuccess || isError || formError) && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        className={`px-6 py-4 rounded-xl flex items-center gap-4 ${isSuccess && !formError ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${isSuccess && !formError ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                            {isSuccess && !formError ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{formError || message}</span>
                                            {isSuccess && <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Redirecting to WhatsApp...</span>}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange(e, 'fullName')}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-700 rounded-xl py-4 px-5 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange(e, 'phone')}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-700 rounded-xl py-4 px-5 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange(e, 'email')}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-700 rounded-xl py-4 px-5 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={(e) => handleInputChange(e, 'subject')}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-700 rounded-xl py-4 px-5 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Your Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={(e) => handleInputChange(e, 'message')}
                                        required
                                        rows="4"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-700 rounded-xl py-4 px-5 outline-none transition-all text-slate-900 dark:text-white font-bold shadow-sm resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <SmartButton
                                type="submit"
                                disabled={isLoading || isFormIncomplete}
                                isLoading={isLoading}
                                disabledReason={getDisabledReason()}
                                howToCorrect={getCorrectionStep()}
                                onClick={handleSubmit}
                                className={`w-full bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl text-lg shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 cursor-pointer uppercase flex items-center justify-center gap-4 tracking-[0.2em] group overflow-hidden ${isLoading || isSuccess ? 'pointer-events-none' : ''}`}
                            >
                                <AnimatePresence mode="wait">
                                    {isSuccess ? (
                                        <motion.div 
                                            key="success"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="flex items-center gap-3 text-emerald-400"
                                        >
                                            <CheckCircle2 className="w-7 h-7" />
                                            <span>Message Sent</span>
                                        </motion.div>
                                    ) : isLoading ? (
                                        <motion.div 
                                            key="loading"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            <span>Transmitting</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="default"
                                            initial={{ y: -20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="flex items-center gap-3"
                                        >
                                            <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            <span>Submit Message</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                {/* Hover Shine Effect */}
                                <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-[200%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                            </SmartButton>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
