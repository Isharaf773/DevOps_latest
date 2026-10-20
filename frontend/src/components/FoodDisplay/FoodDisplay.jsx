import React, { useContext, useEffect, useState, useRef } from 'react';
import { FaFilter, FaChevronLeft, FaChevronRight, FaSearch, FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { IoOptions } from 'react-icons/io5';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category = "All" }) => {
  const { food_list } = useContext(StoreContext);
  const foodListRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [slideDirection, setSlideDirection] = useState('right');

  // Filter states
  const [sortOrder, setSortOrder] = useState('LowToHigh');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal and temp states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSortOrder, setTempSortOrder] = useState(sortOrder);
  const [tempMinPrice, setTempMinPrice] = useState(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);
  const [tempStockFilter, setTempStockFilter] = useState(stockFilter);
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 768) setItemsPerPage(1);
      else if (width <= 1024) setItemsPerPage(2);
      else if (width <= 1440) setItemsPerPage(3);
      else setItemsPerPage(3);
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const openModal = () => {
    setTempSortOrder(sortOrder);
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
    setTempStockFilter(stockFilter);
    setTempSearchTerm(searchTerm);
    setShowSuggestions(false);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const parsedMin = tempMinPrice !== '' ? parseFloat(tempMinPrice) : 0;
    const parsedMax = tempMaxPrice !== '' ? parseFloat(tempMaxPrice) : Infinity;

    if (parsedMin < 0 || parsedMax < 0) {
      alert('Price cannot be negative.');
      return;
    }

    if (parsedMin > parsedMax) {
      alert('Minimum price cannot be greater than maximum price.');
      return;
    }

    setSortOrder(tempSortOrder);
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setStockFilter(tempStockFilter);
    setSearchTerm(tempSearchTerm);
    setCurrentPage(0);
    closeModal();
  };

  const clearAllFilters = () => {
    setSortOrder('LowToHigh');
    setMinPrice('');
    setMaxPrice('');
    setStockFilter('all');
    setSearchTerm('');
    setCurrentPage(0);
  };

  const suggestions = food_list
    .filter(item => item.name.toLowerCase().includes(tempSearchTerm.toLowerCase()))
    .slice(0, 5);

  const filteredFood = food_list
    .filter(item => category === 'All' || item.category === category)
    .filter(item => {
      const min = minPrice !== '' ? parseFloat(minPrice) : 0;
      const max = maxPrice !== '' ? parseFloat(maxPrice) : Infinity;
      return item.price >= min && item.price <= max;
    })
    .filter(item => {
      if (stockFilter === 'in') return item.available > 0;
      if (stockFilter === 'out') return item.available === 0;
      return true;
    })
    .filter(item => !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const sortedFood = [...filteredFood].sort((a, b) =>
    sortOrder === 'LowToHigh' ? a.price - b.price : b.price - a.price
  );

  const totalPages = Math.ceil(sortedFood.length / itemsPerPage);
  const displayedFood = sortedFood.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const navigateToPage = (newPage) => {
    const direction = newPage > currentPage ? 'left' : 'right';
    setSlideDirection(direction);
    setCurrentPage(newPage);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setSlideDirection('left');
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setSlideDirection('right');
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers with ellipsis for better UX
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(0, currentPage - 2);
      const end = Math.min(totalPages - 1, start + maxVisiblePages - 1);
      
      if (start > 0) {
        pages.push(0);
        if (start > 1) pages.push('ellipsis-start');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        if (end < totalPages - 2) pages.push('ellipsis-end');
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  return (
    <div className='food-display' id='food-display'>
      <div className="food-display-header">
        <h2>Top Dishes Near You</h2>
        <div className="header-actions">
          {(minPrice || maxPrice || searchTerm || sortOrder !== 'LowToHigh') && (
            <button className="clear-filters-btn" onClick={clearAllFilters}>
              <FaTimes className="clear-icon" />
              Clear Filters
            </button>
          )}
          <button className="filters-btn" onClick={openModal}>
            <IoOptions className="filter-icon" />
            Filters
          </button>
        </div>
      </div>

      <div className="food-display-container">
        {/* Left Navigation Arrow */}
        {totalPages > 1 && (
          <button 
            className={`slide-arrow left-arrow ${currentPage === 0 ? 'disabled' : ''}`}
            onClick={prevPage}
            disabled={currentPage === 0}
          >
            <FaChevronLeft className="arrow-icon" />
          </button>
        )}

        {/* Food Items Slider */}
        <div className="food-slider-container">
          <div 
            ref={foodListRef}
            className={`food-display-list ${slideDirection}-slide`}
            key={currentPage} // Force re-render for animation
          >
            {displayedFood.length > 0 ? (
              displayedFood.map((item, index) => (
                <FoodItem
                  key={`${item._id}-${currentPage}-${index}`}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              ))
            ) : (
              <div className="no-results">
                <FaSearch className="no-results-icon" />
                <h3>No dishes found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>

          {/* Dot Indicators */}
          {totalPages > 1 && (
            <div className="slider-indicators">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`indicator-dot ${currentPage === index ? 'active' : ''}`}
                  onClick={() => navigateToPage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Navigation Arrow */}
        {totalPages > 1 && (
          <button 
            className={`slide-arrow right-arrow ${currentPage === totalPages - 1 ? 'disabled' : ''}`}
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
          >
            <FaChevronRight className="arrow-icon" />
          </button>
        )}
      </div>

      {/* Detailed Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {displayedFood.length} of {sortedFood.length} dishes • Page {currentPage + 1} of {totalPages}
          </div>
          <div className="pagination">
            <button
              className={`pagination-arrow prev ${currentPage === 0 ? 'disabled' : ''}`}
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              <FaArrowLeft className="arrow-icon" />
              Previous
            </button>
            
            <div className="page-numbers">
              {getPageNumbers().map((page, index) => 
                page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                  <span key={index} className="page-ellipsis">...</span>
                ) : (
                  <button
                    key={index}
                    className={`page-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => navigateToPage(page)}
                  >
                    {page + 1}
                  </button>
                )
              )}
            </div>

            <button
              className={`pagination-arrow next ${currentPage === totalPages - 1 ? 'disabled' : ''}`}
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
            >
              Next
              <FaArrowRight className="arrow-icon" />
            </button>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <form className="modal-content" onClick={(e) => e.stopPropagation()} onSubmit={handleApplyFilters}>
            <div className="modal-header">
              <h3>
                <FaFilter className="modal-icon" />
                Filter Dishes
              </h3>
              <button type="button" className="close-modal" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <div className="filter-group">
              <div className="filter-item">
                <label className="filter-label">
                  <span className="label-text">Search by Name</span>
                  <div className="input-with-icon">
                    <FaSearch className="input-icon" />
                    <input
                      type="text"
                      value={tempSearchTerm}
                      onChange={(e) => {
                        setTempSearchTerm(e.target.value);
                        setShowSuggestions(true);
                      }}
                      placeholder="Search dishes..."
                      className="filter-input"
                    />
                  </div>
                </label>
                {tempSearchTerm && showSuggestions && suggestions.length > 0 && (
                  <ul className="suggestion-box">
                    {suggestions.map((item) => (
                      <li
                        key={item._id}
                        onClick={() => {
                          setTempSearchTerm(item.name);
                          setShowSuggestions(false);
                        }}
                        className="suggestion-item"
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="filter-row">
                <div className="filter-item">
                  <label className="filter-label">
                    <span className="label-text">Min Price</span>
                    <input
                      type="number"
                      min="0"
                      value={tempMinPrice}
                      onChange={(e) => setTempMinPrice(e.target.value)}
                      placeholder="0"
                      className="filter-input"
                    />
                  </label>
                </div>

                <div className="filter-item">
                  <label className="filter-label">
                    <span className="label-text">Max Price</span>
                    <input
                      type="number"
                      min="0"
                      value={tempMaxPrice}
                      onChange={(e) => setTempMaxPrice(e.target.value)}
                      placeholder="100"
                      className="filter-input"
                    />
                  </label>
                </div>
              </div>

              <div className="filter-item">
                <label className="filter-label">
                  <span className="label-text">Sort By</span>
                  <select 
                    value={tempSortOrder} 
                    onChange={(e) => setTempSortOrder(e.target.value)}
                    className="filter-select"
                  >
                    <option value="LowToHigh">Price: Low to High</option>
                    <option value="HighToLow">Price: High to Low</option>
                  </select>
                </label>
              </div>

              <div className="filter-item">
                <label className="filter-label">
                  <span className="label-text">Availability</span>
                  <select 
                    value={tempStockFilter} 
                    onChange={(e) => setTempStockFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Items</option>
                    <option value="in">In Stock</option>
                    <option value="out">Out of Stock</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="filter-actions">
              <button type="button" className="filter-btn cancel" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="filter-btn apply">
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;