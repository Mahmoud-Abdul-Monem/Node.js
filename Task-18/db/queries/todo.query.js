import { db } from "../../db.js"
import { eq, not } from "drizzle-orm"
import { todos } from "../schema.js"
export async function getAllTodos() {
    const data = await db.select().from(todos);
    return data
}

export async function getTodoById(id) {
    const data = await db.select().from(todos).where(eq(todos.id, id)).limit(1)
    if (data.length) {
        return data[0];
    } else {
        return false;
    }
}

export async function createTodo({ title, body }) {
    const data = await db.insert(todos).values({
        title: title,
        body: body
    })
    return data
}

export async function updateTodo(id, body) {
    const result = await db.update(todos).set(body).where(eq(todos.id, id));
    return result;
}


export async function toggleTodo(id) {
    const data = await db.update(todos)
        .set({ done: not(todos.done) })
        .where(eq(todos.id, id));

    return data;
}

export async function deleteTodoById(id) {
    const data = await db.delete(todos).where(eq(id, todos.id))

}