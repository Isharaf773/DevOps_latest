import userModal from "../models/userModel.js"; // Import the User model to interact with the database
import jwt from "jsonwebtoken"; // Import JWT for creating authentication tokens
import bcrypt from "bcrypt"; // Import bcrypt for password hashing and comparison
import validator from "validator"; // Import validator for email validation

// Helper: Create JWT Token
const createToken = (id) => {
    // Create a JWT token with the user's ID as payload, using secret from environment variables
    // Token will expire in 3 days for security reasons
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// Login user
const loginUser = async (req, res) => {
    // Extract email and password from request body
    const { email, password } = req.body;

    try {
        // Find user in database by email
        const user = await userModal.findOne({ email });

        // If user doesn't exist, return error response
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        // Compare provided password with hashed password in database
        const match = await bcrypt.compare(password, user.password);

        // If passwords don't match, return error response
        if (!match) {
            return res.status(400).json({ success: false, message: "Incorrect password." });
        }

        // If authentication successful, create JWT token
        const token = createToken(user._id);
        
        // Return success response with the token
        res.status(200).json({ success: true, token });

    } catch (error) {
        // Log any errors and return server error response
        console.error(error);
        res.status(500).json({ success: false, message: "Login failed. Server error." });
    }
};

// Register user
const registerUser = async (req, res) => {
    // Extract name, password, and email from request body
    const { name, password, email } = req.body;

    try {
        // Check if user with this email already exists
        const exists = await userModal.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists." });
        }

        // Validate email format using validator
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email." });
        }

        // Check if password meets minimum length requirement
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
        }

        // Generate salt for password hashing
        const salt = await bcrypt.genSalt(10);
        
        // Hash the password with the generated salt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user instance with hashed password
        const newUser = new userModal({
            name,
            email,
            password: hashedPassword
        });

        // Save the new user to the database
        const user = await newUser.save();
        
        // Create JWT token for the new user
        const token = createToken(user._id);

        // Return success response with the token
        res.status(201).json({ success: true, token });

    } catch (error) {
        // Log any errors and return server error response
        console.error(error);
        res.status(500).json({ success: false, message: "Registration failed. Server error." });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        // Get user ID from URL parameters
        const { userId } = req.params;
        
        // Find user by ID, excluding password field
        const user = await userModal.findById(userId).select("-password");
        
        // If user doesn't exist, return error response
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        
        // Return user profile data
        res.status(200).json({ success: true, user });
        
    } catch (error) {
        // Log any errors and return server error response
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to get user profile." });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        // Get user ID from token (added by auth middleware)
        const userId = req.userId;
        const { name } = req.body;
        
        // Validate input
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Name is required." });
        }
        
        // Prepare update data
        const updateData = { 
            name: name.trim()
        };
        
        // If a file was uploaded, add the profile image path
        if (req.file) {
            updateData.profileImage = `profiles/${req.file.filename}`;
        }
        
        // Update user profile
        const updatedUser = await userModal.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, select: "-password" }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        
        res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully.",
            user: updatedUser 
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update profile." });
    }
};

// Export the login, register, getUserProfile, and updateUserProfile functions
export { loginUser, registerUser, getUserProfile, updateUserProfile };