import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, CheckCircle, AlertCircle, LoaderCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitResume, resetResumeState } from '../store/slices/resumesSlice';
import { setPaid } from '../store/slices/authSlice';

const Registration = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, isSuccess, isError, message } = useSelector((state) => state.resumes);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        functionalArea: '',
        agencyName: '',
    });
    const [file, setFile] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null); // 'processing' | 'success' | null

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
        e.preventDefault();
        
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
            data.append('agencyName', formData.agencyName);
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
                handler: function (response) {
                    // 4. Secure Webhook Workflow (Backend receives payment async)
                    // We only update the UI visually and unlock the account locally.
                    dispatch(setPaid());
                    setPaymentStatus('success');
                    
                    // Clear form for future use
                    setFormData({
                        firstName: '', lastName: '', email: '', 
                        phone: '', functionalArea: '', agencyName: ''
                    });
                    setFile(null);
                    
                    // Reset redux state after a delay
                    setTimeout(() => {
                        dispatch(resetResumeState());
                        setPaymentStatus(null);
                        navigate('/');
                    }, 3000);
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
                    contact: formData.phone
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

    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            
            <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col lg:flex-row border border-slate-100">
                
                {/* Left Side: Info & Branding */}
                <div className="lg:w-5/12 bg-slate-900 p-12 text-white flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
                    
                    <div className="relative z-10 flex-grow drop-shadow-md">
                        <div className="inline-block px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full font-black uppercase tracking-widest text-xs mb-8 border border-emerald-500/30">
                            Partner Network
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight leading-tight">
                            Placement Agency <span className="text-emerald-400">Portal</span>
                        </h2>
                        <p className="text-slate-300 font-medium text-lg leading-relaxed mb-10">
                            Register your agency with the RCS ecosystem to unlock premium hiring tools, enterprise client access, and dedicated technical support.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Global Network", desc: "Access unlisted corporate requisitions." },
                                { title: "Secure Webhooks", desc: "Enterprise-grade async payment verification integrations." },
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
                            
                            {paymentStatus === 'success' && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-6 rounded-2xl flex items-center gap-4 border bg-emerald-50 text-emerald-700 border-emerald-200 shadow-lg"
                                >
                                    <CheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-black text-emerald-900 text-lg">Registration Successful</h4>
                                        <p className="font-medium text-emerald-700 mt-1">Your payment is being verified by the provider securely. We will contact you shortly.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className={`transition-opacity duration-500 ${paymentStatus === 'success' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Agency Name</label>
                                    <input
                                        type="text"
                                        name="agencyName"
                                        value={formData.agencyName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Company Ltd."
                                        className="w-full bg-slate-50 border-2 border-slate-50 focus:border-emerald-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all text-slate-900 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contact Person (First Name)</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 border-2 border-slate-50 focus:border-emerald-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all text-slate-900 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 border-2 border-slate-50 focus:border-emerald-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all text-slate-900 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 border-2 border-slate-50 focus:border-emerald-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all text-slate-900 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 border-2 border-slate-50 focus:border-emerald-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all text-slate-900 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Primary Domain</label>
                                    <select 
                                        name="functionalArea"
                                        value={formData.functionalArea}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 border-2 border-slate-50 focus:border-emerald-500 focus:bg-white rounded-xl py-3 px-4 outline-none transition-all text-slate-900 font-bold appearance-none cursor-pointer"
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
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Agency Profile (PDF/DOC)</label>
                                <label className="flex items-center justify-center w-full bg-slate-50 border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-2xl py-8 px-4 cursor-pointer transition-all group">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all shadow-sm">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-slate-600 group-hover:text-emerald-600 text-sm mt-2 text-center max-w-[200px] truncate">
                                            {file ? file.name : "Click to select file"}
                                        </span>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                                </label>
                            </div>

                            {/* Payment & Submit */}
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Registration Fee</p>
                                    <p className="text-3xl font-black text-slate-900 flex items-center gap-2">
                                        ₹1000 
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    </p>
                                </div>
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full sm:w-auto bg-slate-900 hover:bg-emerald-500 text-white font-black py-4 px-10 rounded-xl transition-all shadow-xl shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-3 uppercase tracking-widest text-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? (
                                        <><LoaderCircle className="w-5 h-5 animate-spin" /> Processing...</>
                                    ) : (
                                        'Pay & Register'
                                    )}
                                </motion.button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Registration;
