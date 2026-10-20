import React, { useContext, useState, useRef, useEffect } from 'react';
import './UserProfile.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import { FaTimes, FaCamera, FaUser, FaSave, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const UserProfile = ({ setShowProfile }) => {
  const { user, url, token, loadUserData, setUser } = useContext(StoreContext);
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    user?.profileImage 
      ? (user.profileImage.startsWith('http') ? user.profileImage : `${url}/${user.profileImage}`)
      : null
  );
  const fileInputRef = useRef(null);

  // Update preview image when user data changes
  useEffect(() => {
    if (user?.profileImage) {
      setPreviewImage(getProfileImageUrl(user.profileImage));
    }
  }, [user?.profileImage, url]);

  // Update form data when user changes
  useEffect(() => {
    setUserData({
      name: user?.name || '',
      email: user?.email || '',
    });
  }, [user]);

  // Helper function to get profile image URL
  const getProfileImageUrl = (profileImage) => {
    if (!profileImage) return null;
    
    if (profileImage.startsWith('http') || profileImage.startsWith('data:')) {
      return profileImage;
    }
    
    if (profileImage.startsWith('profiles/')) {
      return `${url}/${profileImage}`;
    }
    
    return `${url}/profiles/${profileImage}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('❌ Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('❌ Please select a valid image file');
        return;
      }

      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!userData.name.trim()) {
      toast.error('❌ Name is required');
      return;
    }

    try {
      let updatedUser = {
        ...user,
        name: userData.name.trim(),
      };

      // If backend is available and we have a token, try to update via API
      if (token) {
        try {
          const formData = new FormData();
          formData.append('name', userData.name.trim());
          
          if (selectedFile) {
            formData.append('profileImage', selectedFile);
          }

          const response = await axios.put(
            `${url}/api/user/profile`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          if (response.data.success) {
            // Backend update successful
            updatedUser = response.data.user;
            toast.success('✅ Profile updated successfully!');
          } else {
            throw new Error(response.data.message || 'Backend update failed');
          }
        } catch (backendError) {
          console.log('Backend update failed, using localStorage fallback:', backendError.message);
          
          // If we selected a file, use the preview image
          if (selectedFile && previewImage) {
            updatedUser.profileImage = previewImage;
          }
          
          toast.success('✅ Profile updated successfully!');
        }
      } else {
        // No token, use localStorage only
        if (selectedFile && previewImage) {
          updatedUser.profileImage = previewImage;
        }
        toast.success('✅ Profile updated successfully!');
      }

      // Update context and localStorage
      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      
      // Reset selected file
      setSelectedFile(null);
      
      setTimeout(() => {
        setShowProfile(false);
      }, 1500);

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('❌ Failed to update profile. Please try again.');
    }
  };

  return (
    <div className='user-profile-overlay'>
      <div className="user-profile-backdrop" onClick={() => setShowProfile(false)}></div>
      <div className="user-profile-container">
        <div className="user-profile-header">
          <h2>Edit Profile</h2>
          <button 
            type="button" 
            className="user-profile-close" 
            onClick={() => setShowProfile(false)}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSave} className="user-profile-form">
          <div className="profile-image-section">
            <div className="profile-image-container">
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="profile-preview" />
              ) : (
                <div className="profile-placeholder">
                  <FaUser />
                </div>
              )}
            </div>
            
            <div className="profile-image-actions">
              <button 
                type="button" 
                className="image-upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaCamera />
                <span>Upload Photo</span>
              </button>
              
              {previewImage && (
                <button 
                  type="button" 
                  className="image-remove-btn"
                  onClick={handleRemoveImage}
                >
                  <FaTrash />
                  <span>Remove</span>
                </button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <p className="image-help-text">JPG, PNG or GIF (Max 5MB)</p>
          </div>

          <div className="user-profile-inputs">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                disabled
              />
              <small>Email cannot be changed</small>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => setShowProfile(false)}
            >
              Cancel
            </button>
            <button type="submit" className="save-profile-btn">
              <FaSave />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;