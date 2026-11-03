import { pgTable, serial, text, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core';
import { defineRelations } from 'drizzle-orm';
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: text('username').notNull(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    content: text('content').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const comments = pgTable('comments', {
    id: serial('id').primaryKey(),
    postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const likes = pgTable('likes', {
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
    primaryKey({ columns: [t.userId, t.postId] })
]);

export const schemaRelations = defineRelations({ users, posts, comments, likes }, (r) => ({
    users: {
        posts: r.many.posts({
            from: r.users.id,
            to: r.posts.userId,
        }),
        comments: r.many.comments({
            from: r.users.id,
            to: r.comments.userId,
        }),
        likes: r.many.likes({
            from: r.users.id,
            to: r.likes.userId,
        }),
    },
    posts: {
        user: r.one.users({
            from: r.posts.userId,
            to: r.users.id,
        }),
        comments: r.many.comments({
            from: r.posts.id,
            to: r.comments.postId,
        }),
        likes: r.many.likes({
            from: r.posts.id,
            to: r.likes.postId,
        }),
    },
    comments: {
        post: r.one.posts({
            from: r.comments.postId,
            to: r.posts.id,
        }),
        user: r.one.users({
            from: r.comments.userId,
            to: r.users.id,
        }),
    },
    likes: {
        user: r.one.users({
            from: r.likes.userId,
            to: r.users.id,
        }),
        post: r.one.posts({
            from: r.likes.postId,
            to: r.posts.id,
        }),
    },
}));