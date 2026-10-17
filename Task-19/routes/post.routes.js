import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { getAllPosts, getPostById, createPost, toggleLike } from "../queries/post.queries.js";
import { createComment } from "../queries/comment.queries.js";
import { uploadImage } from "../middleware/upload.js";
export const postRouter = Router();

postRouter.use(checkAuth);

postRouter.get("/", async (req, res, next) => {
    try {
        const posts = await getAllPosts(req.user.id);
        return res.status(200).json({ data: posts });
    } catch (err) {
        next(err);
    }
});
postRouter.post("/", uploadImage("image"), async (req, res, next) => {
    try {
        const { content } = req.body;
        const imageFile = req.file ? req.file.filename : null;

        if (!content || content.trim() === "") {
            return res.status(422).json({
                errors: { content: { errors: ["post content cannot be empty"] } }
            });
        }

        const newPost = await createPost({
            userId: req.user.id,
            content,
            image: imageFile
        });

        return res.status(201).json({
            message: "post created successfully",
            data: newPost
        });
    } catch (err) {
        next(err);
    }
});

postRouter.get("/:id", async (req, res, next) => {
    try {
        const postId = Number(req.params.id);
        const postData = await getPostById(postId, req.user.id);

        if (!postData) {
            return res.status(404).json({ error: "post not found" });
        }

        return res.status(200).json({ data: postData });
    } catch (err) {
        next(err);
    }
});

postRouter.post("/:id/like", async (req, res, next) => {
    try {
        const postId = Number(req.params.id);

        const postData = await getPostById(postId, req.user.id);
        if (!postData) {
            return res.status(404).json({ error: "post not found" });
        }

        const result = await toggleLike(postId, req.user.id);

        return res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
});

postRouter.post("/:id/comments", async (req, res, next) => {
    try {
        const postId = Number(req.params.id);
        const { content } = req.body;

        const postData = await getPostById(postId, req.user.id);
        if (!postData) {
            return res.status(404).json({ error: "post not found" });
        }

        if (!content || content.trim() === "") {
            return res.status(422).json({
                errors: { content: { errors: ["comment content cannot be empty"] } }
            });
        }

        const newComment = await createComment({
            postId,
            userId: req.user.id,
            content
        });

        return res.status(201).json({
            message: "comment created successfully",
            data: newComment
        });
    } catch (err) {
        next(err);
    }
});