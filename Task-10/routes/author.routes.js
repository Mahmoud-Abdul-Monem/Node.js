import express from "express";
import { createDB } from "../db.js";
import { authorSchema, authorParamsSchema, authorQuerySchema } from "../schema/validate.author.js";
import { validateBody, validateParams, validateQuery } from "../middleware/validate.body.js";

const db = createDB();
export const authorRouter = express.Router();

authorRouter.get("/", validateQuery(authorQuerySchema), async (req, res) => {
    const searchParam = req.query.search;

    if (searchParam) {
        const filteredAuthors = await db.searchByName("authors", searchParam);
        return res.json({ data: filteredAuthors });
    }

    const authors = await db.getAll("authors");
    return res.json({ data: authors });
});

authorRouter.get(
    "/:author_id",
    validateParams(authorParamsSchema),
    async (req, res) => {
        const authorId = req.params.author_id;
        const author = await db.getById("authors", authorId);

        if (!author) {
            return res.status(404).json({ message: "author not found" });
        }

        res.json({ data: author });
    }
);

authorRouter.post("/", validateBody(authorSchema), async (req, res) => {
        const authorData = req.body;
        const newAuthor = await db.create("authors", authorData);

        res.status(201).json({
            message: "author created successfully",
            data: newAuthor,
        });
    });

    authorRouter.patch(
        "/:author_id",
        validateParams(authorParamsSchema),
        validateBody(authorSchema.partial()),
        async (req, res) => {
            const authorId = req.params.author_id;
            const author = await db.getById("authors", authorId);

            if (!author) {
                return res.status(404).json({ message: "author not found" });
            }

            const updateData = req.body;
            await db.update("authors", authorId, updateData);
            const updatedAuthor = await db.getById("authors", authorId);

            return res.status(200).json({
                message: "author updated successfully",
                data: updatedAuthor,
            });
        }
    );

    authorRouter.delete(
        "/:author_id",
        validateParams(authorParamsSchema),
        async (req, res) => {
            const authorId = req.params.author_id;
            const author = await db.getById("authors", authorId);

            if (author) {
                await db.delete("authors", authorId);
                return res.status(200).json({
                    message: "author deleted successfully",
                });
            } else {
                return res.status(404).json({ message: "author not found" });
            }
        }
    );