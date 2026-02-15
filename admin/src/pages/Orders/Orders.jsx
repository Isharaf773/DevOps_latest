import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders.");
      }
    } catch (error) {
      toast.error("Error fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Status updated successfully.");
      }
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const response = await axios.post(url + "/api/order/delete", {
          orderId,
        });
        if (response.data.success) {
          toast.success("Order deleted successfully.");
          await fetchAllOrders();
        } else {
          toast.error("Failed to delete order.");
        }
      } catch (error) {
        toast.error("Error deleting order.");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Food Processing':
        return '#ffa500';
      case 'Out For Delivery':
        return '#007bff';
      case 'Delivered':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2 className="orders-title">Order Management</h2>
        <p className="orders-subtitle">Manage and track customer orders</p>
        <div className="orders-stats">
          <div className="stat-card">
            <span className="stat-number">{orders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {orders.filter(order => order.status === 'Delivered').length}
            </span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      <div className="orders-content">
        {orders.length === 0 ? (
          <div className="empty-state">
            <img src={assets.parcel_icon} alt="No orders" />
            <h3>No Orders Found</h3>
            <p>There are no orders to display at the moment.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <div className="order-icon">
                      <img src={assets.parcel_icon} alt="Order" />
                    </div>
                    <div>
                      <h4 className="order-id">Order #{order._id.slice(-8).toUpperCase()}</h4>
                      <div 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </div>
                    </div>
                  </div>
                  <div className="order-amount">₹{order.amount}</div>
                </div>

                <div className="order-details">
                  <div className="detail-section">
                    <h5>Items Ordered</h5>
                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <span key={index} className="order-item">
                          {item.name} × {item.quantity}
                          {index !== order.items.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h5>Customer Information</h5>
                    <p className="customer-name">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p className="customer-phone">{order.address.phone}</p>
                  </div>

                  <div className="detail-section">
                    <h5>Delivery Address</h5>
                    <div className="address">
                      <p>{order.address.street},</p>
                      <p>
                        {order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipcode}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="order-actions">
                  <select 
                    className="status-select"
                    onChange={(event) => statusHandler(event, order._id)} 
                    value={order.status}
                    style={{ borderColor: getStatusColor(order.status) }}
                  >
                    <option value="Food Processing">Food Processing</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteOrder(order._id)}
                    title="Delete Order"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;