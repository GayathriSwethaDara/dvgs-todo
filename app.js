const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const connectMongodb = require("./init/mongodb");
const todoRoute = require("./routes/todo");
const dotenv = require("dotenv");
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Connect to MongoDB
connectMongodb();

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Set the views directory
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));

// Middleware to protect routes
function ensureAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Routes
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
        const user = await User.findOne({ username, password });
        if (user) {
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

app.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        res.render('index', { user });
    } catch (err) {
        res.redirect('/login');
    }
});

app.use("/", todoRoute);

module.exports = app;
