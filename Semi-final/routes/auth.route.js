import { Router } from "express";
import { validateBody } from "../middleware/validate.body.js";
import { registerSchema } from "../schema/register.schema.js";
import { loginSchema } from "../schema/login.schema.js";
import { createDB } from "../db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



export const authRouter = Router()
const db = createDB();
authRouter.post("/register", validateBody(registerSchema), async (req, res, next) => {
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const users = await db.getAll("auth_users");

    const existingUser = users.find((u) => u.email === req.body.email);
    if (existingUser) {
        return res.status(422).json({ error: "email is taken" });
    }

    await db.create("auth_users", {
        username: req.body.username,
        email: req.body.email,
        password: passwordHash,
        role: req.body.role,
    });

    res.status(201).json({ message: "register successful" });
});

authRouter.post("/login", validateBody(loginSchema), async (req, res, next) => {
    const users = await db.getAll("auth_users");
    const existingUser = users.find((el) => el.email === req.body.email);
    if (!existingUser) return res.status(422).json({ error: "invalid credentials" });

    const checkHash = await bcrypt.compare(req.body.password, existingUser.password);
    if (!checkHash) return res.status(422).json({ error: "email or password is incorrect" });

    const payload = {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
        role: existingUser.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.cookie("node_api_token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000 * 24
    });

    res.status(200).json({
        message: "login successful",
        data: { user: payload }
    });
});
authRouter.post("/logout", (req, res, next) => {
    res.clearCookie("node_token_api")

    res.json({ message: "logout successful" });


})



