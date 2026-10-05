import { checkAuth } from "../middleware/check.auth.js";

export async function homeRouter(fastify) {
    fastify.get("/home", { preHandler: checkAuth }, async (req, reply) => {
        return reply.send({ message: `Welcome to the home page, user ${req.user.email}!` });
    });
}