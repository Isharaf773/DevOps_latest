import { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create context
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [user, setUser] = useState(null);

  // Add to cart
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("Add to cart failed:", err);
      }
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId) => {
    if (!cartItems[itemId] || cartItems[itemId] <= 0) return;

    setCartItems((prev) => {
      const updated = { ...prev };
      updated[itemId] -= 1;
      if (updated[itemId] === 0) {
        delete updated[itemId];
      }
      return updated;
    });

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("Remove from cart failed:", err);
      }
    }
  };

  // Get total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  // Fetch food list from backend
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch food list:", error);
    }
  };

  // Load user data from backend API
  const loadUserData = async (tokenParam = null) => {
    const storedToken = tokenParam || localStorage.getItem("token");
    if (!storedToken) {
      // Try to load from localStorage as fallback
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
      const response = await axios.get(
        `${url}/api/user/profile/${decodedToken.id}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      // Fallback to localStorage
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  };

  // Update user profile with backend API
  const updateUserProfile = async (userData) => {
    try {
      const response = await axios.put(
        `${url}/api/user/profile`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Fallback to localStorage
      setUser(userData);
      localStorage.setItem("userData", JSON.stringify(userData));
      return { success: false, message: "Failed to update profile" };
    }
  };

  // Load cart data from server using token
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Failed to load cart data:", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
        await loadUserData(storedToken); // Load user data from backend
      } else {
        // If no token, try to load user data from localStorage
        await loadUserData();
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    user,
    setUser,
    updateUserProfile,
    loadUserData,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
