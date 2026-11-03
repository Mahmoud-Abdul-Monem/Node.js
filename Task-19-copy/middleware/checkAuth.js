import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export async function checkAuth(req, res, next) {
    try {
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ error: 'invalid session' });
        }

        const [user] = await db.select({
            id: users.id,
            email: users.email,
            username: users.username,
        }).from(users).where(eq(users.id, req.session.userId));

        if (!user) {
            return res.status(401).json({ error: 'invalid session' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'invalid session' });
    }
}