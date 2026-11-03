import { db } from "../db/index.js";
import { posts, likes, comments, users } from "../db/schema.js";
import { eq, and, desc } from "drizzle-orm";

export async function getAllPosts(currentUserId) {
    try {
        const rawPosts = await db.query.posts.findMany({
            with: {
                user: true,
                comments: true,
                likes: true,
            },
            orderBy: (posts, { desc }) => [desc(posts.createdAt)],
        });

        const formattedPosts = rawPosts.map((post) => {
            return {
                id: post.id,
                content: post.content,
                image: post.image,
                created_at: post.createdAt,
                username: post.user ? post.user.username : "Unknown",
                like_count: post.likes ? post.likes.length : 0,
                comment_count: post.comments ? post.comments.length : 0,
                liked_by_me: currentUserId ? post.likes.some((like) => like.userId === currentUserId) : false,
            };
        });

        return formattedPosts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}

export async function getPostById(postId, currentUserId) {
    try {
        const numericId = Number(postId);
        if (isNaN(numericId)) return null;

        const [post] = await db
            .select()
            .from(posts)
            .where(eq(posts.id, numericId));

        if (!post) return null;

        const [postUser] = await db
            .select()
            .from(users)
            .where(eq(users.id, post.userId));

        const postComments = await db
            .select({
                id: comments.id,
                content: comments.content,
                createdAt: comments.createdAt,
                userId: comments.userId,
                username: users.username,
            })
            .from(comments)
            .leftJoin(users, eq(comments.userId, users.id))
            .where(eq(comments.postId, numericId))
            .orderBy(desc(comments.createdAt));

        const postLikes = await db
            .select()
            .from(likes)
            .where(eq(likes.postId, numericId));

        const likedByMe = currentUserId
            ? postLikes.some((l) => l.userId === currentUserId)
            : false;

        return {
            post: {
                id: post.id,
                content: post.content,
                image: post.image,
                created_at: post.createdAt,
                username: postUser ? postUser.username : "Unknown",
                like_count: postLikes.length,
                comment_count: postComments.length,
                liked_by_me: likedByMe,
            },
            comments: postComments.map((c) => ({
                id: c.id,
                content: c.content,
                created_at: c.createdAt,
                username: c.username || "Unknown",
            })),
        };
    } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
    }
}


export async function createPost({ content, image, userId }) {
    try {
        const [newPost] = await db.insert(posts).values({
            content,
            image,
            userId,
        }).returning();
        return newPost;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}

export async function getExistingLike(userId, postId) {
    try {
        const [existingLike] = await db
            .select()
            .from(likes)
            .where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
        return existingLike || null;
    } catch (error) {
        console.error("Error fetching like:", error);
        throw error;
    }
}

export async function addLike(userId, postId) {
    try {
        await db.insert(likes).values({ userId, postId }).onConflictDoNothing();

        const postLikes = await db
            .select()
            .from(likes)
            .where(eq(likes.postId, postId));

        return {
            liked: true,
            like_count: postLikes.length,
        };
    } catch (error) {
        console.error("Error adding like:", error);
        throw error;
    }
}

export async function removeLike(userId, postId) {
    try {
        await db.delete(likes).where(
            and(
                eq(likes.userId, userId),
                eq(likes.postId, postId)
            )
        );

        const postLikes = await db
            .select()
            .from(likes)
            .where(eq(likes.postId, postId));

        return {
            liked: false,
            like_count: postLikes.length,
        };
    } catch (error) {
        console.error("Error removing like:", error);
        throw error;
    }
}

export async function addComment({ postId, userId, content }) {
    try {
        const [newComment] = await db.selectin ? null : await db.insert(comments).values({
            postId,
            userId,
            content,
        }).returning();

        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId),
        });

        return {
            id: newComment.id,
            content: newComment.content,
            created_at: newComment.createdAt,
            username: user ? user.username : "Unknown",
        };
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
}