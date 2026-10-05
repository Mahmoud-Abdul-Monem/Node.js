import { createDB } from "../db.js";

const db = createDB();

export async function ordersRouter(fastify) {
    fastify.get("/", async (req, reply) => {
        const orders = await db.getAll("orders");
        const userOrders = orders.filter((o) => o.userId === req.user.id);

        return reply.status(200).send({ data: userOrders });
    });

    fastify.post("/checkout", async (req, reply) => {
        const carts = await db.getAll("carts");
        const userCart = carts.find((c) => c.userId === req.user.id);

        if (!userCart || !userCart.products || userCart.products.length === 0) {
            return reply.status(422).send({ error: "cart is empty" });
        }

        const total = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const newOrder = await db.create("orders", {
            userId: req.user.id,
            products: userCart.products,
            total: total,
            status: "pending",
            createdAt: new Date().toISOString()
        });

        await db.update("carts", userCart.id, { products: [] });

        return reply.status(201).send({
            message: "order placed successfully",
            data: newOrder
        });
    });
}