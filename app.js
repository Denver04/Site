const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require('passport-local').Strategy;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(
  session({
    secret: "This is my little secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/VoteDB", { useNewUrlParser: true });

const VoteSchema = new mongoose.Schema({
  username:String,
  Password: String,
  Name: String,
  Age:String,
  nation:String,
  Phn: Number,
  email: String,
  state:String,
  town:String,
  village:String,
  pin:String,

});

VoteSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", VoteSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});


app.get("/profile", function (req, res) {
  res.render("profile");
});

app.get("/intro",function(req,res){
    if(req.isAuthenticated()){
        res.render("intro",{User:req.user});
    }
    else{
        res.redirect("/login")
    }
});

app.get("/votepage",function(req,res){
  res.render("votepage")
})

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/")
})

app.post("/register", function (req, res) {
  const user1=new User({
    username: req.body.username,
    Name: req.body.Name,
    Age:req.body.age,
    nation:req.body.nation,
    Phn:req.body.Phn,
    email:req.body.email,
    state:req.body.state,
    town:req.body.town,
    village:req.body.village,
    pin:req.body.pin
  })
    User.register( user1,req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        
        } else {
          res.redirect("/login");
        }
      }
    );
  });

  app.post('/login',
  passport.authenticate('local', { successRedirect: '/intro',failureRedirect: '/register' }));

  app.get('/logout', function(req,res){
    req.logout();
    res.render("/");
  })
  
  const PORT =3000;

app.listen(PORT, function () {
  console.log("Port is serving at 3000");
})
