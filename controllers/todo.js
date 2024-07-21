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

const updateFormController = async(req, res, next) => {
    try {
        const {id}=req.query;
        const todo = await Todo.findById(id);
        res.render("edittodo",{todo});
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

const updateTodoController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const { title, desc } = req.body;
        const todo = await Todo.findById(id);
        if(!todo){
            return res.status(400).json({message: "Todo not found"});
        }
        todo.title=title;
        todo.desc=desc;
        await todo.save();
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { homeController, addTodoFormController, updateFormController, deleteFormController, addTodoController,updateTodoController};