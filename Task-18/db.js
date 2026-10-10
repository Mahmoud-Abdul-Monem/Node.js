import { Pool } from "pg"

import { drizzle } from 'drizzle-orm/node-postgres';

export const pool = new Pool({
  connectionString: "postgres://postgres:123456789@localhost:5432/todo",
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
export const db = drizzle({ client: pool });
