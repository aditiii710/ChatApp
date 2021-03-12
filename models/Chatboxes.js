const mongoose = require("mongoose");

const ChatboxSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  users: {
    type: Array,
    require: true,
  },
});

const Chatbox = mongoose.model("Chatbox", ChatboxSchema);

module.exports = Chatbox;
