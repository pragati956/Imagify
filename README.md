# 🎨 Imagify — AI Text to Image Generator

Imagify is a full-stack **MERN-based AI image generation platform** that converts text prompts into images using AI.  
It features **secure authentication**, a **credit-based usage system**, and **Razorpay-powered payments** for purchasing credits.

---

## 🚀 Features

- 🔐 User authentication with JWT
- 🖼️ AI-powered text-to-image generation
- 💳 Credit-based image generation system
- 💰 Razorpay integration (test mode) for purchasing credits
- ✅ Secure payment verification
- 📊 Real-time credit balance updates
- 📱 Fully responsive UI

---

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- Framer Motion
- Axios

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Razorpay (Test Mode)

### Tools
- Postman (API testing)
- Git & GitHub

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/pragati956/imagify.git
cd imagify
2️⃣ Backend Setup
cd server
npm install

Create a .env file inside server:

PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxx

Run backend:

npm run dev
3️⃣ Frontend Setup
cd client
npm install

Create a .env file inside client:

VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx

Run frontend:

npm run dev
💳 Razorpay Test Payment Details
Use these test credentials only:

UPI
success@razorpay
Card
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
OTP: 123456
📂 Project Structure
imagify/
│
├── client/        # React frontend
│
├── server/        # Node.js backend
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│
└── README.md

🔒 Security Notes
Razorpay is used in test mode only
API keys are stored securely using environment variables
.env files are excluded from version control
🌱 Future Improvements
Image generation history
Prompt templates & style presets
Transaction history page
Razorpay webhooks
Admin dashboard

👩‍💻 Author
Pragati Singh
MCA first year| MNNIT
📍 Prayagraj, India

⭐ Acknowledgements
Razorpay Documentation
MongoDB Atlas
Open-source community
