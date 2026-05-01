import { Menu, X, LogOut, User, Sun, Moon } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const { theme, toggleTheme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const { user: reduxUser, isSecretVerified } = useSelector((state) => state.auth)
    
    // Use Redux user as primary, but fallback to localStorage
    const storedUser = JSON.parse(localStorage.getItem('rcs_user') || 'null')
    const user = reduxUser || storedUser

    const handleLogout = () => {
        dispatch(logout())
        setIsOpen(false)
        window.location.href = '/login' // Force a clean state after logout
    }

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Registered', href: '/registered-candidates', adminOnly: true },
        { name: 'Registration', href: '/postres' },
        { name: 'View Jobs', href: '/viewjobs' },
        { name: 'Achievements', href: '/achievements' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Admin Panel', href: '/admin-panel', adminOnly: true },
    ]

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
                <div className="mt-3 flex justify-between h-14 items-center">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-xl font-bold text-indigo-600">
                            <img className="w-24 h-12 lg:w-32 lg:h-16 object-contain" src="/images/rcs_logo.jpg" alt="RCS Logo" />
                        </Link>
                    </div>

                    {/* Desktop Links (Centered) */}
                    <div className="hidden lg:flex flex-grow items-center justify-center">
                        <div className="flex space-x-6">
                            {navLinks
                                .filter(link => {
                                    if (!user && (link.name === 'Registration' || link.name === 'Contact Us')) return false
                                    if (user && user.role === 'admin' && link.name === 'Registration' && user.email !== 'hitkarikusu.org@gmail.com') return false
                                    if (link.adminOnly && (!user || user.role !== 'admin' || !isSecretVerified)) return false
                                    return true
                                })
                                .map((link) => {
                                    const isActive = location.pathname === link.href;
                                    return (
                                        <NavLink
                                            key={link.name}
                                            to={link.href}
                                            className="relative group py-2"
                                        >
                                            <span className={`px-2 text-lg font-bold transition-colors duration-300 ${
                                                isActive ? 'text-[#00c57d]' : 'text-gray-600 dark:text-slate-400 group-hover:text-[#00c57d]'
                                            }`}>
                                                {link.name}
                                            </span>
                                            {isActive && (
                                                <motion.div 
                                                    layoutId="activeNav"
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00c57d]"
                                                    initial={false}
                                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                />
                                            )}
                                        </NavLink>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Desktop Actions (Right Aligned) */}
                    <div className="hidden lg:flex items-center gap-6 border-l pl-8 border-gray-100 dark:border-slate-800">
                        {/* Theme Toggle Switch */}
                        <div className="relative flex items-center">
                            <button
                                onClick={toggleTheme}
                                className="relative w-14 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors duration-500 flex items-center px-1 group shadow-inner"
                                aria-label="Toggle Theme"
                            >
                                <motion.div 
                                    animate={{ x: theme === 'light' ? 0 : 28 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    className="z-10 w-5 h-5 rounded-full bg-white dark:bg-emerald-500 shadow-md flex items-center justify-center border border-slate-200 dark:border-emerald-400"
                                >
                                    {theme === 'light' ? <Sun className="w-3 h-3 text-amber-500" /> : <Moon className="w-3 h-3 text-white" />}
                                </motion.div>
                                <div className="absolute inset-0 flex items-center justify-between px-2 text-slate-400">
                                    <Sun className={`w-3 h-3 transition-opacity ${theme === 'light' ? 'opacity-0' : 'opacity-40'}`} />
                                    <Moon className={`w-3 h-3 transition-opacity ${theme === 'dark' ? 'opacity-0' : 'opacity-40'}`} />
                                </div>
                            </button>
                        </div>

                        {user && (user.name || user.email) ? (
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-gray-700 font-bold">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200 shadow-sm transition-transform hover:scale-110">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="capitalize text-slate-900 dark:text-white leading-none mb-1 text-sm">
                                            {user.name || user.email.split('@')[0]}
                                        </span>
                                        <span className={`text-[9px] uppercase tracking-tighter font-black px-1.5 rounded shadow-sm w-fit ${
                                            user.role === 'admin' 
                                            ? 'text-emerald-600 bg-emerald-50' 
                                            : 'text-blue-600 bg-blue-50'
                                        }`}>
                                            {user.role === 'admin' ? 'Admin' : 'User'}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-bold transition-all transform hover:scale-105 active:scale-95 cursor-pointer bg-slate-50 hover:bg-red-50 px-3 py-1.5 rounded-full border border-slate-100"
                                >
                                    <LogOut className="w-4 h-4" /> <span className="text-xs">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <NavLink 
                                    to="/login" 
                                    className={({ isActive }) => `font-bold text-sm transition-colors ${isActive ? 'text-[#00c57d]' : 'text-gray-600 dark:text-slate-400 hover:text-indigo-600'}`}
                                >
                                    Login
                                </NavLink>
                                <Link 
                                    to="/signup" 
                                    className="bg-[#00c57d] hover:bg-[#00ae6e] text-white px-6 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 active:scale-95 shadow-md"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Button & Auth */}
                    <div className="lg:hidden flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700"
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>

                        {!user && (
                            <div className="flex items-center gap-2 mr-1">
                                <Link to="/login" className="text-xs font-black text-gray-700 hover:text-[#00c57d] uppercase tracking-wider">Login</Link>
                                <Link to="/signup" className="text-xs font-black text-white bg-[#00c57d] px-3 py-2 rounded-full shadow-md uppercase tracking-wider">Sign Up</Link>
                            </div>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-emerald-500 focus:outline-none p-1 transition-colors"
                        >
                            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="lg:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            {navLinks
                                .filter(link => {
                                    if (!user && (link.name === 'Registration' || link.name === 'Contact Us')) {
                                        return false
                                    }
                                    if (user && user.role === 'admin' && link.name === 'Registration' && user.email !== 'hitkarikusu.org@gmail.com') return false
                                    if (link.adminOnly && (!user || user.role !== 'admin' || !isSecretVerified)) return false
                                    return true
                                })
                                .map((link) => (
                                <motion.div key={link.name} whileTap={{ scale: 0.95 }}>
                                    <NavLink
                                        to={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) => `block px-3 py-3 text-lg font-bold rounded-lg transition-colors capitalize ${
                                            isActive ? 'text-[#00c57d] bg-emerald-50' : 'text-gray-600 hover:text-[#00c57d] hover:bg-gray-50'
                                        }`}
                                    >
                                        {link.name}
                                    </NavLink>
                                </motion.div>
                            ))}
                            
                            <div className="pt-6 mt-4 border-t border-gray-100 flex flex-col space-y-4">
                                {user && (user.name || user.email) ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-lg font-black text-slate-900 capitalize leading-none">
                                                        {user.name || user.email.split('@')[0]}
                                                    </p>
                                                        <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                                                            user.role === 'admin'
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {user.role === 'admin' ? 'Admin' : 'User'}
                                                        </span>
                                                </div>
                                                <p className="text-xs text-slate-400 font-bold mt-1 truncate max-w-[150px]">{user.email}</p>
                                            </div>
                                        </div>
                                        <motion.button 
                                            onClick={handleLogout}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-red-50 text-red-600 py-4 rounded-2xl text-lg font-black flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest border border-red-100 shadow-sm"
                                        >
                                            <LogOut className="w-6 h-6" /> Logout
                                        </motion.button>
                                    </div>
                                ) : (
                                    <>
                                        <Link 
                                            to="/login" 
                                            onClick={() => setIsOpen(false)}
                                            className="text-center py-3 text-lg font-black text-gray-700 hover:text-[#00c57d] uppercase tracking-widest"
                                        >
                                            Login
                                        </Link>
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Link 
                                                to="/signup" 
                                                onClick={() => setIsOpen(false)}
                                                className="bg-[#00c57d] text-white text-center py-4 rounded-xl text-lg font-black shadow-lg block uppercase tracking-widest"
                                            >
                                                Sign Up
                                            </Link>
                                        </motion.div>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </nav>
    )
}

export default Navbar
