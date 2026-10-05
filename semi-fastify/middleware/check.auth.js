import jwt from "jsonwebtoken";

export async function checkAuth(req, reply) {
    const token = req.cookies.node_api_token;

    if (!token) {
        return reply.status(401).send({ error: "Unauthenticated" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return reply.status(401).send({ error: "Unauthenticated" });
    }
}