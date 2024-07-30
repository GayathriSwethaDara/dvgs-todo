const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const connectMongodb = require("./init/mongodb");
const todoRoute = require("./routes/todo");
const dotenv = require("dotenv");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/User');
const Todo = require('./models/Todo');
const moment = require('moment');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Connect to MongoDB
connectMongodb();

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set static directory
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));

// Configure sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'your secret key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.CONNECTION_URL,
        collectionName: 'sessions'
    }),
    cookie: { maxAge: 180 * 60 * 1000 } // 3 hours
}));

// Middleware to protect routes
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.redirect('/login.html');
    }
}

// Routes
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/register.html'));
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.redirect('/login.html');
    } catch (err) {
        res.redirect('/register.html');
    }
});

app.get('/login.html', (req, res) => {
    const error = req.query.error ? req.query.error : '';
    res.sendFile(path.join(__dirname, 'public/html/login.html'), { error });
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (user) {
            req.session.userId = user._id;
            res.redirect('/');
        } else {
            res.redirect('/login.html?error=Invalid credentials');
        }
    } catch (err) {
        res.redirect('/login.html?error=Invalid credentials');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login.html');
    });
});

app.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const todos = await Todo.find();
        res.render('index', { todos, moment });
    } catch (err) {
        res.redirect('/login.html');
    }
});

app.use("/", todoRoute);

module.exports = app;