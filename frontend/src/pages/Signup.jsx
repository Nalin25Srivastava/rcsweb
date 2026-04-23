import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { signup, googleLogin, reset, verifyRegistrationPayment, setSecretVerified } from '../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';



const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [adminSecret, setAdminSecret] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
    const [verificationStatus, setVerificationStatus] = useState(null); // 'success' | 'error' | null
    // All manual Google Redirect and SDK logic removed for simplicity

    const VIP_EMAILS = ['hitkarikusum.ngo@gmail.com', 'khmbvs26@gmail.com'];
    const isVIPEmail = (email) => VIP_EMAILS.includes(email);

    useEffect(() => {
        if (isSuccess && user) {
            navigate('/');
            // Small delay to ensure state isn't cleared too early if navigate is async
            setTimeout(() => dispatch(reset()), 100);
        }

        // Auto-detect admin if VIP email is detected
        if (isVIPEmail(email) && role !== 'admin') {
            setRole('admin');
            setAdminSecret('rcsplacements2009');
        }

        if (isError) {
            dispatch(reset());
        }
    }, [user, isError, isSuccess, message, navigate, dispatch, email, role]);

    const handleVerifyAdmin = () => {
        if (adminSecret === 'rcsplacements2009') {
            setVerificationStatus('success');
        } else {
            setVerificationStatus('error');
            setTimeout(() => {
                setRole('user');
                setAdminSecret('');
                setVerificationStatus(null);
            }, 1500);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Admin verification guard
        if (role === 'admin' && verificationStatus !== 'success' && !isVIPEmail(email)) {
            alert('Verify First');
            return;
        }

        const resultAction = await dispatch(signup({ name, email, password, role, adminSecret }));
        
        if (signup.fulfilled.match(resultAction)) {
            navigate('/');
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden py-12 px-4">
            
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-20"></div>

            <motion.div 
                className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row relative z-10"
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Left Side: Form */}
                <div className="md:w-7/12 p-8 md:p-14 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
                        <p className="text-slate-500 font-bold mt-2">Join the RCS consulting ecosystem</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence>
                            {isError && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-700"
                                >
                                    <span className="font-bold text-sm">{message}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-5">
                            <div className="space-y-2 group">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-500 focus:bg-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all text-slate-900 shadow-sm font-bold"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john@example.com"
                                        className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-500 focus:bg-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all text-slate-900 shadow-sm font-bold"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Choose a strong password"
                                        className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-500 focus:bg-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all text-slate-900 shadow-sm font-bold"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Account Type</label>
                                <div className="flex space-x-6 pl-1">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="user"
                                            checked={role === 'user'}
                                            onChange={() => {
                                                setRole('user');
                                                setAdminSecret('');
                                            }}
                                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                        />
                                        <span className="text-slate-700 font-bold">User</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="admin"
                                            checked={role === 'admin'}
                                            onChange={() => {
                                                if (isVIPEmail(email)) {
                                                    setRole('admin');
                                                    setAdminSecret('rcsplacements2009');
                                                } else {
                                                    setRole('admin');
                                                    setAdminSecret('');
                                                }
                                            }}
                                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                        />
                                        <span className="text-slate-700 font-bold">Admin</span>
                                    </label>
                                </div>
                            </div>

                            <AnimatePresence>
                                {(role === 'admin' && !isVIPEmail(email)) && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -10 }}
                                        className="space-y-2 group overflow-hidden"
                                    >
                                        <label className="text-xs font-black text-blue-600 uppercase tracking-widest ml-1">Admin Verification Code</label>
                                        <div className="relative">
                                            <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 group-focus-within:text-blue-600 transition-colors" />
                                            <input
                                                type="password"
                                                value={adminSecret}
                                                onChange={(e) => {
                                                    setAdminSecret(e.target.value);
                                                    if (verificationStatus) setVerificationStatus(null);
                                                }}
                                                placeholder="Enter admin passkey"
                                                className={`w-full bg-blue-50/50 border-2 rounded-xl py-4 pl-12 pr-16 outline-none transition-all text-slate-900 shadow-sm font-bold placeholder:text-blue-200 ${
                                                    verificationStatus === 'success' ? 'border-emerald-500 bg-emerald-50' : 
                                                    verificationStatus === 'error' ? 'border-red-500 bg-red-50' : 
                                                    'border-blue-100 focus:border-blue-500 focus:bg-white'
                                                }`}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyAdmin}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black px-3 py-2 rounded-lg transition-all active:scale-95 uppercase tracking-tighter"
                                            >
                                                GO
                                            </button>
                                        </div>
                                        <AnimatePresence>
                                            {verificationStatus && (
                                                <motion.p 
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ml-1 ${
                                                        verificationStatus === 'success' ? 'text-emerald-600' : 'text-red-600'
                                                    }`}
                                                >
                                                    {verificationStatus === 'success' ? (
                                                        <><CheckCircle className="w-3 h-3 text-emerald-500" /> Verification Successful</>
                                                    ) : (
                                                        <><XCircle className="w-3 h-3 text-red-500" /> Verification Failed</>
                                                    )}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isLoading || (role === 'admin' && verificationStatus !== 'success' && !isVIPEmail(email))}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full bg-slate-900 hover:bg-blue-500 text-white font-black py-4 px-6 rounded-xl text-lg shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 uppercase tracking-widest mt-8 ${(isLoading || (role === 'admin' && verificationStatus !== 'success' && !isVIPEmail(email))) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <ArrowRight className="w-5 h-5" /> {isLoading ? 'Creating...' : 'Sign Up'}
                        </motion.button>

                        <div className="relative flex items-center gap-4 py-4">
                            <div className="flex-grow border-t border-slate-100"></div>
                            <span className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">or fast track with</span>
                            <div className="flex-grow border-t border-slate-100"></div>
                        </div>

                        <div className="flex flex-col items-center gap-4 mt-6 w-full">
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    console.log('Google Signup Success (Simple):', credentialResponse);
                                    if (credentialResponse.credential) {
                                        dispatch(googleLogin({ 
                                            token: credentialResponse.credential, 
                                            isAccessToken: false,
                                            role,
                                            adminSecret
                                        }));
                                    }
                                }}
                                onError={() => {
                                    console.log('Google Signup Failed');
                                    alert('Google Signup Failed. If you are in Incognito, try a normal window.');
                                }}
                                theme="outline"
                                shape="pill"
                                size="large"
                                width="350"
                            />
                        </div>

                        <div className="text-center pt-6">
                            <p className="text-slate-500 font-medium">
                                Already part of RCS? {' '}
                                <Link to="/login" className="text-blue-600 font-bold hover:underline transition-all">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Right Side: Brand Image */}
                <div className="hidden md:flex md:w-5/12 bg-slate-900 relative p-12 text-white flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-40 mix-blend-overlay border-l border-slate-800"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/60"></div>
                    
                    <div className="relative z-10 text-right">
                        <Link to="/" className="text-xl font-bold tracking-tight uppercase inline-flex items-center gap-2">
                            <span>RCS</span><span className="text-blue-500">Placement</span>
                        </Link>
                    </div>

                    <div className="relative z-10 text-right">
                        <h2 className="text-4xl font-black mb-4 leading-tight tracking-tight">Accelerate Your Future.</h2>
                        <p className="text-blue-400 font-bold tracking-widest text-sm uppercase">Join 5000+ top tier candidates.</p>
                    </div>
                </div>

            </motion.div>


        </div>
    );
};

export default Signup;
