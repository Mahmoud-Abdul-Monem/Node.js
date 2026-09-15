import { Router } from "express";
import { validateBody } from "../middleware/validate.body.js";
import { cartSchema, updateCartSchema } from "../schema/cart.schema.js";
import { createDB } from "../db.js";

export const cartRouter = Router();
const db = createDB();

cartRouter.get("/", async (req, res) => {
    const carts = await db.getAll("carts");
    const userCart = carts.filter((item) => item.userId === req.user.id);
    res.status(200).json({ cart: userCart });
});


cartRouter.post("/", validateBody(cartSchema), async (req, res) => {
    const { productId, quantity } = req.body;
    const carts = await db.getAll("carts");

    const existingItem = carts.find(
        (el) => el.userId === req.user.id && el.productId === productId
    );

    if (existingItem) {
        const updatedQty = existingItem.quantity + 1;
        await db.update("carts", existingItem.id, { quantity: updatedQty });
        const updatedItem = await db.getById("carts", existingItem.id);
        return res.status(200).json({ message: "item updated in cart", data: updatedItem });
    }

    const newItem = await db.create("carts", {
        userId: req.user.id,
        productId,
        quantity: quantity || 1,
    });

    res.status(201).json({ message: "item was added to cart", data: newItem });
});




cartRouter.patch("/:cart_id", validateBody(updateCartSchema), async (req, res) => {
    const cartId = req.params.cart_id;
    const existingItem = await db.getById("carts", cartId);

    if (!existingItem || existingItem.userId !== req.user.id) {
        return res.status(404).json({ error: "item not found in cart" });
    }

    await db.update("carts", cartId, {
        quantity: req.body.quantity,
    });

    const updatedItem = await db.getById("carts", cartId);
    res.status(200).json({ message: "cart updated", data: updatedItem });
});



cartRouter.delete("/:cart_id", async (req, res) => {
    const cartId = req.params.cart_id;
    const existingItem = await db.getById("carts", cartId);

    if (existingItem && existingItem.userId === req.user.id) {
        await db.delete("carts", cartId);
    }

    res.status(204).send();
});