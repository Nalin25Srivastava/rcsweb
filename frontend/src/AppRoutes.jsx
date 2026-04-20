import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import About from './pages/About';
import RegisteredCandidates from './pages/RegisteredCandidates';
import Registration from './pages/Registration';
import Contact from './pages/Contact';
import Viewjobs from './pages/Viewjobs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/PrivateRoute';

const PageWrapper = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            {children}
        </motion.div>
    );
};

const AppRoutes = () => {
    console.log('AppRoutes rendering with AnimatePresence');
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                <Route path="/registered-candidates" element={<PageWrapper><RegisteredCandidates /></PageWrapper>} />
                <Route path="/postres" element={<PageWrapper><Registration /></PageWrapper>} />
                <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
                <Route path="/viewjobs" element={<PageWrapper><Viewjobs /></PageWrapper>} />
                <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
                <Route path="/admin-panel" element={
                    <PrivateRoute>
                        <PageWrapper><AdminPanel /></PageWrapper>
                    </PrivateRoute>
                } />
            </Routes>
        </AnimatePresence>
    );
};

export default AppRoutes;
