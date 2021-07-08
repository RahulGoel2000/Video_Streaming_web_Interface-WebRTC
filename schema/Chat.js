const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    RoomId: {
      type: String
    },
    message: {
      type: String
    },
    sender: {
      type: String
    },
    UserID: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

let Chat = mongoose.model("theChat", chatSchema);

module.exports = Chat;
