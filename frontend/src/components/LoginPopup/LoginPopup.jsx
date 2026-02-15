import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTimes, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken, updateUserProfile, setUser } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onLogin = async (event) => {
    event.preventDefault();

    // Validate input fields
    if (!data.email || !data.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (currState === "Sign Up" && !data.name) {
      toast.error("Please enter your name");
      return;
    }

    // ✅ Local bypass logic for specific email/password
    if (
      currState === "Login" &&
      data.email === "ddddd@gmail.com" &&
      data.password === "1234567890"
    ) {
      toast.success("✅ Logged in successfully!");

      // Simulate setting a token for this case
      const fakeToken = "hardcoded-token";
      setToken(fakeToken);
      localStorage.setItem("token", fakeToken);

      // Set test user data
      const testUserData = {
        email: data.email,
        name: "Test User",
        profileImage: null
      };
      setUser(testUserData);
      localStorage.setItem("userData", JSON.stringify(testUserData));

      setTimeout(() => {
        setShowLogin(false);
      }, 2000);
      return;
    }

    // Proceed with backend API for others
    const newUrl =
      currState === "Login"
        ? `${url}/api/user/login`
        : `${url}/api/user/register`;

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        const successMessage = currState === "Login" 
          ? "✅ Login successful! Welcome back!" 
          : "✅ Registration successful! Welcome!";
        
        toast.success(successMessage);
        
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        
        // Store user data temporarily (fallback approach)
        const userData = {
          email: data.email,
          name: data.name || data.email.split('@')[0],
          profileImage: null
        };
        setUser(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
        
        // Try to load from backend (but don't fail if it doesn't work)
        try {
          const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
          const userResponse = await axios.get(
            `${url}/api/user/profile/${decodedToken.id}`,
            {
              headers: {
                Authorization: `Bearer ${response.data.token}`,
              },
            }
          );
          
          if (userResponse.data.success) {
            setUser(userResponse.data.user);
            localStorage.setItem("userData", JSON.stringify(userResponse.data.user));
          }
        } catch (error) {
          console.log("Backend not available, using fallback user data");
        }

        setTimeout(() => {
          setShowLogin(false);
        }, 2000);
      } else {
        toast.error(`❌ ${response.data.message || "Authentication failed"}`);
      }
    } catch (err) {
      console.error("Login/Register error:", err);
      
      if (err.response) {
        // Server responded with error status
        const errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
        toast.error(`❌ ${errorMessage}`);
      } else if (err.request) {
        // Network error
        toast.error("❌ Network error. Please check your connection and try again.");
      } else {
        // Other error
        toast.error("❌ Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className='login-popup'>
      <div className="login-popup-backdrop" onClick={() => setShowLogin(false)}></div>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-header">
          <div className="login-popup-title">
            <h2>{currState}</h2>
            <p>Welcome back! Please enter your details.</p>
          </div>
          <button 
            type="button" 
            className="login-popup-close" 
            onClick={() => setShowLogin(false)}
          >
            <FaTimes />
          </button>
        </div>

        <div className="login-popup-inputs">
          {currState !== "Login" && (
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                name='name'
                onChange={onChangeHandler}
                value={data.name}
                type="text"
                placeholder='Your full name'
                required
              />
            </div>
          )}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              name='email'
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder='Your email address'
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              name='password'
              onChange={onChangeHandler}
              value={data.password}
              type={showPassword ? "text" : "password"}
              placeholder='Enter your password'
              required
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button type='submit' className="login-popup-submit">
          {currState === "Sign Up" ? "Create account" : "Sign in"}
        </button>

        <div className="login-popup-condition">
          <div className="checkbox-container">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms" className="checkbox-label">
              <span className="checkmark"><FaCheck /></span>
              <p>By continuing, I agree to the <a href="#">terms of use</a> and <a href="#">privacy policy</a>.</p>
            </label>
          </div>
        </div>

        <div className="login-popup-switch">
          {currState === "Login" ? (
            <p>Don't have an account? <span onClick={() => setCurrState("Sign Up")}>Sign up here</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setCurrState("Login")}>Sign in here</span></p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPopup;