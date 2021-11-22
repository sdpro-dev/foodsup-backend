require('dotenv').config();
const express = require("express");
const cors = require('cors');
const expressValidator = require("express-validator");
const mongoose = require("mongoose");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const session = require("express-session");

/* Loads all variables from .env file to "process.env" */
// npm instsall dotenv
// require("dotenv").config();

require("./models/Company");
require("./models/User");
require("./models/FoodItem");

const routes = require("./routes");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const ROOT_URL = dev ? `http://localhost:${port}` : process.env.PRODUCTION_URL;
const server = express();
server.use(cors());

const mongooseOptions = {};
mongoose
    .connect(
        process.env.MONGODB_URI,
        mongooseOptions
    )
    .then(() => console.log("DB connected"));

mongoose.connection.on("error", err => {
    console.log(`DB connection error: ${err.message}`);
});


if(!dev) {
    /* Helmet helps secure our app by setting various HTTP headers */
    server.use(helmet());
    /* Compression gives us gzip compression */
    server.use(compression());
}

/* Body Parser built-in to Express as of version 4.16 */
server.use(express.json());

/* Express Validator will validate form data sent to the backend */
// server.use(expressValidator());

/* apply routes from the "routes" folder */
server.use("/", routes);

server.get("/static/*", (req, res) => {
    handle(req, res);
});

const sessionConfig = {
    name: "next-connect.sid",
    // secret used for using signed cookies w/ the session
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      mongoUrl: 'mongodb+srv://sdpro:12a12b123!!@cluster0.tq05v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60 // save session for 14 days
    }),
    // forces the session to be saved back to the store
    resave: false,
    // don't save unmodified sessions
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14 // expires in 14 days
    }
  };

if (!dev) {
sessionConfig.cookie.secure = true; // serve secure cookies in production environment
server.set("trust proxy", 1); // trust first proxy
}

/* Apply our session configuration to express-session */
server.use(session(sessionConfig));

/* Add passport middleware to set passport up */
server.use(passport.initialize());
server.use(passport.session());
    
server.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on ${ROOT_URL}`);
});