import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://foodstack:123456789ABC@cluster0.meh5b9n.mongodb.net/food");
        console.log("DB connected");
    } catch (err) {
        console.error("DB connection error:", err);
    }
};
