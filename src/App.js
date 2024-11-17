import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Loader from './components/Loader';
import HomePage from './pages/HomePage'
import PostRent from './pages/PostRent';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigate]);

    if (loading) {
        return <Loader />;
    }

    return (
        <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    
    <Route 
        path="/post_rent" 
        element={
            <ProtectedRoute>
                <PostRent />
            </ProtectedRoute>
        } 
    />
    <Route 
        path="/home" 
        element={
            <ProtectedRoute>
                <HomePage />
            </ProtectedRoute>
        } 
    />
</Routes>
    );
}

export default App;
