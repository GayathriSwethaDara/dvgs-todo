const express = require("express");
const router = express.Router();
const todo = require("../controllers/todo")

router.get("/", todo.homeController);
router.get("/add-todo", todo.addTodoFormController);
router.get("/edit-todo", todo.updateFormController);
router.get("/delete-todo", todo.deleteFormController);
router.post("/add-todo", todo.addTodoController);
router.post("/edit-todo/:id",todo.updateTodoController);
router.get("/confirm-delete", todo.deleteTodoController);
module.exports = router;