import { pool } from "../db.js";

export async function getAllTodos() {
  const res = await pool.query("SELECT * FROM todos ORDER BY created_at DESC");
  return res.rows;
}

export async function getTodoById(id) {
  const res = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);
  return res.rows[0];
}

export async function createTodo(title, body) {
  const res = await pool.query(
    "INSERT INTO todos (title, body) VALUES ($1, $2) RETURNING *",
    [title, body]
  );
  return res.rows[0];
}

export async function updateTodo(id, title, body, done) {
  const res = await pool.query(
    "UPDATE todos SET title = $1, body = $2, done = $3 WHERE id = $4 RETURNING *",
    [title, body, done, id]
  );
  return res.rows[0];
}

export async function toggleTodoDone(id) {
  const res = await pool.query(
    "UPDATE todos SET done = NOT done WHERE id = $1 RETURNING *",
    [id]
  );
  return res.rows[0];
}

export async function deleteTodoById(id) {
  const res = await pool.query(
    "DELETE FROM todos WHERE id = $1 RETURNING *",
    [id]
  );
  return res.rows[0];
}