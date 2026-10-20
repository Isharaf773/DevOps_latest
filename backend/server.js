import 'dotenv/config';
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// App configuration
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static images
app.use("/images", express.static("uploads"));
app.use("/profiles", express.static("uploads/profiles"));

// Connect to MongoDB
connectDB();

// API routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Test route
app.get("/", (req, res) => {
    res.send("API working");
});

// Health endpoint used by Docker / Jenkins / load balancers
app.get("/health", (req, res) => {
    const dbReady = mongoose.connection.readyState === 1;
    res.status(dbReady ? 200 : 503).json({
        status: dbReady ? "ok" : "degraded",
        db: dbReady ? "connected" : "disconnected",
        uptime: Math.round(process.uptime()),
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
