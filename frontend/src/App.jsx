import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppRoutes from './AppRoutes'



const App = () => {
    // Redux state for user
    
    // We removed the local useState to use Redux state instead

    // Administrative secret code has been removed for all admins.
    // Access is now managed solely by user roles in the database.

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-x-hidden">
            <Navbar />
            <main className="flex-grow pt-20">
                <AppRoutes />
            </main>
            <Footer />
        </div>
    );
};

export default App;