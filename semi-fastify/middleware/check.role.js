export function checkRole(...roles) {
    return async (req, reply) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return reply.status(403).send({ error: "forbidden" });
        }
    };
}