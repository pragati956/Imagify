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

// Socket.IO event handling logic
io.on("connection", (socket) => {
  
  socket.on("join_room", ({ roomId, userName }) => {
    socket.join(roomId);
    // Notify others in the room
    socket.to(roomId).emit("user_joined", `${userName} has joined the room.`);
  });

  socket.on("send_prompt_update", (data) => {
    // Broadcast prompt changes to everyone else in the room
    socket.to(data.roomId).emit("receive_prompt_update", data.prompt);
  });

  socket.on("leave_room", ({ roomId, userName }) => {
    socket.leave(roomId);
    socket.to(roomId).emit("user_left", `${userName} left the room.`);
  });

});

app.get('/', (req, res) => {
  res.send("API Working")
})

httpServer.listen(PORT, () => { // Changed from app.listen to httpServer.listen
  console.log(`Server running on port ${PORT}`)
})