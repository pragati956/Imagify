import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    prompt: { type: String, required: true },
    image: { type: String, required: true }, // Storing base64
    createdAt: { type: Date, default: Date.now, expires: 2592000 } // Auto-deletes after 30 days (seconds)
});

const imageModel = mongoose.models.image || mongoose.model("image", imageSchema);

export default imageModel;