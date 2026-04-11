import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobsReducer from './slices/jobsSlice';
import servicesReducer from './slices/servicesSlice';
import contactsReducer from './slices/contactsSlice';
import resumesReducer from './slices/resumesSlice';
import placedStudentsReducer from './slices/placedStudentsSlice';
import carouselReducer from './slices/carouselSlice';
import statsReducer from './slices/statsSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        jobs: jobsReducer,
        services: servicesReducer,
        contacts: contactsReducer,
        resumes: resumesReducer,
        placedStudents: placedStudentsReducer,
        carousel: carouselReducer,
        stats: statsReducer
    }
});
