CREATE TABLE "todos" (
	"id" serial PRIMARY KEY,
	"title" varchar(255) NOT NULL,
	"body" varchar(255) NOT NULL,
	"done" boolean DEFAULT false,
	"created_at" timestamp DEFAULT NOW() NOT NULL,
	"tifo" integer
);
