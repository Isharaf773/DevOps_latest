import React, { useContext } from 'react';
import { FaStar, FaPlus, FaMinus, FaShoppingCart, FaFire } from 'react-icons/fa';
import { GiHotSpices } from 'react-icons/gi';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
  
  const {cartItems,addToCart,removeFromCart,url} = useContext(StoreContext);

  return (
    <div className='food-item'>
      <div className="food-item-image-container">
        <img className='food-item-image' src={url+"/images/"+image} alt={name}/>
        <div className="food-item-badge">
          <GiHotSpices className="badge-icon" />
          Popular
        </div>
        <div className="food-item-overlay">
          {!cartItems[id]
            ?<button className='add-to-cart-btn' onClick={()=>addToCart(id)}>
                <FaShoppingCart className="cart-icon" />
                Add to Cart
             </button>
            :<div className='food-item-counter'>
              <button className='counter-btn remove-btn' onClick={()=>removeFromCart(id)}>
                <FaMinus className="counter-icon" />
              </button>
              <p className='counter-value'>{cartItems[id]}</p>
              <button className='counter-btn add-btn' onClick={()=>addToCart(id)}>
                <FaPlus className="counter-icon" />
              </button>
            </div>
          }
        </div>
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <h3 className="food-item-name">{name}</h3>
          <div className="rating-container">
            <div className="stars">
              <FaStar className="star-icon" />
              <FaStar className="star-icon" />
              <FaStar className="star-icon" />
              <FaStar className="star-icon" />
              <FaStar className="star-icon half" />
            </div>
            <span className="rating-text">4.5</span>
          </div>
        </div>
        <p className="food-item-desc">{description}</p>
        <div className="food-item-footer">
          <p className="food-item-price">${price}</p>
          <span className="food-item-category">
            <FaFire className="category-icon" />
            Trending
          </span>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;