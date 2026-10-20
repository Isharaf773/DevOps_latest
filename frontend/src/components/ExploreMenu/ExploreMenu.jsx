import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';
import { FaUtensils, FaStar, FaArrowRight } from 'react-icons/fa';

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className='explore-menu' id='explore-menu'>
      <div className="explore-menu-header">
        <div className="header-title">
          <FaUtensils className="title-icon" />
          <h1>Explore Our Menu</h1>
        </div>
        <p className='explore-menu-text'>
          Discover our delicious selection of handcrafted dishes made with fresh ingredients and authentic flavors. From traditional favorites to modern creations, there's something for every taste.
        </p>
      </div>
      
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div 
              onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} 
              key={index} 
              className={`explore-menu-list-item ${category === item.menu_name ? "active" : ""}`}
            >
              <div className="menu-image-container">
                <img src={item.menu_image} alt={item.menu_name} />
                <div className="active-indicator">
                  <FaStar className="indicator-icon" />
                </div>
              </div>
              <p>{item.menu_name}</p>
              {category === item.menu_name && (
                <div className="selected-arrow">
                  <FaArrowRight />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="menu-divider">
        <div className="divider-line"></div>
        <div className="divider-icon">
          <FaUtensils />
        </div>
        <div className="divider-line"></div>
      </div>
    </div>
  );
};

export default ExploreMenu;