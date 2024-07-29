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
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));

// Middleware to protect routes
function ensureAuthenticated(req, res, next) {
    if (req.headers.username && req.headers.password) {
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
        console.error(err);
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
            res.redirect(`/?username=${username}&password=${password}`);
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    res.redirect('/login');
});

app.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const { username, password } = req.headers;
        const user = await User.findOne({ username });
        if (user && await user.isValidPassword(password)) {
            res.render('index', { user });
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
});

app.use("/", todoRoute);

module.exports = app;
