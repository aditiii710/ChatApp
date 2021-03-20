const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const flash = require("connect-flash");

const User = require("../models/Users");
const Chatbox = require("../models/Chatboxes");

router.get("/register", (req, res) => res.render("register"));

router.post("/register", (req, res) => {
  const { name, email, password, password2, hobbies } = req.body;
  let errors = [];

  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email is already in use" });
        res.render("register", {
          errors,
          name,
        });
      } else {
        User.findOne({ name: name }).then((user) => {
          if (user) {
            errors.push({ msg: "Username already in use" });
            res.render("register", {
              errors,
            });
          } else {
            const newUser = new User({
              name,
              email,
              password,
              hobbies,
            });

            bcrypt.genSalt(10, (err, salt) =>
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;

                newUser.password = hash;
                newUser
                  .save()
                  .then((user) => {
                    req.flash(
                      "success_msg",
                      "You are now registered and can log in"
                    );
                    res.redirect("/");
                  })
                  .catch((err) => console.log(err));
              })
            );
          }
        });
      }
    });
  }
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: "Invalid Username or Password",
  }),
  (req, res, next) => {
    res.redirect("/");
  }
);

// router.get("/chatboxes", (req, res, next) => {
//   console.log("abcd");
//   Chatbox.find({}, "title").exec((err, list_chats) => {
//     if (err) {
//       return next(err);
//     }

//     res.render("chatboxes", {
//       list_chats: list_chats,
//     });
//   });
// });

router.post("/chatboxes/:name", (req, res) => {
  const { title, description } = req.body;
  let errors = [];
  Chatbox.findOne({ title: title }).then((chatbox) => {
    if (chatbox) {
      errors.push({ msg: "A chatbox with this name already exists." });
      // res.render("chatboxes", {
      //   errors,
      // });
      Chatbox.find({}, "title").exec((err, list_chats) => {
        if (err) {
          return next(err);
        }

        res.render("chatboxes", {
          errors,
          list_chats: list_chats,
          name: req.params.name,
        });
      });
    } else {
      const newChatbox = new Chatbox({
        title,
        description,
      });
      newChatbox.save().then((chatbox) => {
        console.log(req.body);
        req.flash("success_msg", "Chatbox created");
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
    }
  });
});

module.exports = router;
