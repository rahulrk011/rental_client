import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [idCardPhoto, setIdCardPhoto] = useState(null); // State for the ID card photo
    const [creditCardNumber, setCreditCardNumber] = useState('');
    const [message, setMessage] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null); // State to hold the preview URL of the image

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setIdCardPhoto(file);

        // Create a URL for the file to show a preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result); // Set the preview URL to display the image
        };
        if (file) {
            reader.readAsDataURL(file); // Read the file as data URL
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare form data with the image file and other information
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('creditCardNumber', creditCardNumber);
        if (idCardPhoto) formData.append('idCardPhoto', idCardPhoto); // Append the file if present

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                body: formData, // Send form data instead of JSON for file upload
            });

            const data = await response.json();
            setMessage(data.message);
            if (response.ok) {
                navigate('/login'); // Navigate to login page on success
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
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            placeholder="Name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
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
                        
                        {/* ID card photo upload */}
                        id card: <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handlePhotoChange} 
                            required 
                        />

                        {/* Image preview */}
                        {previewUrl && <img src={previewUrl} alt="ID Card Preview" className="image-preview" />}
                        
                        <br />
                        {/* Credit card number */}
                        <input 
                            type="text" 
                            placeholder="Credit Card Number" 
                            value={creditCardNumber} 
                            onChange={(e) => setCreditCardNumber(e.target.value)} 
                            required 
                        />
                        
                        <button type="submit">Register</button>
                    </form>
                    {message && <div className="notification">{message}</div>}
                    <div className="acknowledgment">
                        <p>Already have an account? <a href="/">Login here</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
