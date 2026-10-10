import { defineConfig } from 'drizzle-kit';
process.loadEnvFile()

export default defineConfig({
    dialect: 'postgresql',
    schema: './db/schema.js',
    out: './drizzle',
    dbCredentials: {
        url: "postgres://postgres:123456789@localhost:5432/todo",
    },
});
