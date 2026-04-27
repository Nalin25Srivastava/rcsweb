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
    const { isLoading, isSuccess, isError, message } = useSelector((state) => state.resumes);
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        functionalArea: '',
    });
    const [file, setFile] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null); // 'processing' | 'success' | null
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=postres');
        } else if (user && !formData.email) {
            // Pre-fill from user account
            const nameParts = user.name ? user.name.split(' ') : ['', ''];
            setFormData({
                ...formData,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: user.email || '',
            });
        }
    }, [user, navigate, formData.email]);

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

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        if (!file) {
            alert('Please select your Agency Profile/Document');
            return;
        }

        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            // Pack form data
            const data = new FormData();
            data.append('firstName', formData.firstName);
            data.append('lastName', formData.lastName);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('functionalArea', formData.functionalArea);
            data.append('resume', file);
            data.append('amount', 1000);

            // 1. Dispatch form to backend which creates a Pending standard + Order ID
            const resultAction = await dispatch(submitResume(data)).unwrap();

            // 2. Extract Razorpay Order from the successful backend response
            const orderData = resultAction.order;
            
            if (!orderData || !orderData.id) {
                alert('Database saved, but failed to generate payment order. Contact Support.');
                return;
            }

            // 3. Prompt user with Razorpay Pop Up
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
                amount: orderData.amount,
                currency: orderData.currency,
                name: "RCS Placement",
                description: "Agency Registration Fee",
                order_id: orderData.id,
                handler: async function (response) {
                    setIsVerifying(true);
                    
                    try {
                        // 4. Client-side Verification
                        await dispatch(verifyRegistrationPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })).unwrap();

                        dispatch(setPaid());
                        setPaymentStatus('success');
                        
                        // Clear form for future use
                        setFormData({
                            firstName: '', lastName: '', email: '', 
                            phone: '', functionalArea: ''
                        });
                        setFile(null);
                        
                        // Reset redux state after a delay
                        setTimeout(() => {
                            dispatch(resetResumeState());
                            setPaymentStatus(null);
                            setIsVerifying(false);
                            navigate('/');
                        }, 3000);

                    } catch (verifyErr) {
                        console.error('Verification Error:', verifyErr);
                        alert('Payment recorded but verification failed. Please contact support if your account is not activated within 10 minutes.');
                        setIsVerifying(false);
                    }
                },
                modal: {
                    ondismiss: function() {
                        alert('Payment was cancelled. You can log into your portal later to complete the payment.');
                        dispatch(resetResumeState());
                    }
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phone,
                    method: 'upi'
                },
                config: {
                    display: {
                        blocks: {
                            upi: {
                                name: "UPI (PhonePe, GPay, etc.)",
                                instruments: [
                                    {
                                        method: "upi"
                                    }
                                ]
                            },
                            cards: {
                                name: "Cards (Debit/Credit)",
                                instruments: [
                                    {
                                        method: "card"
                                    }
                                ]
                            },
                            netbanking: {
                                name: "Netbanking",
                                instruments: [
                                    {
                                        method: "netbanking"
                                    }
                                ]
                            },
                            wallet: {
                                name: "Wallets",
                                instruments: [
                                    {
                                        method: "wallet"
                                    }
                                ]
                            }
                        },
                        sequence: ["block.upi", "block.cards", "block.netbanking", "block.wallet"],
                        preferences: {
                            show_default_blocks: true
                        }
                    }
                },
                theme: { color: "#10b981" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Submit Error:', error);
            alert('An error occurred during order creation: ' + (error || 'Please try again. Check backend logs for Razorpay Keys.'));
        }
    };

    const isFormIncomplete = !formData.phone || !formData.functionalArea || !file;
    const getDisabledReason = () => {
        if (!formData.phone || !formData.functionalArea) return "Form fields are missing";
        if (!file) return "Profile/Document not uploaded";
        return "";
    };
    const getCorrectionStep = () => {
        if (!formData.phone || !formData.functionalArea) return "Please fill in your phone number and select a primary domain.";
        if (!file) return "Click the upload area to select your agency profile or resume.";
        return "";
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors duration-300">
            
            <div className="max-w-6xl w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col lg:flex-row border border-slate-100 dark:border-slate-800">
                
                {/* Left Side: Info & Branding */}
                <div className="lg:w-5/12 bg-slate-900 p-12 text-white flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
                    
                    <div className="relative z-10 flex-grow drop-shadow-md">
                        <div className="inline-block px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full font-black uppercase tracking-widest text-xs mb-8 border border-emerald-500/30">
                            Partner Network
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight leading-tight">
                            Candidate <span className="text-emerald-400">Registration</span>
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
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
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
                                    className={`p-6 rounded-2xl flex items-center gap-4 border shadow-lg ${paymentStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
                                >
                                    {paymentStatus === 'success' ? (
                                        <CheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                                    ) : (
                                        <LoaderCircle className="w-8 h-8 text-blue-500 animate-spin flex-shrink-0" />
                                    )}
                                    <div>
                                        <h4 className={`font-black text-lg ${paymentStatus === 'success' ? 'text-emerald-900' : 'text-blue-900'}`}>
                                            {paymentStatus === 'success' ? 'Registration Successful' : 'Verifying Payment...'}
                                        </h4>
                                        <p className={`font-medium mt-1 ${paymentStatus === 'success' ? 'text-emerald-700' : 'text-blue-700'}`}>
                                            {paymentStatus === 'success' 
                                                ? 'Your account has been activated. Redirecting you to home...' 
                                                : 'Please do not close this window while we verify your transaction.'}
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
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 dark:bg-slate-800 rounded-xl py-3 px-4 outline-none transition-all text-slate-900 dark:text-white font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Primary Domain</label>
                                    <select 
                                        name="functionalArea"
                                        value={formData.functionalArea}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all text-slate-900 dark:text-white font-bold appearance-none cursor-pointer"
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
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Profile / Documents (All Formats)</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="*/*"
                                        id="file-upload"
                                        className="hidden"
                                    />
                                    <label 
                                        htmlFor="file-upload"
                                        className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl py-8 px-6 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-slate-400 dark:text-slate-300 group-hover:text-emerald-500 group-hover:scale-110 transition-all">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white text-sm">
                                                    {file ? file.name : 'Upload Profile'}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Select your resume or document</p>
                                            </div>
                                        </div>
                                        {file && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                                    </label>
                                </div>
                            </div>

                            {/* Payment & Submit */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Registration Fee</p>
                                    <p className="text-3xl font-black text-slate-900 flex items-center gap-2">
                                        ₹1000 
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    </p>
                                </div>
                                <SmartButton
                                    type="submit"
                                    disabled={isLoading || isFormIncomplete || isVerifying}
                                    isLoading={isLoading || isVerifying}
                                    disabledReason={getDisabledReason()}
                                    howToCorrect={getCorrectionStep()}
                                    onClick={handleSubmit}
                                    className={`w-full sm:w-auto bg-slate-900 hover:bg-emerald-500 text-white font-black py-4 px-10 rounded-xl transition-all shadow-xl shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-3 uppercase tracking-widest text-sm ${(isLoading || isVerifying) ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading || isVerifying ? (
                                        <><LoaderCircle className="w-5 h-5 animate-spin" /> {isVerifying ? 'Verifying...' : 'Processing...'}</>
                                    ) : (
                                        'Pay & Register'
                                    )}
                                </SmartButton>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Registration;
