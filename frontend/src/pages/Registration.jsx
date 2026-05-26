import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, CheckCircle, AlertCircle, LoaderCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitResume, resetResumeState } from '../store/slices/resumesSlice';
import { setPaid, verifyRegistrationPayment } from '../store/slices/authSlice';
import SmartButton from '../components/SmartButton';

const Registration = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, isError, message } = useSelector((state) => state.resumes);
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState(() => {
        const nameParts = user?.name ? user.name.split(' ') : ['', ''];
        return {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user?.email || '',
            phone: '',
            functionalArea: '',
        };
    });
    const [file, setFile] = useState(null);
    const [receiptFile, setReceiptFile] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(null); // 'processing' | 'success' | null
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=postres');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (isError) {
            const timer = setTimeout(() => {
                dispatch(resetResumeState());
                setPaymentStatus(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isError, dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleReceiptChange = (e) => {
        setReceiptFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        if (!file) {
            alert('Please select your Agency Profile/Document');
            return;
        }

        if (!receiptFile) {
            alert('Please upload your payment receipt/screenshot.');
            return;
        }

        if (!transactionId.trim()) {
            alert('Please enter your PhonePe Transaction ID.');
            return;
        }

        try {
            setIsVerifying(true);
            
            // Pack form data
            const data = new FormData();
            data.append('firstName', formData.firstName);
            data.append('lastName', formData.lastName);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('functionalArea', formData.functionalArea);
            data.append('resume', file);
            data.append('paymentReceipt', receiptFile);
            data.append('transactionId', transactionId);
            data.append('amount', 1000);

            // 1. Dispatch form to backend which creates a Pending Verification resume
            await dispatch(submitResume(data)).unwrap();

            setPaymentStatus('success');
            
            // Clear form for future use
            setFormData({
                firstName: '', lastName: '', email: '', 
                phone: '', functionalArea: ''
            });
            setFile(null);
            setReceiptFile(null);
            setTransactionId('');
            
            // Reset redux state after a delay
            setTimeout(() => {
                dispatch(resetResumeState());
                setPaymentStatus(null);
                setIsVerifying(false);
                navigate('/');
            }, 4000);

        } catch (error) {
            console.error('Submit Error:', error);
            setIsVerifying(false);
            alert('An error occurred during submission: ' + (error.message || error || 'Please try again.'));
        }
    };

    const isFormIncomplete = !formData.phone || !formData.functionalArea || !file || !receiptFile || !transactionId;
    const getDisabledReason = () => {
        if (!formData.phone || !formData.functionalArea) return "Form fields are missing";
        if (!file) return "Profile/Document not uploaded";
        if (!receiptFile || !transactionId) return "Payment details missing";
        return "";
    };
    const getCorrectionStep = () => {
        if (!formData.phone || !formData.functionalArea) return "Please fill in your phone number and select a primary domain.";
        if (!file) return "Click the upload area to select your agency profile or resume.";
        if (!receiptFile || !transactionId) return "Please complete the payment, enter the Transaction ID, and upload the receipt screenshot.";
        return "";
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors duration-300">
            
            <div className="max-w-6xl w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col lg:flex-row border border-slate-100 dark:border-slate-800">
                
                {/* Left Side: Info & Branding */}
                <div className="lg:w-5/12 bg-slate-900 p-12 text-white flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
                    
                    <div className="relative z-10 flex-grow drop-shadow-md">
                        <div className="inline-block px-4 py-2 bg-blue-600/20 text-blue-500 rounded-full font-black uppercase tracking-widest text-xs mb-8 border border-blue-600/30">
                            Partner Network
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight leading-tight">
                            Candidate <span className="text-blue-500">Registration</span>
                        </h2>
                        <p className="text-slate-300 dark:text-slate-400 font-medium text-lg leading-relaxed mb-10">
                            Complete your registration to unlock premium hiring tools, enterprise client access, and 24/7 dedicated placement support.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Global Network", desc: "Access unlisted corporate requisitions." },
                                { title: "Secure Verification", desc: "Enterprise-grade real-time payment verification." },
                                { title: "Dedicated Support", desc: "24/7 technical and placement assistance." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                                        <CheckCircle className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white tracking-wide">{item.title}</h3>
                                        <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:w-7/12 p-8 md:p-12 bg-white relative">
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        
                        <AnimatePresence>
                            {(isError) && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 rounded-2xl flex items-center gap-3 border bg-red-50 text-red-700 border-red-100"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-bold text-sm tracking-wide">{message || 'Error occurred'}</span>
                                </motion.div>
                            )}
                            
                            {(paymentStatus === 'success' || isVerifying) && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`p-6 rounded-2xl flex items-center gap-4 border shadow-lg ${paymentStatus === 'success' ? 'bg-blue-50 text-blue-800 border-blue-300' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
                                >
                                    {paymentStatus === 'success' ? (
                                        <CheckCircle className="w-8 h-8 text-blue-600 flex-shrink-0" />
                                    ) : (
                                        <LoaderCircle className="w-8 h-8 text-blue-500 animate-spin flex-shrink-0" />
                                    )}
                                    <div>
                                        <h4 className={`font-black text-lg ${paymentStatus === 'success' ? 'text-blue-950' : 'text-blue-900'}`}>
                                            {paymentStatus === 'success' ? 'Registration Successful' : 'Verifying Payment...'}
                                        </h4>
                                        <p className={`font-medium mt-1 ${paymentStatus === 'success' ? 'text-blue-800' : 'text-blue-700'}`}>
                                            {paymentStatus === 'success' 
                                                ? 'Your submission is successful and pending manual verification. Redirecting...' 
                                                : 'Please wait while we submit your registration details...'}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className={`transition-opacity duration-500 ${paymentStatus === 'success' || isVerifying ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        readOnly
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl py-3 px-4 outline-none transition-all text-slate-500 dark:text-slate-400 font-bold cursor-not-allowed"
                                        title="Fetched from account"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        readOnly
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl py-3 px-4 outline-none transition-all text-slate-500 dark:text-slate-400 font-bold cursor-not-allowed"
                                        title="Fetched from account"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        readOnly
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl py-3 px-4 outline-none transition-all text-slate-500 dark:text-slate-400 font-bold cursor-not-allowed"
                                        title="Fetched from account"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-600 dark:bg-slate-800 rounded-xl py-3 px-4 outline-none transition-all text-slate-900 dark:text-white font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Primary Domain</label>
                                    <select 
                                        name="functionalArea"
                                        value={formData.functionalArea}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-600 rounded-xl py-3 px-4 outline-none transition-all text-slate-900 dark:text-white font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>-Select Domain-</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Human Resources">Human Resources</option>
                                        <option value="Sales & Marketing">Sales & Marketing</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Operations">Operations</option>
                                        <option value="BPO / KPO">BPO / KPO</option>
                                    </select>
                                </div>
                            </div>

                            {/* File Upload */}
                            <div className="space-y-2 mt-6">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Profile / Resume Document</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.txt,.rtf"
                                        id="file-upload"
                                        className="hidden"
                                    />
                                    <label 
                                        htmlFor="file-upload"
                                        className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl py-8 px-6 cursor-pointer hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/5 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-slate-400 dark:text-slate-300 group-hover:text-blue-600 group-hover:scale-110 transition-all">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white text-sm">
                                                    {file ? file.name : 'Upload Resume'}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Accepts PDF, DOC, DOCX, TXT, RTF</p>
                                            </div>
                                        </div>
                                        {file && <CheckCircle className="w-6 h-6 text-blue-600" />}
                                    </label>
                                </div>
                            </div>

                            {/* Manual QR Payment Section */}
                            <div className="mt-8 p-6 bg-blue-50 dark:bg-slate-800 rounded-2xl border-2 border-blue-100 dark:border-slate-700">
                                <h3 className="text-lg font-black text-blue-900 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5" /> Registration Fee Payment
                                </h3>
                                
                                <div className="flex flex-col md:flex-row gap-8 items-center justify-center bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm mb-6">
                                    <div className="text-center space-y-3">
                                        <div className="bg-white p-3 rounded-xl border-4 border-slate-900 inline-block">
                                            {/* Cropped Static QR Code provided by user, falls back to dynamic API if missing */}
                                            <img 
                                                src="/payment-qr-cropped.jpg" 
                                                alt="PhonePe QR Code for Nalin Srivastava" 
                                                className="w-40 h-auto object-contain"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=9950962509@ybl%26pn=NALIN%20SRIVASTAVA%26am=1000%26cu=INR";
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Scan to Pay via PhonePe/GPay</p>
                                    </div>
                                    <div className="space-y-4 w-full max-w-sm">
                                        <div>
                                            <p className="text-3xl font-black text-slate-900 dark:text-white">₹1000</p>
                                            <p className="text-sm font-bold text-slate-500">PhonePe Number: <span className="text-blue-600 font-black">9950962509</span></p>
                                        </div>
                                        
                                        <div className="space-y-2 pt-2">
                                            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Payment Receipt (Screenshot)</label>
                                            <input
                                                type="file"
                                                onChange={handleReceiptChange}
                                                accept="image/*,.pdf"
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl py-2 px-3 outline-none transition-all text-sm font-bold text-slate-600 dark:text-slate-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Transaction ID (UTR)</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. T230526012345"
                                                value={transactionId}
                                                onChange={(e) => setTransactionId(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-blue-600 rounded-xl py-3 px-4 outline-none transition-all text-slate-900 dark:text-white font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-blue-200/50 dark:border-slate-700">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                                        After successful payment, your account will be manually verified by our team shortly. Please upload the correct screenshot and transaction ID.
                                    </p>
                                    <SmartButton
                                        type="submit"
                                        disabled={isLoading || isFormIncomplete || isVerifying}
                                        isLoading={isLoading || isVerifying}
                                        disabledReason={getDisabledReason()}
                                        howToCorrect={getCorrectionStep()}
                                        onClick={handleSubmit}
                                        className={`w-full sm:w-auto bg-slate-900 hover:bg-blue-600 text-white font-black py-4 px-10 rounded-xl transition-all shadow-xl shadow-blue-600/10 cursor-pointer flex items-center justify-center gap-3 uppercase tracking-widest text-sm ${(isLoading || isVerifying) ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading || isVerifying ? (
                                            <><LoaderCircle className="w-5 h-5 animate-spin" /> {isVerifying ? 'Verifying...' : 'Processing...'}</>
                                        ) : (
                                            'Submit Details'
                                        )}
                                    </SmartButton>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Registration;
