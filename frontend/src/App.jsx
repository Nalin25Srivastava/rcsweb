import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppRoutes from './AppRoutes'

import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { logout, setSecretVerified } from './store/slices/authSlice'

const App = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user: reduxUser, isSecretVerified } = useSelector((state) => state.auth);
    const storedUser = JSON.parse(localStorage.getItem('rcs_user') || 'null');
    const user = reduxUser || storedUser;
    
    // We removed the local useState to use Redux state instead

    useEffect(() => {
        // Administrative secret code has been removed for all admins.
        // Access is now managed solely by user roles in the database.
    }, [user, dispatch, navigate]);

    console.log('App with Routes rendering');
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <AppRoutes />
            </main>
            <Footer />
        </div>
    );
};

export default App;