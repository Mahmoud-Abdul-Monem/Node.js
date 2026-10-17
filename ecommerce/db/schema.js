import { defineRelations } from "drizzle-orm";
import { PgTable, text, timestamp, integer, serial, decimal, pgTable, varchar, PgRole, pgEnum, primaryKey, } from "drizzle-orm/pg-core";
export const roleEnum = pgEnum("role", ["merchant", "customer"]); 
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password_hash: varchar("password_hash", { length: 255 }).notNull(),
    role: roleEnum().default("customer"),
})


export const carts = pgTable("carts", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => users.id)
})

export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text(),
    image: varchar("image", { length: 255 }),
    price: decimal({ precision: 10, scale: 2, mode: "number" }),
})


export const orders = pgTable("orders", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => users.id),
    created_at: timestamp("created_at").defaultNow(),
})



export const cartProduct = pgTable("cart_product", {
    cartId: integer("cart_id").notNull().references(() => carts.id),
    productId: integer("product_id").notNull().references(() => products.id),
}, (table) => [primaryKey({ columns: [table.cartId, table.productId] })]
);


export const orderProduct = pgTable("order_product", {
    productId: integer("product_id").notNull().references(() => products.id),
    orderId: integer("order_id").notNull().references(() => orders.id),
    quantity: integer("quantity").default(1),
    price: decimal("price", { precision: 10, scale: 2, mode: "number" }).notNull(),

},
    (table) => [primaryKey({ columns: [table.productId, table.orderId] })]
)





export const relations = defineRelations({ users, orders, carts, orderProduct, cartProduct, products }, (r) => ({
    users: { 
        cart: r.one.carts({
            from: r.users.id,
            to: r.carts.user_id
        }),
        orders: r.many.orders({
            from: r.users.id,
            to: r.orders.user_id
        })
    },
    carts: {
        user: r.one.users({
            from: r.carts.user_id,
            to: r.users.id
        }),
        products: r.many.products({
            from: r.carts.id.through(r.cartProduct, r.cartProduct.cartId, r.cartProduct.productId),
            to: r.products.id
        })
    },
    orders: {
        user: r.one.users({
            from: r.orders.user_id,
            to: r.users.id
        }),
        products: r.many.products({
            from: r.orders.id.through(r.orderProduct, r.orderProduct.orderId, r.orderProduct.productId),
            to: r.products.id
        })
    },
    products: {
        carts: r.many.carts({
            from: r.products.id.through(r.cartProduct, r.cartProduct.productId, r.cartProduct.cartId),
            to: r.carts.id
        }),
        orders: r.many.orders({
            from: r.products.id.through(r.orderProduct, r.orderProduct.productId, r.orderProduct.orderId),
            to: r.orders.id
        })
    }
}));
