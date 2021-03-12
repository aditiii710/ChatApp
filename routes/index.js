const experss = require("express");
const router = experss.Router();
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");
const Chatbox = require("../models/Chatboxes");
const flash = require("connect-flash");

router.get("/", (req, res) => res.render("login"));

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  // res.render("dashboard", {
  //   name: req.user.name,
  //   id: req.user.id,
  // });
  Chatbox.find({ users: req.user.name }).then((err, result) => {
    if (err) {
      res.send("error" + err);
      // console.log(err);
      // res.render("login");
    } else {
      res.render("dashboard", {
        name: req.user.name,
        id: req.user.id,
      });
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

router.get("/chatroom/:id/:name", (req, res, next) => {
  Chatbox.findById(req.params.id).exec((err, result) => {
    Chatbox.find({ users: req.params.name }).then((user) => {
      if (user) {
        req.flash("error_msg", "You are already a part of the chat room");
        res.render("chatroom", {
          result: result,
          name: req.params.name,
        });
      } else {
        Chatbox.updateOne(
          { _id: req.params.id },
          { $push: { users: req.params.name } }
        );
        if (err) {
          return next(err);
        } else {
          res.render("chatroom", {
            result: result,
            name: req.params.name,
          });
          console.log(result);
        }
      }
    });
  });
});

module.exports = router;
