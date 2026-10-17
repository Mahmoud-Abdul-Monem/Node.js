import { eq, desc, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { posts, likes, users, comments } from "../db/schema.js";

export async function getAllPosts(currentUserId) {
    const allPosts = await db
        .select()
        .from(posts)
        .leftJoin(users, eq(posts.userId, users.id))
        .orderBy(desc(posts.createdAt));

    const allLikes = await db.select().from(likes);
    const allComments = await db.select().from(comments);

    return allPosts.map(({ posts: post, users: user }) => {
        const postLikes = allLikes.filter((l) => l.postId === post.id);
        const postComments = allComments.filter((c) => c.postId === post.id);

        return {
            id: post.id,
            content: post.content,
            image: post.image,
            created_at: post.createdAt,
            username: user?.username,
            like_count: postLikes.length,
            comment_count: postComments.length,
            liked_by_me: currentUserId ? postLikes.some((l) => l.userId === currentUserId) : false,
        };
    });
}

export async function getPostById(postId, currentUserId) {
    const [result] = await db
        .select()
        .from(posts)
        .leftJoin(users, eq(posts.userId, users.id))
        .where(eq(posts.id, postId));

    if (!result) return null;

    const post = result.posts;
    const user = result.users;

    const postLikes = await db.select().from(likes).where(eq(likes.postId, postId));
    const postComments = await db
        .select()
        .from(comments)
        .leftJoin(users, eq(comments.userId, users.id))
        .where(eq(comments.postId, postId))
        .orderBy(desc(comments.createdAt));

    return {
        post: {
            id: post.id,
            content: post.content,
            image: post.image,
            created_at: post.createdAt,
            username: user?.username,
            like_count: postLikes.length,
            comment_count: postComments.length,
            liked_by_me: currentUserId ? postLikes.some((l) => l.userId === currentUserId) : false,
        },
        comments: postComments.map(({ comments: c, users: u }) => ({
            id: c.id,
            content: c.content,
            created_at: c.createdAt,
            username: u?.username,
        })),
    };
}

export async function createPost({ userId, content, image }) {
    const [newPost] = await db
        .insert(posts)
        .values({
            userId,
            content,
            image: image || null,
        })
        .returning();
    return newPost;
}

export async function toggleLike(postId, userId) {
    const [existingLike] = await db
        .select()
        .from(likes)
        .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));

    let liked = false;
    if (existingLike) {
        await db
            .delete(likes)
            .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
        liked = false;
    } else {
        await db
            .insert(likes)
            .values({ postId, userId });
        liked = true;
    }

    const postLikes = await db.select().from(likes).where(eq(likes.postId, postId));

    return {
        liked,
        like_count: postLikes.length,
    };
}