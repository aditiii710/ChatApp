const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const formatMessage = require("./utils/messages");
const db = require("./config/keys").mongoURI;
const passport = require("passport");
require("./config/passport")(passport);

app.use(express.static("public"));

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("MonogDB connected..."))
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log("New WS connection...");

  // socket.emit("message", "Welcome");

  socket.on("chatMessage", (msg) => {
    console.log(msg);
    io.emit("message", formatMessage("USER", msg));
  });
});

app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

// const PORT = process.env.PORT || 3002;

// app.listen(PORT, console.log(`Server started on port ${PORT}`));

server.listen(process.env.PORT || 3000, () => {
  console.log("Server started at port 3000");
});
