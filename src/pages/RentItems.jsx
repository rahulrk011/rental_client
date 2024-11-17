import React, { useState, useEffect } from 'react';

const RentItems = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [items, setItems] = useState([]);
  const [sellerDetails, setSellerDetails] = useState({});

  useEffect(() => {
    // Fetch products based on selected category
    const fetchItems = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:5000/api/products?category=${selectedCategory}&email=${user.email}`);
      const data = await response.json();
      setItems(data);

      // Fetch seller details for each item
      data.forEach(item => {
        if (!sellerDetails[item.email]) {
          fetchSellerDetails(item.email); // Fetch seller details for the seller of each item
        }
      });
    };

    fetchItems();
  }, [selectedCategory]);

  // Function to fetch seller details (name and ID card photo)
  const fetchSellerDetails = async (email) => {
    const response = await fetch('http://localhost:5000/api/getSellerDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (data.success) {
      setSellerDetails(prev => ({
        ...prev,
        [email]: { name: data.sellerName, photo: data.sellerPhoto }
      }));
    }
  };

  return (
    <>
      <div className="search-bar">
        <input type="text" placeholder="🔍 Search" />
      </div>

      <div className="categories-container">
        <div className="categories">
          {['All', 'Electronics', 'Furniture', 'Clothing', 'Sports', 'Books', 'Home_appliances', 'Cars', 'Bikes', 'Cycles'].map((category) => (
            <div
              key={category}
              className={`category-item ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className="content">
        {items.length > 0 ? (
          <div className="items-grid">
            {items.map((item) => (
              <div className="item-card" key={item._id}>
                <img src={`http://localhost:5000/${item.photo}`} alt="item" />
                <h3>{item.name}</h3>
                <p>{item.pricePerDay} / day</p>
                <p>{item.description}</p>
                <br />

                {/* Conditionally render seller details only if available */}
                {sellerDetails[item.email]?.name && sellerDetails[item.email]?.photo && (
                  <>
                    <p><strong>Seller Name:</strong> {sellerDetails[item.email]?.name}</p>

                    {/* Show View ID Card Button if both name and photo exist */}
                    <div>
                      <button
                        onClick={() => {
                          const newSellerDetails = { ...sellerDetails };
                          newSellerDetails[item.email].showIdCard = !newSellerDetails[item.email].showIdCard;
                          setSellerDetails(newSellerDetails);
                        }}
                      >
                        {sellerDetails[item.email]?.showIdCard ? 'Hide ID Card' : 'View ID Card'}
                      </button>

                      {/* Show ID Card if clicked */}
                      {sellerDetails[item.email]?.showIdCard && (
                        <div className="id-card-preview">
                          <img
                            src={`http://localhost:5000/${sellerDetails[item.email]?.photo}`}
                            alt="Seller ID Card"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                <p>Email: {item.email}</p>
                <b><p>{item.contactNumber}</p></b>
              </div>
            ))}
          </div>
        ) : (
          <p>Sorry, No items yet!</p>
        )}
      </div>
    </>
  );
};

export default RentItems;
