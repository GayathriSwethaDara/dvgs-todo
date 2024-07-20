const moment = require("moment");
const Todo = require("../models/Todo");

const homeController = async (req, res, next) => {
    try {
        res.locals.moment = moment;
        const todos = await Todo.find({}).sort({ createdAt: -1 });
        res.render("index", { todos });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addTodoFormController = (req, res, next) => {
    try {
        res.render("addtodo");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateFormController = (req, res, next) => {
    try {
        res.render("edittodo");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteFormController = (req, res, next) => {
    try {
        res.render("deletetodo");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addTodoController = async (req, res, next) => {
    try {
        const { title, desc } = req.body;
        const newtodo = new Todo({ title, desc });
        await newtodo.save();
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { homeController, addTodoFormController, updateFormController, deleteFormController, addTodoController};