const mongoose = require("mongoose");
const messageModel = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
    content: { type: String, trim: true },
  
    // chat -> reference from which chat it belongs to
    chat: {
        type: mongoose.Schema.Types.ObjectId, ref: "Chat"
         
    }
},
  {
    timestamps: true
  }
);

const Message = new mongoose.model("Message", messageModel);
module.exports = Message;
