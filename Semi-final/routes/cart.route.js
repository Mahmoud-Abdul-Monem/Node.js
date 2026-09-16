import { Router } from "express";
import { validateBody } from "../middleware/validate.body.js";
import { cartSchema, updateCartSchema } from "../schema/cart.schema.js";
import { createDB } from "../db.js";
import { checkAuth } from "../middleware/check.auth.js"
import { checkRole } from "../middleware/check.role.js"
export const cartRouter = Router();
const db = createDB();

cartRouter.get("/", checkAuth, checkRole("customer"), async (req, res) => {
    const carts = await db.getAll("carts");
    const userCart = carts.find((item) => item.userId === req.user.id);
    if (!userCart) {
        return res.status(200).json({
            data: { id: null, userId: req.user.id, products: [] }
        })
    }
    res.status(200).json({ data: userCart });
});

cartRouter.post("/", checkAuth, checkRole("customer"), validateBody(cartSchema), async (req, res) => {
    const productData = req.body;
    const qtyToAdd = productData.quantity || 1;

    const carts = await db.getAll("carts");
    let userCart = carts.find((c) => c.userId === req.user.id);

    if (!userCart) {
        userCart = await db.create("carts", {
            userId: req.user.id,
            products: [{
                id: productData.id,
                name: productData.name,
                description: productData.description,
                price: productData.price,
                image: productData.image,
                quantity: qtyToAdd
            }]
        });
    } else {
        const prodIndex = userCart.products.findIndex((p) => p.id === productData.id);

        if (prodIndex > -1) {
            userCart.products[prodIndex].quantity += qtyToAdd;
        } else {
            userCart.products.push({
                id: productData.id,
                name: productData.name,
                description: productData.description,
                price: productData.price,
                image: productData.image,
                quantity: qtyToAdd
            });
        }

        await db.update("carts", userCart.id, { products: userCart.products });
        userCart = await db.getById("carts", userCart.id);
    }

    res.status(201).json({
        message: "product added to cart",
        data: userCart
    });
});
cartRouter.patch("/:productId", checkAuth, checkRole("customer"), validateBody(updateCartSchema), async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const carts = await db.getAll("carts");
    const userCart = carts.find((el) => el.userId === req.user.id);

    if (!userCart) {
        return res.status(404).json({ error: "cart not found" });
    }

    const prodIndex = userCart.products.findIndex((p) => p.id === productId);
    if (prodIndex === -1) {
        return res.status(404).json({ error: "product not found in cart" });
    }

    userCart.products[prodIndex].quantity = quantity;
    await db.update("carts", userCart.id, { products: userCart.products });

    const updatedCart = await db.getById("carts", userCart.id);
    res.status(200).json({ message: "cart updated", data: updatedCart });
});

cartRouter.delete("/:productId", checkAuth, checkRole("customer"), async (req, res) => {
    const { productId } = req.params;
    const carts = await db.getAll("carts");
    const userCart = carts.find((c) => c.userId === req.user.id);

    if (userCart) {
        const updatedProducts = userCart.products.filter((p) => p.id !== productId);
        await db.update("carts", userCart.id, { products: updatedProducts });
    }

    res.status(200).json({ message: "product removed from cart" });
});