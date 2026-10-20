import express from "express"
import { loginUser, registerUser, getUserProfile, updateUserProfile } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js"
import upload from "../middleware/upload.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/profile/:userId", authMiddleware, getUserProfile)
userRouter.put("/profile", authMiddleware, upload.single('profileImage'), updateUserProfile)

export default userRouter