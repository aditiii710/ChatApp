const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const newChat = document.querySelector(".newchatroom");

const username = window.location.href.split("/")[5];
const room = window.location.href.split("/")[4];

console.log(username, room);

const socket = io();

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  newChat.scrollTop = newChat.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.newmessage.value;
  socket.emit("chatMessage", msg);
  e.target.elements.newmessage.value = "";
  e.target.elements.newmessage.focus();
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta"> ${username} <span> ${message.time} <br> ${message.text}</span></p>`;
  document.querySelector(".chat-messages").appendChild(div);
  console.log(message.text);
}

// module.exports = {
//   room,
// };
