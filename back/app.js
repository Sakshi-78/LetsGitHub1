const path = require('path');
const express = require('express');
const app = express();
const PORT = 4454;
const session = require('express-session');
const passport = require('./passport');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const User= require("./models/users");

require('dotenv').config();

const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    // Your further code here
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });


  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: "http://localhost:3000", // <-- location of the react app were connecting to
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    })
  );
  
  app.use(
    session({
      secret: "sefcndkjfd me",
      resave: true,
      saveUninitialized: true,
    })
  );
  
  app.use(cookieParser("secuhsdjkde"));
  app.use(passport.initialize());
  app.use(passport.session());
  require("./passport");

  app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) res.send("No User Exists");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.send("Successfully Authenticated");
          console.log(req.user);
        });
      }
    })(req, res, next);
  });
  app.post("/register", (req, res) => {
    User.findOne({ username: req.body.username }, async (err, doc) => {
      if (err) throw err;
      if (doc) res.send("User Already Exists");
      if (!doc) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
        const newUser = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        await newUser.save();
        res.send("User Created");
      }
    });
  });
  app.get("/user", (req, res) => {
    res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
  });


