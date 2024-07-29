const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const connectMongodb = require("./init/mongodb");
const todoRoute = require("./routes/todo");
const dotenv = require("dotenv");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Connect to MongoDB
connectMongodb();

// Set view engine
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));

// Configure sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'your secret key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.CONNECTION_URL || 'mongodb://localhost/todo-app' })
}));

// Routes
app.use("/", todoRoute);

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        res.redirect('/register');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && await user.isValidPassword(password)) {
            req.session.userId = user._id;
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

app.get('/', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('index');
});

module.exports = app;
