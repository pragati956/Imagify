import express from "express";
import {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorpay,verifyRazorpay
} from "../controllers/userController.js";
import userAuth from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/credits", userAuth, userCredits);
userRouter.post("/pay-razor", userAuth, paymentRazorpay);
userRouter.post("/verify-payment",verifyRazorpay );

export default userRouter;
