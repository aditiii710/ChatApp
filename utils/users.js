const Chatbox = require("../models/Chatboxes");

function getCurrentUser(name) {
  return Chatbox.find({ users: req.params.name });
}
