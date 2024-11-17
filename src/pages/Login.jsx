import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            setMessage(data.message);
            console.log(data)
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            if (response.ok) {
                navigate('/home');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Something went wrong! Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="left-div">
                <h1>Welcome to Our Rental Marketplace</h1>
            </div>
            <div className="right-div">
                <div className="auth-card">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <button type="submit">Login</button>
                    </form>
                    {message && <div className="notification">{message}</div>}
                    <div className="acknowledgment">
                        <p>Don't have an account? <a href="/register">Register here</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
