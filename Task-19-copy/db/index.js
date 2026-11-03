import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { schemaRelations } from './schema.js';
import * as schema from './schema.js';

process.loadEnvFile();

const { Pool } = pkg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});


export const db = drizzle({ client: pool, schema, relations: schemaRelations,});

const PgSession = connectPgSimple(session);

export const sessionConfig = {
    store: new PgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'blog_session',
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    },
};