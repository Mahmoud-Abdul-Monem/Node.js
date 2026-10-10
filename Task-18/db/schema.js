import { boolean, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core"; 
import { sql } from "drizzle-orm";

export const todos = pgTable("todos", {
    id: serial().primaryKey(),
    title: varchar({ length: 255 }).notNull(),
    body: varchar({ length: 255 }).notNull(),
    done: boolean().default(false),
    created_at: timestamp().default(sql`NOW()`).notNull(),
});