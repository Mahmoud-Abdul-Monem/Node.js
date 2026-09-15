import { Router } from "express";
import { validateBody } from "../middleware/validate.body.js";
import { checkRole } from "../middleware/check.role.js";
import { checkAuth } from "../middleware/check.auth.js";
import { createDB } from "../db.js";
import { productSchema } from "../schema/product.schema.js";
import z from "zod"
export const productsRouter = Router();
const db = createDB();

productsRouter.get("/", async (req, res) => {
    const products = await db.getAll("products");
    const search = req.query.search;

    if (search) {
        const filtered = products.filter(el =>
            el.name.toLowerCase().includes(search.toLowerCase()) ||
            el.description?.toLowerCase().includes(search.toLowerCase())
        );
        return res.status(200).json({ data: filtered });
    }

    res.status(200).json({ data: products });
});

productsRouter.get("/:pro_id", async (req, res) => {
    const product = await db.getById("products", req.params.pro_id);

    if (!product) {
        return res.status(404).json({ error: "product not found" });
    }

    res.status(200).json({ data: product });
});
productsRouter.post("/", checkAuth, checkRole("merchant"), validateBody(productSchema), async (req, res, next) => {
    const newProduct = await db.create("products", {
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
        img: req.body.img,
        merchant_id: req.user.id 
    });

    res.status(201).json({
        message: "Product created successfully",
        data: newProduct
    });
});
productsRouter.patch("/:product_id", checkAuth, checkRole("merchant"), validateBody(productSchema), async (req, res) => {
    const proId = req.params.product_id;

    await db.update("products", proId, {
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
        img: req.body.img,
    });

    const updatedProduct = await db.getById("products", proId);

    res.status(200).json({
        message: "product updated successfully",
        data: updatedProduct
    });
});

productsRouter.delete("/:product_id", checkAuth, checkRole("merchant"), async (req, res) => {
    await db.delete("products", req.params.product_id);
    res.status(204).send();
});