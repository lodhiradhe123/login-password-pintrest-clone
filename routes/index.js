var express = require("express");
var router = express.Router();
const userModel = require("./users");
// const postModel = require("./post");
const passport = require("passport");

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/profile", isLoggedIn, function (req, res, next) {
  res.render("profile");
});
router.get("/login", function (req, res, next) {
  console.log();
  res.render("login",{err:req.flash("error")});
});
router.get("/feed", function (req, res, next) {
  res.render("feed");
});

router.post("/register", function (req, res, next) {
  const { username, email, fullName } = req.body;
  const userData = new userModel({ username, email, fullName });
  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
