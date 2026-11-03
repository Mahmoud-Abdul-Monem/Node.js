import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function findUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
}

export async function createUser({ username, email, password }) {
    const passwordHash = await bcrypt.hash(password, 10);
    await db.insert(users).values({ username, email, passwordHash });
}

export async function verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}