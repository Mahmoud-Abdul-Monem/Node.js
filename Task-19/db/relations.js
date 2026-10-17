import { defineRelations } from "drizzle-orm";
import { users, sessions, posts, comments, likes } from "./schema.js";

export const relations = defineRelations((r) => ({
    users: {
        sessions: r.many.sessions({
            from: users.id,
            to: sessions.userId,
        }),
        posts: r.many.posts({
            from: users.id,
            to: posts.userId,
        }),
        comments: r.many.comments({
            from: users.id,
            to: comments.userId,
        }),
        likes: r.many.likes({
            from: users.id,
            to: likes.userId,
        }),
    },
    sessions: {
        user: r.one.users({
            from: sessions.userId,
            to: users.id,
        }),
    },
    posts: {
        user: r.one.users({
            from: posts.userId,
            to: users.id,
        }),
        comments: r.many.comments({
            from: posts.id,
            to: comments.postId,
        }),
        likes: r.many.likes({
            from: posts.id,
            to: likes.postId,
        }),
    },
    comments: {
        post: r.one.posts({
            from: comments.postId,
            to: posts.id,
        }),
        user: r.one.users({
            from: comments.userId,
            to: users.id,
        }),
    },
    likes: {
        user: r.one.users({
            from: likes.userId,
            to: users.id,
        }),
        post: r.one.posts({
            from: likes.postId,
            to: posts.id,
        }),
    },
}));