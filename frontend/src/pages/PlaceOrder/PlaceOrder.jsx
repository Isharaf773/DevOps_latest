import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCity, 
  FaFlag, 
  FaPhone, 
  FaCreditCard, 
  FaShoppingCart,
  FaTruck,
  FaLock,
  FaArrowLeft
} from 'react-icons/fa';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item._id]
        });
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert("Error placing order.");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <div className="place-order-container">
      <div className="place-order-header">
        <button 
          className="back-button"
          onClick={() => navigate('/cart')}
          type="button"
        >
          <FaArrowLeft /> Back to Cart
        </button>
        <h1 className="page-title">
          <FaCreditCard /> Checkout
        </h1>
        <div className="order-steps">
          <div className="step active">
            <span>1</span>
            <p>Cart</p>
          </div>
          <div className="step active">
            <span>2</span>
            <p>Details</p>
          </div>
          <div className="step">
            <span>3</span>
            <p>Payment</p>
          </div>
        </div>
      </div>

      <form onSubmit={placeOrder} className='place-order'>
        <div className="place-order-left">
          <div className="form-section">
            <div className="section-header">
              <FaUser className="section-icon" />
              <h2>Personal Information</h2>
            </div>
            <div className="multi-fields">
              <div className="input-group">
                <label>First Name</label>
                <input
                  required
                  name='firstname'
                  onChange={onChangeHandler}
                  value={data.firstname}
                  type="text"
                  placeholder='Enter your first name'
                />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input
                  required
                  name='lastname'
                  onChange={onChangeHandler}
                  value={data.lastname}
                  type="text"
                  placeholder='Enter your last name'
                />
              </div>
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  required
                  name='email'
                  onChange={onChangeHandler}
                  value={data.email}
                  type="email"
                  placeholder='your.email@example.com'
                />
              </div>
            </div>
            <div className="input-group">
              <label>Phone Number</label>
              <div className="input-with-icon">
                <FaPhone className="input-icon" />
                <input
                  required
                  name='phone'
                  onChange={onChangeHandler}
                  value={data.phone}
                  type="text"
                  placeholder='+1 (555) 123-4567'
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <FaMapMarkerAlt className="section-icon" />
              <h2>Delivery Address</h2>
            </div>
            <div className="input-group">
              <label>Street Address</label>
              <div className="input-with-icon">
                <FaMapMarkerAlt className="input-icon" />
                <input
                  required
                  name='street'
                  onChange={onChangeHandler}
                  value={data.street}
                  type="text"
                  placeholder='123 Main Street'
                />
              </div>
            </div>
            <div className="multi-fields">
              <div className="input-group">
                <label>City</label>
                <div className="input-with-icon">
                  <FaCity className="input-icon" />
                  <input
                    required
                    name='city'
                    onChange={onChangeHandler}
                    value={data.city}
                    type="text"
                    placeholder='City'
                  />
                </div>
              </div>
              <div className="input-group">
                <label>State</label>
                <input
                  required
                  name='state'
                  onChange={onChangeHandler}
                  value={data.state}
                  type="text"
                  placeholder='State'
                />
              </div>
            </div>
            <div className="multi-fields">
              <div className="input-group">
                <label>Zip Code</label>
                <input
                  required
                  name='zipcode'
                  onChange={onChangeHandler}
                  value={data.zipcode}
                  type="text"
                  placeholder='12345'
                />
              </div>
              <div className="input-group">
                <label>Country</label>
                <div className="input-with-icon">
                  <FaFlag className="input-icon" />
                  <input
                    required
                    name='country'
                    onChange={onChangeHandler}
                    value={data.country}
                    type="text"
                    placeholder='Country'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="place-order-right">
          <div className='order-summary'>
            <div className="summary-header">
              <FaShoppingCart className="summary-icon" />
              <h2>Order Summary</h2>
            </div>
            
            <div className="cart-items-preview">
              <h3>Items in your cart</h3>
              <div className="items-list">
                {food_list.map((item) => {
                  if (cartItems[item._id] > 0) {
                    return (
                      <div key={item._id} className="cart-item-preview">
                        <img 
                          src={url + "/images/" + item.image} 
                          alt={item.name}
                          className="item-image"
                        />
                        <div className="item-details">
                          <p className="item-name">{item.name}</p>
                          <p className="item-quantity">Qty: {cartItems[item._id]}</p>
                        </div>
                        <p className="item-price">
                          ${(item.price * cartItems[item._id]).toFixed(2)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            <div className="cart-total">
              <div className="total-details">
                <div className="cart-total-details">
                  <p>Subtotal</p>
                  <p>${getTotalCartAmount().toFixed(2)}</p>
                </div>
                <div className="cart-total-details">
                  <p><FaTruck /> Delivery Fee</p>
                  <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                </div>
                <div className="cart-total-details grand-total">
                  <b>Total Amount</b>
                  <b>${getTotalCartAmount() === 0 ? 0 : (getTotalCartAmount() + 2).toFixed(2)}</b>
                </div>
              </div>
              
              <div className="security-notice">
                <FaLock className="lock-icon" />
                <span>Your payment information is secure and encrypted</span>
              </div>

              <button 
                type='submit' 
                className={`payment-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    PROCEED TO PAYMENT
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;