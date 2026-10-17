import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { sessions, users } from "../db/schema.js";

export async function createUser({ username, email, passwordHash }) {
    const [newUser] = await db
        .insert(users)
        .values({
            username,
            email,
            passwordHash,
        })
        .returning({
            id: users.id,
            username: users.username,
            email: users.email,
            createdAt: users.createdAt,
        });
    return newUser;
}

export async function findUserByEmail(email) {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
    return user;
}

export async function createSession(userId, sessionId, expiresAt) {
    const [newSession] = await db
        .insert(sessions)
        .values({
            userId,
            sessionId,
            expiresAt,
        })
        .returning();
    return newSession;
}

export async function deleteSession(sessionId) {
    await db
        .delete(sessions)
        .where(eq(sessions.sessionId, sessionId));
}