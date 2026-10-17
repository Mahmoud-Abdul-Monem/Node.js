import { eq, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { comments, users } from "../db/schema.js";

export async function getPostComments(postId) {
    const postComments = await db
        .select()
        .from(comments)
        .leftJoin(users, eq(comments.userId, users.id))
        .where(eq(comments.postId, postId))
        .orderBy(desc(comments.createdAt));

    return postComments.map(({ comments: c, users: u }) => ({
        id: c.id,
        content: c.content,
        created_at: c.createdAt,
        username: u?.username,
    }));
}

export async function createComment({ postId, userId, content }) {
    const [newComment] = await db
        .insert(comments)
        .values({
            postId,
            userId,
            content,
        })
        .returning();

    const [result] = await db
        .select()
        .from(comments)
        .leftJoin(users, eq(comments.userId, users.id))
        .where(eq(comments.id, newComment.id));

    return {
        id: result.comments.id,
        content: result.comments.content,
        created_at: result.comments.createdAt,
        username: result.users?.username,
    };
}