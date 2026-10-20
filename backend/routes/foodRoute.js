import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { addFood, listFood, removeFood, updateFood } from "../controllers/foodController.js";

const foodRouter = express.Router();

// Ensure uploads folder exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Image storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Check if file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    }
});

// Routes
foodRouter.post("/add", upload.single("image"), addFood);  // Add new food
foodRouter.get("/list", listFood);                         // List all foods
foodRouter.post("/remove", removeFood);                    // Remove food
foodRouter.put("/update", upload.single("image"), updateFood); // Update food

export default foodRouter;