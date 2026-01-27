import userModel from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

/* ================= AUTH ================= */

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token, user: { name: user.name } });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token, user: { name: user.name } });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const userCredits = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ================= RAZORPAY ================= */

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* CREATE ORDER */
const paymentRazorpay = async (req, res) => {
  try {
    const userId = req.userId;
    const { planId } = req.body;

    if (!userId || !planId) {
      return res.json({ success: false, message: "Missing Details" });
    }

    let credits, plan, amount;

    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 10;
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 50;
        break;
      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 250;
        break;
      default:
        return res.json({ success: false, message: "Plan not found" });
    }

    const transaction = await transactionModel.create({
      userId,
      plan,
      amount,
      credits,
      payment: false,
      date: Date.now(),
    });

    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: transaction._id.toString(),
    });

    res.json({ success: true, order });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* VERIFY PAYMENT */
import crypto from "crypto";

const verifyRazorpay = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // 1️⃣ Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({ success: false, message: "Payment Verification Failed" });
    }

    // 2️⃣ Find transaction using receipt (stored earlier)
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    const transaction = await transactionModel.findById(orderInfo.receipt);

    if (!transaction || transaction.payment) {
      return res.json({ success: false, message: "Invalid Transaction" });
    }

    // 3️⃣ Add credits
    const user = await userModel.findById(transaction.userId);

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance + transaction.credits
    });

    // 4️⃣ Mark transaction as paid
    await transactionModel.findByIdAndUpdate(transaction._id, {
      payment: true
    });

    res.json({ success: true, message: "Credits Added Successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorpay,
  verifyRazorpay,
};
