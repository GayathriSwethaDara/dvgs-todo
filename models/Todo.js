const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({ title: { type: String }, desc: String }, { timestamps: true });
const Todo = mongoose.model("todo", todoSchema);

module.exports = Todo;