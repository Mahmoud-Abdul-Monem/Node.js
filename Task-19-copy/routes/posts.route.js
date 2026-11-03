import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
    getAllPosts,
    getPostById,
    createPost,
    getExistingLike,
    addLike,
    removeLike,
    addComment
} from "../queries/posts.js";
import { createPostSchema } from "../validation-schema/upload.js";
import { uploadImage } from "../middleware/upload.js";
import { validateBody } from "../middleware/validateBody.js";

export const postsRouter = Router();

postsRouter.get("/", async (req, res, next) => {
    try {
        const currentUserId = req.session?.userId || null;
        const data = await getAllPosts(currentUserId);

        return res.status(200).json({
            data: data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

postsRouter.post("/", checkAuth, uploadImage("image"), validateBody(createPostSchema), async (req, res, next) => {
    try {
        const { content } = req.body;
        const image = req.file ? req.file.filename : null;
        const userId = req.user.id;

        const newPost = await createPost({ content, image, userId });

        return res.status(201).json({
            message: "post created successfully",
            data: newPost,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
postsRouter.get("/:id", async (req, res, next) => {
    try {
        const postId = Number(req.params.id);
        const currentUserId = req.session?.userId || null;
        const data = await getPostById(postId, currentUserId);

        if (!data) {
            return res.status(404).json({ error: "post not found" });
        }

        return res.status(200).json({
            message: "success",
            data: data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

postsRouter.post("/:id/like", checkAuth, async (req, res, next) => {
    try {
        const postId = Number(req.params.id);
        const userId = req.user.id;

        const post = await getPostById(postId, userId);
        if (!post) {
            return res.status(404).json({ error: "post not found" });
        }

        const existingLike = await getExistingLike(userId, postId);

        let result;
        if (existingLike) {
            result = await removeLike(userId, postId);
        } else {
            result = await addLike(userId, postId);
        }

        return res.status(200).json({
            data: result,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

postsRouter.post("/:id/comments", checkAuth, async (req, res, next) => {
    try {
        const postId = Number(req.params.id);
        const userId = req.user.id;
        const { content } = req.body;

        const currentUserId = req.session?.userId || null;
        const post = await getPostById(postId, currentUserId);
        if (!post) {
            return res.status(404).json({ error: "post not found" });
        }

        const newComment = await addComment({ postId, userId, content });

        return res.status(201).json({
            message: "comment added successfully",
            data: newComment,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});