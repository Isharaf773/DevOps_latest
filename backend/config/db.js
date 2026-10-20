import mongoose from "mongoose";

// Connection string comes from the environment (MONGO_URI). Never hardcode credentials here.
export const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("MONGO_URI is not set. Copy .env.example to .env and fill it in.");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
        console.log("DB connected");
    } catch (err) {
        console.error("DB connection error:", err.message);
    }
};
