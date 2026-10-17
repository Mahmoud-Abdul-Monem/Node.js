import { db } from "../db/index.js";
import { sessions, users } from "../db/schema.js";
import { eq, and, gt } from "drizzle-orm";

export async function checkAuth(req, res, next) {
  try {
    const sessionId = req.cookies?.blog_session;
    if (!sessionId) {
      return res.status(401).json({ error: "invalid session" });
    }

    const [sessionRecord] = await db
      .select({
        user: {
          id: users.id,
          username: users.username,
          email: users.email,
        }
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(
        and(
          eq(sessions.sessionId, sessionId),
          gt(sessions.expiresAt, new Date())
        )
      );

    if (!sessionRecord) {
      return res.status(401).json({ error: "invalid session" });
    }

    req.user = sessionRecord.user;
    return next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "invalid session" });
  }
}