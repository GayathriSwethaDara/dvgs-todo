const { timeStamp } = require("console");
const express = require("express");
const { type } = require("os");
const path = require("path");
const { title } = require("process");
const bodyparser = require("body-parser");
const moment = require("moment");
const connectMongodb = require("./init/mongodb");
const Todo = require("./models/Todo");

const PORT = 8000;

//initialize app
const app = express();

//connectiong to db
connectMongodb();

//view engine
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
    try {
        res.locals.moment = moment;
        const todos = await Todo.find({}).sort({ createdAt: -1 });
        res.render("index", { todos });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get("/add-todo", (req, res, next) => {
    try {
        res.render("addtodo");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get("/edit-todo", (req, res, next) => {
    try {
        res.render("edittodo");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get("/delete-todo", (req, res, next) => {
    try {
        res.render("deletetodo");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.post("/add-todo", async (req, res, next) => {
    try {
        const { title, desc } = req.body;
        const newtodo = new Todo({ title, desc });
        await newtodo.save();
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//listen server
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});