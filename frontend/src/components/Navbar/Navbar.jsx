import React, { useContext, useState, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import UserProfile from '../UserProfile/UserProfile'
import { toast } from 'react-toastify'

const Navbar = ({setShowLogin}) => {
  const [menu, setMenu] = useState("home");
  const [showProfile, setShowProfile] = useState(false);
  const {getTotalCartAmount, token, setToken, user, setUser, url} = useContext(StoreContext);
  const navigate = useNavigate();

  // Force re-render when user data changes
  useEffect(() => {
    // This effect will trigger when user data changes
  }, [user]);

  // Helper function to get profile image URL
  const getProfileImageUrl = (profileImage) => {
    if (!profileImage) return null;
    
    // If it's already a complete URL (starts with http), return as is
    if (profileImage.startsWith('http')) {
      return profileImage;
    }
    
    // If it's a data URL (base64), return as is
    if (profileImage.startsWith('data:')) {
      return profileImage;
    }
    
    // If it starts with 'profiles/', construct full URL
    if (profileImage.startsWith('profiles/')) {
      return `${url}/${profileImage}`;
    }
    
    // Otherwise, assume it's a filename and add profiles/ prefix
    return `${url}/profiles/${profileImage}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setToken("");
    setUser(null);
    toast.success("👋 Successfully logged out!");
    navigate("/");
  }

  return (
    <div className='navbar'>
      <div className="navbar-container">
        <Link to='/' onClick={() => setMenu("home")}>
          <img src={assets.logo} alt="Company Logo" className="logo" />
        </Link>
        
        <ul className="navbar-menu">
          <li>
            <Link 
              to='/' 
              onClick={() => setMenu("home")} 
              className={menu === "home" ? "active" : ""}
            >
              Home
            </Link>
          </li>
          <li>
            <a 
              href='#explore-menu' 
              onClick={() => setMenu("menu")} 
              className={menu === "menu" ? "active" : ""}
            >
              Menu
            </a>
          </li>
          <li>
            <a 
              href='#app-download' 
              onClick={() => setMenu("mobile")} 
              className={menu === "mobile" ? "active" : ""}
            >
              Mobile App
            </a>
          </li>
          <li>
            <a 
              href='#footer'  
              onClick={() => setMenu("contact-us")} 
              className={menu === "contact-us" ? "active" : ""}
            >
              Contact Us
            </a>
          </li>
        </ul>

        <div className="navbar-right">
          <div className="navbar-search">
            <img src={assets.search_icon} alt="Search" className="search-icon" />
          </div>
          
          <div className="navbar-cart">
            <Link to='/cart'>
              <img src={assets.basket_icon} alt="Shopping Cart" />
            </Link>
            <div className={`cart-indicator ${getTotalCartAmount() === 0 ? "" : "active"}`}>
              {getTotalCartAmount() > 0 && getTotalCartAmount()}$
            </div>
          </div>

          {!token ? (
            <button 
              className="signin-btn" 
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </button>
          ) : (
            <div className='navbar-profile'>
              {user?.profileImage ? (
                <img 
                  src={getProfileImageUrl(user.profileImage)} 
                  alt="Profile" 
                  className="profile-icon user-profile-image"
                  onError={(e) => {
                    console.error('Profile image failed to load:', user.profileImage);
                    e.target.src = assets.profile_icon;
                    e.target.classList.remove('user-profile-image');
                  }}
                />
              ) : (
                <img src={assets.profile_icon} alt="Profile" className="profile-icon"/>
              )}
              <ul className="nav-profile-dropdown">
                {user && (
                  <>
                    <li className="user-info">
                      <div className="user-avatar">
                        {user.profileImage ? (
                          <img 
                            src={getProfileImageUrl(user.profileImage)} 
                            alt="Profile"
                            onError={(e) => {
                              console.error('Dropdown profile image failed to load:', user.profileImage);
                              e.target.src = assets.profile_icon;
                            }}
                          />
                        ) : (
                          <img src={assets.profile_icon} alt="Profile" />
                        )}
                      </div>
                      <div className="user-details">
                        <p className="user-name">{user.name || 'User'}</p>
                        <p className="user-email">{user.email || 'user@example.com'}</p>
                      </div>
                    </li>
                    <hr/>
                  </>
                )}
                <li onClick={() => setShowProfile(true)}>
                  <img src={assets.profile_icon} alt="Edit Profile"/>
                  <p>Edit Profile</p>
                </li>
                <li onClick={() => navigate('/myorders')}>
                  <img src={assets.bag_icon} alt="Orders"/>
                  <p>My Orders</p>
                </li>
                <hr/>
                <li onClick={logout}>
                  <img src={assets.logout_icon} alt="Logout"/>
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-btn">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* User Profile Modal */}
      {showProfile && <UserProfile setShowProfile={setShowProfile} />}
    </div>
  )
}

export default Navbar