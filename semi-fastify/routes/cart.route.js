import { validateBody } from "../middleware/validate.body.js";
import { cartSchema, updateCartSchema } from "../schema/cart.schema.js";
import { createDB } from "../db.js";

const db = createDB();

export async function cartRouter(fastify) {
    fastify.get("/", async (req, reply) => {
        const carts = await db.getAll("carts");
        const userCart = carts.find((item) => item.userId === req.user.id);
        if (!userCart) {
            return reply.status(200).send({
                data: { id: null, userId: req.user.id, products: [] }
            });
        }
        return reply.status(200).send({ data: userCart });
    });

    fastify.post("/", { preHandler: validateBody(cartSchema) }, async (req, reply) => {
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

        return reply.status(201).send({
            message: "product added to cart",
            data: userCart
        });
    });

    fastify.patch("/:productId", { preHandler: validateBody(updateCartSchema) }, async (req, reply) => {
        const { productId } = req.params;
        const { quantity } = req.body;
        const carts = await db.getAll("carts");
        const userCart = carts.find((el) => el.userId === req.user.id);

        if (!userCart) {
            return reply.status(404).send({ error: "cart not found" });
        }

        const prodIndex = userCart.products.findIndex((p) => p.id === productId);
        if (prodIndex === -1) {
            return reply.status(404).send({ error: "product not found in cart" });
        }

        userCart.products[prodIndex].quantity = quantity;
        await db.update("carts", userCart.id, { products: userCart.products });

        const updatedCart = await db.getById("carts", userCart.id);
        return reply.status(200).send({ message: "cart updated", data: updatedCart });
    });

    fastify.delete("/:productId", async (req, reply) => {
        const { productId } = req.params;
        const carts = await db.getAll("carts");
        const userCart = carts.find((c) => c.userId === req.user.id);

        if (userCart) {
            const updatedProducts = userCart.products.filter((p) => p.id !== productId);
            await db.update("carts", userCart.id, { products: updatedProducts });
        }

        return reply.status(200).send({ message: "product removed from cart" });
    });
}