import z from "zod";

export function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (result.success) {
            next();
        } else {
            const tree = z.treeifyError(result.error);

            return res.status(422).json({
                errors: tree.properties || tree.error
            });
        }
    };
}