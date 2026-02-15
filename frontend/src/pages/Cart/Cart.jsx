import React, { useContext, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import './Cart.css'
import { useNavigate } from 'react-router-dom'
import { FaTrash, FaArrowLeft, FaTag, FaShoppingBag, FaTruck, FaCreditCard } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext)
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)

  const handlePromoCode = () => {
    // Simple promo code validation - you can extend this
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(10)
      alert('Promo code applied! 10% discount added.')
    } else if (promoCode.toUpperCase() === 'WELCOME5') {
      setDiscount(5)
      alert('Promo code applied! $5 discount added.')
    } else {
      alert('Invalid promo code')
    }
    setPromoCode('')
  }

  const subtotal = getTotalCartAmount()
  const deliveryFee = subtotal === 0 ? 0 : 2
  const discountAmount = discount > 0 && discount < 10 ? discount : (subtotal * discount) / 100
  const total = subtotal === 0 ? 0 : subtotal + deliveryFee - discountAmount

  return (
    <div className='cart'>
      <div className="cart-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Continue Shopping
        </button>
        <h1><FaShoppingBag /> Your Shopping Cart</h1>
        <div className="cart-summary-badge">
          {Object.keys(cartItems).length} items
        </div>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          <div className="cart-items-title">
            <p>Product</p>
            <p>Details</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Action</p>
          </div>
          <div className="cart-items-container">
            {food_list.map((item, index) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div key={item._id} className="cart-item">
                    <div className='cart-items-title cart-items-item'>
                      <div className="product-image">
                        <img src={url + "/images/" + item.image} alt={item.name} />
                      </div>
                      <div className="product-details">
                        <p className="product-name">{item.name}</p>
                        <p className="product-category">{item.category}</p>
                      </div>
                      <p className="product-price">${item.price}</p>
                      <div className="quantity-display">
                        <span>{cartItems[item._id]}</span>
                      </div>
                      <p className="item-total">${item.price * cartItems[item._id]}</p>
                      <button 
                        className='remove-btn' 
                        onClick={() => removeFromCart(item._id)}
                        aria-label="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <hr />
                  </div>
                )
              }
              return null
            })}
            
            {Object.keys(cartItems).length === 0 && (
              <div className="empty-cart">
                <FaShoppingBag size={48} />
                <h3>Your cart is empty</h3>
                <p>Add some delicious items to get started!</p>
                <button onClick={() => navigate('/')} className="shop-now-btn">
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>

        {Object.keys(cartItems).length > 0 && (
          <div className="cart-sidebar">
            <div className='cart-total'>
              <h2><FaCreditCard /> Order Summary</h2>
              <div className="summary-details">
                <div className="cart-total-details">
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <div className="cart-total-details">
                  <p><FaTruck /> Delivery Fee</p>
                  <p>${deliveryFee.toFixed(2)}</p>
                </div>
                {discount > 0 && (
                  <div className="cart-total-details discount">
                    <p>Discount</p>
                    <p>-${discountAmount.toFixed(2)}</p>
                  </div>
                )}
                <div className="cart-total-details grand-total">
                  <b>Total</b>
                  <b>${total.toFixed(2)}</b>
                </div>
              </div>
              <button 
                onClick={() => navigate('/order')} 
                className="checkout-btn"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>

            <div className='cart-promocode'>
              <div className="promo-section">
                <h3><FaTag /> Promo Code</h3>
                <p>Enter your promo code for discounts</p>
                <div className='cart-promocode-input'>
                  <input 
                    type="text" 
                    placeholder='Enter promo code' 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button onClick={handlePromoCode}>Apply</button>
                </div>
                <div className="promo-hint">
                  <small>Try: SAVE10 or WELCOME5</small>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart