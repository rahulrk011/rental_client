import React, { useState, useEffect } from 'react';
import './HomePage.css'; // Link to the styling file
import RentItems from './RentItems'; // Assuming RentItems is a separate component
import PostRent from './PostRent'; // Assuming PostRent is a separate component

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('rent-items');
  const [showPopup, setShowPopup] = useState(false);
  
  const username = JSON.parse(localStorage.getItem('user'))?.name || 'Guest';  // Get username from localStorage

  const togglePopup = () => {
    setShowPopup(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';  // Redirects to the login page after logout
};


  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="logo">Bruhh</div>
        </div>
        <div className="nav-links">
          <a
            href="#"
            className={activeTab === 'rent-items' ? 'active' : ''}
            onClick={() => setActiveTab('rent-items')}
          >
            Rent Items
          </a>
          <a
            href="#"
            className={activeTab === 'post_rent' ? 'active' : ''}
            onClick={() => setActiveTab('post_rent')}
          >
            Post Items on Rent
          </a>
        </div>
        <div className="navbar-right">
          {/* Profile Icon */}
          <div className="profile" onClick={togglePopup}>👤</div>
        </div>
      </nav>

      {/* Profile Popup */}
      {showPopup && (
        <div className="profile-popup">
          <p>Hello, {username}</p>
          <ul>
            <li>Items Rented</li>
            <li>Items Posted</li>
            <li>Update Profile</li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}

      {/* Content Section */}
      {activeTab === 'rent-items' && <RentItems />}
      {activeTab === 'post_rent' && <PostRent />}

      {/* Footer */}
      <footer className="footer">
        <p>Company Name - Address</p>
      </footer>
    </div>
  );
};

export default HomePage;
