import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    prompt: { type: String, required: true },
    image: { type: String, required: true },
    roomId: { type: String, default: null }, // NEW: Links image to a specific collab room
    createdAt: { type: Date, default: Date.now, expires: 2592000 }
});

const imageModel = mongoose.models.image || mongoose.model("image", imageSchema);

export default imageModel;