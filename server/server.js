import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { createServer } from 'http' // Added for Socket.IO server
import { Server } from 'socket.io' // Added for Socket.IO server
import userRouter from './routes/userRoutes.js'

import connectDB from './config/mongodb.js'
import imageRouter from './routes/imageRoutes.js'
const app = express()
const PORT = process.env.PORT || 4000

const httpServer = createServer(app); // Wrapped Express app with HTTP Server

const io = new Server(httpServer, { // Initialized Socket.IO
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.use(express.json())
app.use(cors())

connectDB()
app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)

// --- NEW SOCKET LOGIC ---
const roomStates = {}; // Tracks memory of prompts and active users per room

io.on("connection", (socket) => {
  
  socket.on("join_room", ({ roomId, userName }) => {
    socket.join(roomId);
    
    // Initialize room if it doesn't exist
    if (!roomStates[roomId]) {
      roomStates[roomId] = { prompt: "", users: [] };
    }
    
    // Add user to memory if not already there
    if (!roomStates[roomId].users.find(u => u.id === socket.id)) {
       roomStates[roomId].users.push({ id: socket.id, name: userName });
    }

    // Send the current room state directly to the user who just joined
    socket.emit("room_state", {
      prompt: roomStates[roomId].prompt,
      users: roomStates[roomId].users,
      message: `Welcome to the room, ${userName}!`
    });

    // Broadcast to everyone else that a new user joined
    socket.to(roomId).emit("user_joined", {
      message: `${userName} has joined the room.`,
      users: roomStates[roomId].users
    });
  });

  socket.on("send_prompt_update", (data) => {
    if (roomStates[data.roomId]) {
      roomStates[data.roomId].prompt = data.prompt;
    }
    socket.to(data.roomId).emit("receive_prompt_update", data.prompt);
  });

  // Notify room to fetch newly generated image
  socket.on("new_image_generated", ({ roomId }) => {
    socket.to(roomId).emit("refresh_gallery");
  });

  socket.on("leave_room", ({ roomId, userName }) => {
    socket.leave(roomId);
    if (roomStates[roomId]) {
       roomStates[roomId].users = roomStates[roomId].users.filter(u => u.id !== socket.id);
       socket.to(roomId).emit("user_left", {
           message: `${userName} left the room.`,
           users: roomStates[roomId].users
       });
    }
  });

  socket.on("disconnect", () => {
    for (const roomId in roomStates) {
        const userIndex = roomStates[roomId].users.findIndex(u => u.id === socket.id);
        if (userIndex !== -1) {
            const user = roomStates[roomId].users[userIndex];
            roomStates[roomId].users.splice(userIndex, 1);
            socket.to(roomId).emit("user_left", {
                message: `${user.name} disconnected.`,
                users: roomStates[roomId].users
            });
        }
    }
  });
});
// --- END SOCKET LOGIC ---

app.get('/', (req, res) => {
  res.send("API Working")
})

httpServer.listen(PORT, () => { // Changed from app.listen to httpServer.listen
  console.log(`Server running on port ${PORT}`)
})