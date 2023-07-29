if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const methodOverride = require("method-override");
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");

initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(flash());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false, //Nothing is saved if no changes
    saveUninitialized: false, // nothing is saved if no changes
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

//Creating the login post
app.post(
  "/login",
  checknotAuth,
  passport.authenticate("local", {
    successRedirect: "/home_page",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
//crestion the resgister post request
const users = [];
app.post("/register", checknotAuth, async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    // const hashPassword = "password";
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });
    console.log(users);
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.redirect("/register");
  }
});

//creating the different routers
app.get("/home_page", checkAuth, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});
app.get("/", checknotAuth, (req, res) => {
  res.render("login.ejs");
});
app.get("/login", checknotAuth, (req, res) => {
  res.render("login.ejs");
});
app.get("/register", checknotAuth, (req, res) => {
  res.render("register.ejs");
});

app.delete("/logout", (req, res) => {
  req.logOut(req.user, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});
// module.exports = users;

//To make users that only the authenticated user can access the website
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checknotAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/home_page");
}

console.log(users);
app.listen(3000);
