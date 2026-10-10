import express from "express";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodoById,
} from "../db/queries/todo.query.js";
import { todosInsertSchema, } from "../db/validation-schema.js";

export const todosRouter = express.Router();

todosRouter.get("/", async (req, res) => {
  const todos = await getAllTodos();

  res.status(200).json({
    data: todos,
  });
});

todosRouter.get("/:id", async (req, res) => {
  const id = req.params.id

  const data = await getTodoById(id)

  res.status(200).json({
    data: data
  })

});

todosRouter.post("/", async (req, res) => {

  const body = todosInsertSchema.parse(req.body);
  const data = await createTodo(body);
  res.status(201).json({ message: "success", createdTodo: data });
});



todosRouter.put("/:id", async (req, res) => {
  const id = req.params.id
  const body = todosInsertSchema.partial().safeParse(req.body);

  const result = await updateTodo(id, req.body);

  return res.status(200).json({
    message: "success",
    data: result,
  });

});




todosRouter.patch("/:id/toggle", async (req, res) => {
  const id = Number(req.params.id);
  await toggleTodo(id)

  res.status(202).json({ message: "toggled successfuly" })
});

todosRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await deleteTodoById(id)
  res.status(200).json({ message: "deleted successfuly" })
});