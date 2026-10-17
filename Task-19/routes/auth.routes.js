import { Router } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { registerSchema } from "../validation-schemas/auth.js";
import { validateBody } from "../middleware/validateBody.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { createUser, findUserByEmail, createSession, deleteSession } from "../queries/auth.queries.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(422).json({
                errors: { email: { errors: ["email already in use"] } }
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await createUser({ username, email, passwordHash });

        return res.status(201).json({ message: "register successful, you can now login" });
    } catch (err) {
        next(err);
    }
});

authRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "invalid email or password" });
        }

        const sessionId = crypto.randomBytes(32).toString("hex");

        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

        await createSession(user.id, sessionId, expiresAt);

        res.cookie("blog_session", sessionId, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, 
        });

        return res.status(200).json({
            message: "login successful",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                }
            }
        });
    } catch (err) {
        next(err);
    }
});

authRouter.post("/logout", checkAuth, async (req, res, next) => {
    try {
        const sessionId = req.cookies?.blog_session;
        if (sessionId) {
            await deleteSession(sessionId);
        }
        res.clearCookie("blog_session");
        return res.status(200).json({ message: "logout successful" });
    } catch (err) {
        next(err);
    }
});

authRouter.get("/me", checkAuth, async (req, res, next) => {
    return res.status(200).json({
        data: {
            user: req.user
        }
    });
});