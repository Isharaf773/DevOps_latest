import foodModel from "../models/foodmodel.js";
import fs from "fs";
import path from "path";

// Add food
const addFood = async (req, res) => {
    try {
        const image_filename = req.file?.filename;

        if (!image_filename) {
            return res.status(400).json({ success: false, message: "Image is required." });
        }

        // Validate required fields
        const { name, description, price, category } = req.body;
        if (!name || !price || !category) {
            // Delete uploaded file if validation fails
            fs.unlink(path.join("uploads", image_filename), () => {});
            return res.status(400).json({ 
                success: false, 
                message: "Name, price, and category are required fields." 
            });
        }

        const food = new foodModel({
            name: name.trim(),
            description: description?.trim() || "",
            price: parseFloat(price),
            category: category.trim(),
            image: image_filename
        });

        await food.save();
        
        res.status(201).json({ 
            success: true, 
            message: "Food added successfully.", 
            data: food 
        });

    } catch (error) {
        // Clean up uploaded file if error occurs
        if (req.file?.filename) {
            fs.unlink(path.join("uploads", req.file.filename), () => {});
        }
        
        console.error("Add food error:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: "Validation error",
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Server error while adding food." 
        });
    }
};

// List all foods
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({}).sort({ createdAt: -1 });
        res.json({ 
            success: true, 
            data: foods,
            count: foods.length 
        });
    } catch (error) {
        console.error("List food error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching food list",
            error: error.message 
        });
    }
};

// Remove food
const removeFood = async (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: "Food ID is required" 
            });
        }

        const food = await foodModel.findById(id);
        
        if (!food) {
            return res.status(404).json({ 
                success: false, 
                message: "Food not found" 
            });
        }

        // Delete the associated image file
        const imagePath = path.join("uploads", food.image);
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error deleting image file:", err);
            });
        }

        await foodModel.findByIdAndDelete(id);
        
        res.json({ 
            success: true, 
            message: "Food removed successfully" 
        });

    } catch (error) {
        console.error("Remove food error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error deleting food item",
            error: error.message 
        });
    }
};

// Update food
const updateFood = async (req, res) => {
    try {
        const { id, name, description, price, category } = req.body;
        
        if (!id) {
            // Delete uploaded file if validation fails
            if (req.file?.filename) {
                fs.unlink(path.join("uploads", req.file.filename), () => {});
            }
            return res.status(400).json({ 
                success: false, 
                message: "Food ID is required" 
            });
        }

        // Find the existing food item
        const existingFood = await foodModel.findById(id);
        if (!existingFood) {
            // Delete uploaded file if food not found
            if (req.file?.filename) {
                fs.unlink(path.join("uploads", req.file.filename), () => {});
            }
            return res.status(404).json({ 
                success: false, 
                message: "Food not found" 
            });
        }

        let image_filename = existingFood.image;

        // If new image is uploaded, handle it
        if (req.file) {
            // Delete old image if it exists
            const oldImagePath = path.join("uploads", existingFood.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error("Error deleting old image:", err);
                });
            }
            image_filename = req.file.filename;
        }

        // Prepare update data
        const updateData = {
            name: name?.trim() || existingFood.name,
            description: description?.trim() || existingFood.description,
            price: price ? parseFloat(price) : existingFood.price,
            category: category?.trim() || existingFood.category,
            image: image_filename,
            updatedAt: new Date()
        };

        // Validate required fields
        if (!updateData.name || !updateData.price || !updateData.category) {
            // Delete uploaded file if validation fails
            if (req.file?.filename) {
                fs.unlink(path.join("uploads", req.file.filename), () => {});
            }
            return res.status(400).json({ 
                success: false, 
                message: "Name, price, and category are required fields." 
            });
        }

        // Update food item
        const updatedFood = await foodModel.findByIdAndUpdate(
            id,
            updateData,
            { 
                new: true, 
                runValidators: true 
            }
        );

        res.json({ 
            success: true, 
            message: "Food updated successfully", 
            data: updatedFood 
        });

    } catch (error) {
        // Clean up uploaded file if error occurs
        if (req.file?.filename) {
            fs.unlink(path.join("uploads", req.file.filename), () => {});
        }
        
        console.error("Update food error:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: "Validation error",
                error: error.message 
            });
        }
        
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid food ID" 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Error updating food item",
            error: error.message 
        });
    }
};

// Export the food controller functions
export { addFood, listFood, removeFood, updateFood };