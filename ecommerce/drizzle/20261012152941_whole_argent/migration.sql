CREATE TYPE "role" AS ENUM('merchant', 'customer');--> statement-breakpoint
CREATE TABLE "cart_product" (
	"cart_id" integer,
	"product_id" integer,
	CONSTRAINT "cart_product_pkey" PRIMARY KEY("cart_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "carts" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_product" (
	"product_id" integer,
	"order_id" integer,
	"quantity" integer DEFAULT 1,
	"price" numeric(10,2) NOT NULL,
	CONSTRAINT "order_product_pkey" PRIMARY KEY("product_id","order_id")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"description" text,
	"image" varchar(255),
	"price" numeric(10,2)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password_hash" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'customer'::"role"
);
--> statement-breakpoint
ALTER TABLE "cart_product" ADD CONSTRAINT "cart_product_cart_id_carts_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id");--> statement-breakpoint
ALTER TABLE "cart_product" ADD CONSTRAINT "cart_product_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id");--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "order_product" ADD CONSTRAINT "order_product_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id");--> statement-breakpoint
ALTER TABLE "order_product" ADD CONSTRAINT "order_product_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");