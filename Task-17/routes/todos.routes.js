import express from "express";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodoDone,
  deleteTodoById,
} from "../db/todo.query.js";

export const todosRouter = express.Router();

todosRouter.get("/", async (req, res) => {
  try {
    const todos = await getAllTodos();
    res.json({ data: todos });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "failed" })

  }
});

todosRouter.get("/:id", async (req, res) => {
  try {
    const todo = await getTodoById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ data: todo });
  } catch (error) {
    console.log(error)
    return res.status(404).json({ message: "failed" })
  }
});

todosRouter.post("/", async (req, res) => {
  try {
    const { title, body } = req.body;


    const newTodo = await createTodo(title, body);
    res.status(201).json({
      message: "Todo created successfully",
      data: newTodo,
    });
  } catch (error) {
    console.log(error);

  }
});

todosRouter.put("/:id", async (req, res) => {
  try {
    const { title, body, done } = req.body;
    const updatedTodo = await updateTodo(req.params.id, title, body, done);

    if (!req.params.id) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({
      message: "Todo updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    console.log(error);
  }
});

todosRouter.patch("/:id/toggle", async (req, res) => {
  try {
    const toggledTodo = await toggleTodoDone(req.params.id);

    if (!req.params.id) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({
      message: "Todo done status toggled successfully",
      data: toggledTodo,
    });
  } catch (error) {
    console.log(error);
  }
});

todosRouter.delete("/:id", async (req, res) => {
  try {
    const deletedTodo = await deleteTodoById(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.log(error);
  }
});