import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Import your header images
  const headerImages = [
    '/src/assets/header1.jpg',
    '/src/assets/header2.png', 
    '/src/assets/header3.webp',
    '/src/assets/header4.jpg',
    '/src/assets/header5.jpg'
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % headerImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [headerImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % headerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + headerImages.length) % headerImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className='header-slider'>
      {/* Slider Container */}
      <div 
        className="slider-container"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {headerImages.map((image, index) => (
          <div 
            key={index} 
            className="slide"
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="header-contents">
              <h2>Order your favourite food here</h2>
              <p>Choose from a wide variety of delicious dishes prepared with the freshest ingredients. From traditional favorites to modern culinary creations, we have something for every palate.</p>
              <button>View Menu</button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="slider-arrow prev-arrow" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="slider-arrow next-arrow" onClick={nextSlide}>
        &#10095;
      </button>

      {/* Slide Indicators */}
      <div className="slide-indicators">
        {headerImages.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Header;