const experss = require("express");
const router = experss.Router();
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");
const Chatbox = require("../models/Chatboxes");
const User = require("../models/Users");
const flash = require("connect-flash");

router.get("/", (req, res) => res.render("login"));

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  /*
   res.render("dashboard", {
     name: req.user.name,
     id: req.user.id,
   });
  */
  Chatbox.find({ users: req.user.name }).exec((err, result) => {
    if (err) {
      res.send("error:" + err);
      // console.log(err);
      // res.render("login");
    } else {
      res.render("dashboard", {
        name: req.user.name,
        email: req.user.email,
        hobbies: req.user.hobbies,
        id: req.user.id,
        result: result,
      });
      console.log(result);
    }
  });
});

router.post("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

router.get("/chatboxes/:name", (req, res) => {
  Chatbox.find({}, "title").exec((err, list_chats) => {
    if (err) {
      return next(err);
    }

    res.render("chatboxes", {
      list_chats: list_chats,
      name: req.params.name,
    });
  });
});

router.get("/profile/:name", (req, res, next) => {
  User.find({ name: req.params.name }).exec((err, result) => {
    console.log(result);
    res.render("profile", {
      result: result[0],
    });
  });
});

router.get("/leave/:name", (req, res, next) => {
  // res.send("hello");
  Chatbox.findOneAndUpdate(
    { users: req.params.name },
    { $pull: { users: req.params.name } },
    { new: true },
    function (err, value) {
      console.log(value);
      Chatbox.find({}, "title").exec((err, list_chats) => {
        res.render("chatboxes", {
          list_chats: list_chats,
          name: req.params.name,
        });
      });
    }
  );
});

router.get("/chatroom/:id/:name", (req, res, next) => {
  Chatbox.find({ _id: req.params.id, users: req.params.name }).exec(
    (err, result) => {
      console.log(result);
      if (result.length > 0) {
        req.flash("error_msg", "You are already a part of the chat room");
        res.render("chatroom", {
          result: result[0],
          name: req.params.name,
        });
      } else {
        Chatbox.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { users: req.params.name } },
          { upsert: true, new: true },
          function (err, value) {
            if (err) {
              return next(err);
            } else {
              console.log("value: " + value.title);
              req.flash("error_msg", "You are added to the chat room");
              res.render("chatroom", {
                result: value,
                name: req.params.name,
              });
            }
          }
        );
      }
    }
  );
});

module.exports = router;
