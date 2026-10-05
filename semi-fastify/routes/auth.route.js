import { validateBody } from "../middleware/validate.body.js";
import { registerSchema } from "../schema/register.schema.js";
import { loginSchema } from "../schema/login.schema.js";
import { createDB } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const db = createDB();

export async function authRouter(fastify) {
    fastify.post("/register", { preHandler: validateBody(registerSchema) }, async (req, reply) => {
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const users = await db.getAll("auth_users");

        const existingUser = users.find((u) => u.email === req.body.email);
        if (existingUser) {
            return reply.status(422).send({ error: "email is taken" });
        }

        await db.create("auth_users", {
            username: req.body.username,
            email: req.body.email,
            password: passwordHash,
            role: req.body.role,
        });

        return reply.status(201).send({ message: "register successful" });
    });

    fastify.post("/login", { preHandler: validateBody(loginSchema) }, async (req, reply) => {
        const users = await db.getAll("auth_users");
        const existingUser = users.find((el) => el.email === req.body.email);
        if (!existingUser) return reply.status(422).send({ error: "invalid credentials" });

        const checkHash = await bcrypt.compare(req.body.password, existingUser.password);
        if (!checkHash) return reply.status(422).send({ error: "email or password is incorrect" });

        const payload = {
            id: existingUser.id,
            email: existingUser.email,
            username: existingUser.username,
            role: existingUser.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET);

        reply.setCookie("node_api_token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24
        });

        return reply.status(200).send({
            message: "login successful",
            data: { user: payload }
        });
    });




    
    fastify.post("/logout", async (req, reply) => {
        reply.clearCookie("node_api_token", { path: "/" });
        return reply.send({ message: "logout successful" });
    });
}