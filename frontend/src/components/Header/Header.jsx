import React, { useState, useEffect } from 'react';
import './Header.css';
import header1 from '../../assets/header1.jpg';
import header2 from '../../assets/header2.png';
import header3 from '../../assets/header3.webp';
import header4 from '../../assets/header4.jpg';
import header5 from '../../assets/header5.jpg';

const Header = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Import your header images
   const headerImages = [header1, header2, header3, header4, header5];
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
              <h2>NOW ORDER</h2>
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