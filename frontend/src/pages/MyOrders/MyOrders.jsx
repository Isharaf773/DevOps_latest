import React, { useContext, useState, useEffect } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { 
  FaBox, 
  FaDollarSign, 
  FaShoppingBag, 
  FaSearch, 
  FaClock, 
  FaCheckCircle, 
  FaTruck, 
  FaUndo,
  FaExclamationCircle
} from 'react-icons/fa';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'confirmed':
        return <FaCheckCircle className="status-icon confirmed" />;
      case 'preparing':
        return <FaBox className="status-icon preparing" />;
      case 'out for delivery':
        return <FaTruck className="status-icon out-for-delivery" />;
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      case 'cancelled':
        return <FaExclamationCircle className="status-icon cancelled" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#f59e0b';
      case 'confirmed':
        return '#3b82f6';
      case 'preparing':
        return '#8b5cf6';
      case 'out for delivery':
        return '#f97316';
      case 'delivered':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatOrderItems = (items) => {
    return items.map((item, index) => {
      if (index === items.length - 1) {
        return `${item.name} × ${item.quantity}`;
      } else {
        return `${item.name} × ${item.quantity}, `;
      }
    });
  };

  return (
    <div className='my-orders'>
      <div className="my-orders-header">
        <div className="header-content">
          <FaShoppingBag className="header-icon" />
          <h2>My Orders</h2>
          <span className="order-count">{data.length} orders</span>
        </div>
        <button 
          className="refresh-btn" 
          onClick={fetchOrders}
          disabled={loading}
        >
          <FaUndo className={loading ? "spinning" : ""} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="empty-state">
          <FaBox className="empty-icon" />
          <h3>No orders yet</h3>
          <p>Your order history will appear here</p>
        </div>
      ) : (
        <div className="orders-container">
          {data.map((order, index) => (
            <div key={order._id || index} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <div className="order-icon">
                    <FaBox />
                  </div>
                  <div className="order-meta">
                    <span className="order-id">Order #{order._id?.slice(-8) || `ORD${index + 1}`.padStart(8, '0')}</span>
                    <span className="order-date">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
                <div 
                  className="order-status"
                  style={{ '--status-color': getStatusColor(order.status) }}
                >
                  {getStatusIcon(order.status)}
                  <span>{order.status || 'Pending'}</span>
                </div>
              </div>

              <div className="order-body">
                <div className="order-items">
                  <p className="items-text">
                    {formatOrderItems(order.items)}
                  </p>
                </div>
                
                <div className="order-details">
                  <div className="detail-item">
                    <FaShoppingBag className="detail-icon" />
                    <span>{order.items.length} items</span>
                  </div>
                  <div className="detail-item">
                    <FaDollarSign className="detail-icon" />
                    <span>${order.amount}.00</span>
                  </div>
                </div>
              </div>

              <div className="order-footer">
                <button 
                  className="track-order-btn"
                  onClick={fetchOrders}
                >
                  <FaSearch className="btn-icon" />
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;