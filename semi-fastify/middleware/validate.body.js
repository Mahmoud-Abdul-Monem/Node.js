import z from "zod";

export function validateBody(schema) {
    return async (req, reply) => {
        const result = schema.safeParse(req.body);

        if (result.success) {
            req.body = result.data;
        } else {
            const tree = z.treeifyError(result.error);
            return reply.status(422).send({
                errors: tree.properties || tree.error
            });
        }
    };
}