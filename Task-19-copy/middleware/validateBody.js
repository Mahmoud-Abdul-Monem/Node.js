import { z } from 'zod';

export function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const treeified = z.treeifyError(result.error);

            return res.status(422).json({
                errors: treeified.properties || {}
            });
        }

        req.body = result.data;
        next();
    };
}