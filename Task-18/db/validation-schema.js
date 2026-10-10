import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { todos } from "./schema.js";

export const todosSelectSchema = createSelectSchema(todos);
export const todosInsertSchema = createInsertSchema(todos);