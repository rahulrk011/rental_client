import React, { useState } from 'react';
import './PostRent.css';
import axios from 'axios'; // For sending requests

const PostRent = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    pricePerDay: '',
    contactNumber: '',
    region: '',
    address: '',
    photo: null,  // Change photos to single photo
    email: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // To track submission state
  const [message, setMessage] = useState(''); // To show success or error message

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0]; // Get the first (and only) file
    setFormData((prevFormData) => ({
      ...prevFormData,
      photo: file // Set the single photo
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleDeletePhoto = () => {
    setFormData((prevData) => ({
      ...prevData,
      photo: null // Clear the photo when deleted
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create FormData object to send the fields + photo
    const form = new FormData();
    form.append('name', formData.name);
    form.append('category', formData.category);
    form.append('pricePerDay', formData.pricePerDay);
    form.append('contactNumber', formData.contactNumber);
    form.append('region', formData.region);
    form.append('address', formData.address);

    // Append the single photo
    if (formData.photo) {
      form.append('photo', formData.photo); // The key should be 'photo' to match the backend API
    }

    form.append('description', formData.description);

    // Parse and append the email from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      form.append('email', user.email);
    } else {
      console.error('User email not found in localStorage');
    }

    try {
      const response = await axios.post('http://localhost:5000/api/products/add', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Success case: Show message, reset form, or navigate to a success page
      setMessage('Product posted successfully!');
    } catch (error) {
      console.error('Error posting product:', error);
      setMessage('Failed to post the product. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-rent-container">
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="step-one">
            <h2>Step 1: Product Details</h2>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              onChange={handleInputChange}
              value={formData.name}
              required
            /><br />
            
            <select
              name="category"
              onChange={handleInputChange}
              value={formData.category}
              required
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Clothing</option>
              <option value="furniture">Furniture</option>
              <option value="books">Books</option>
              <option value="home_appliances">Home_appliances</option>
              <option value="sports">Sports</option>
              <option value="automotive">Cars</option>
              <option value="automotive">Bikes</option>
              <option value="automotive">Cycles</option>
            </select><br />
            <br />
            <input
              type="number"
              name="pricePerDay"
              placeholder="Price per day"
              onChange={handleInputChange}
              value={formData.pricePerDay}
              required
            /><br />
            
            <input
              type="tel"
              name="contactNumber"
              placeholder="Contact Number"
              onChange={handleInputChange}
              value={formData.contactNumber}
              required
            /><br />

            <textarea
              name="description"
              placeholder="Description"
              rows="4"
              cols="50"
              onChange={handleInputChange}
              value={formData.description}
              required
            ></textarea><br />
            <button type="button" onClick={nextStep}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="step-two">
            <h2>Step 2: Location Details</h2>
            <input
              type="text"
              name="region"
              placeholder="Region"
              onChange={handleInputChange}
              value={formData.region}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address to collect the item"
              onChange={handleInputChange}
              value={formData.address}
              required
            />
            <input
              type="file"
              name="photo"
              onChange={handlePhotoUpload}
              required
            />
            <div className="photo-preview">
              {formData.photo && (
                <div style={{ display: 'inline-block', margin: '5px', position: 'relative' }}>
                  <img
                    src={URL.createObjectURL(formData.photo)}
                    alt="Uploaded preview"
                    style={{ width: '100px' }}
                  />
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '2px',
                      width: '20px',
                      height: '20px',
                      lineHeight: '15px',
                    }}
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
            <button type="button" onClick={prevStep}>Previous</button>
            <button type="button" onClick={nextStep}>Next</button>
          </div>
        )}

        {step === 3 && (
          <div className="step-three">
            <h2>Step 3: Review and Submit</h2>
            <p><strong>Product Name:</strong> {formData.name}</p>
            <p><strong>Category:</strong> {formData.category}</p>
            <p><strong>Price per day:</strong> Rs.{formData.pricePerDay}</p>
            <p><strong>Contact Number:</strong> {formData.contactNumber}</p>
            <p><strong>Region:</strong> {formData.region}</p>
            <p><strong>Address:</strong> {formData.address}</p>
            <p><strong>Description:</strong> {formData.description}</p>
            <button type="button" onClick={prevStep}>Previous</button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Submit'}
            </button>
          </div>
        )}
      </form>

      {/* Show message after form submission */}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PostRent;
