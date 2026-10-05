import { validateBody } from "../middleware/validate.body.js";
import { checkRole } from "../middleware/check.role.js";
import { checkAuth } from "../middleware/check.auth.js";
import { createDB } from "../db.js";
import { productSchema } from "../schema/product.schema.js";

const db = createDB();

export async function productsRouter(fastify) {
    fastify.get("/", async (req, reply) => {
        const products = await db.getAll("products");
        const search = req.query.search;

        if (search) {
            const searchLc = search.toLowerCase();
            const filtered = products.filter(p =>
                (p.name && p.name.toLowerCase().includes(searchLc)) ||
                (p.description && p.description.toLowerCase().includes(searchLc))
            );
            return reply.status(200).send({ data: filtered });
        }
        return reply.status(200).send({ data: products });
    });

    fastify.get("/:pro_id", async (req, reply) => {
        const product = await db.getById("products", req.params.pro_id);

        if (!product) {
            return reply.status(404).send({ error: "product not found" });
        }

        return reply.status(200).send({ data: product });
    });

    fastify.post("/",
        { preHandler: [checkAuth, checkRole("merchant"), validateBody(productSchema)] }, async (req, reply) => {
            const newProduct = await db.create("products", {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                image: req.body.image,
                merchant_id: req.user.id
            });

            return reply.status(201).send({
                message: "Product created successfully",
                data: newProduct
            });
        });

    fastify.patch("/:product_id", {
        preHandler: [checkAuth, checkRole("merchant"), validateBody(productSchema)]
    }, async (req, reply) => {
        const proId = req.params.product_id;

        await db.update("products", proId, {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.body.image,
        });

        const updatedProduct = await db.getById("products", proId);

        return reply.status(200).send({
            message: "product updated successfully",
            data: updatedProduct
        });
    });

    fastify.delete("/:product_id", {
        preHandler: [checkAuth, checkRole("merchant")]
    }, async (req, reply) => {
        await db.delete("products", req.params.product_id);
        return reply.status(204).send();
    });
}