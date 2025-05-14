const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  messages: [
    {
      text: String,
      sender: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});
module.exports = mongoose.model("Chat", ChatSchema);
