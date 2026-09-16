import { Router } from "express";
import { checkAuth } from "../middleware/check.auth.js";
import { checkRole } from "../middleware/check.role.js";
import { createDB } from "../db.js";

export const ordersRouter = Router()

const db = createDB();



ordersRouter.get("/", checkAuth, checkRole("customer"), async (req, res) => {
    const orders = await db.getAll("orders");
    const userOrders = orders.filter((o) => o.userId === req.user.id);

    res.status(200).json({ data: userOrders });
});




ordersRouter.post("/checkout", checkAuth, checkRole("customer"), async (req, res) => {
    const carts = await db.getAll("carts");
    const userCart = carts.find((c) => c.userId === req.user.id);

    if (!userCart || !userCart.products || userCart.products.length === 0) {
        return res.status(422).json({ error: "cart is empty" });
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

    res.status(201).json({
        message: "order placed successfully",
        data: newOrder
    });
});