import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { comments, likes, posts, sessions, users } from "./schema.js";

process.loadEnvFile();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle({ client: pool });

const PASSWORD = "Password1!";

async function seed() {
    await db.delete(likes);
    await db.delete(comments);
    await db.delete(posts);
    await db.delete(sessions);
    await db.delete(users);

    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    const createdUsers = await db
        .insert(users)
        .values([
            { username: "mahmoud", email: "mahmoud@blog.test", passwordHash },
            { username: "sara", email: "sara@blog.test", passwordHash },
            { username: "omar", email: "omar@blog.test", passwordHash },
        ])
        .returning();

    const [mahmoud, sara, omar] = createdUsers;

    const createdPosts = await db
        .insert(posts)
        .values([
            {
                userId: mahmoud.id,
                content: "Just shipped the first version of this blog. Sessions, comments, and likes are in.",
            },
            {
                userId: sara.id,
                content: "Drizzle with PostgreSQL feels much cleaner than writing the joins by hand.",
            },
            {
                userId: omar.id,
                content: "Trying the comment thread. If you can read this, the seed worked.",
            },
            {
                userId: mahmoud.id,
                content: "Next up: image uploads on posts. The column is already there.",
            },
        ])
        .returning();

    const [firstPost, secondPost, thirdPost, fourthPost] = createdPosts;

    await db.insert(comments).values([
        { postId: firstPost.id, userId: sara.id, content: "Nice. Login with the seeded accounts works." },
        { postId: firstPost.id, userId: omar.id, content: "I will try liking this one." },
        { postId: secondPost.id, userId: mahmoud.id, content: "The schema is small enough to keep in one file." },
        { postId: thirdPost.id, userId: sara.id, content: "Confirmed, I can see the seeded comment." },
    ]);

    await db.insert(likes).values([
        { userId: sara.id, postId: firstPost.id },
        { userId: omar.id, postId: firstPost.id },
        { userId: mahmoud.id, postId: secondPost.id },
        { userId: sara.id, postId: thirdPost.id },
        { userId: omar.id, postId: fourthPost.id },
    ]);

    console.log("Seed finished.");
    console.log(`Users: ${createdUsers.length}, posts: ${createdPosts.length}, comments: 4, likes: 5`);
    console.log("Login with any seeded email and password:", PASSWORD);
    console.log(createdUsers.map((user) => user.email).join("\n"));
}

seed()
    .catch((error) => {
        console.error("Seed failed:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });
