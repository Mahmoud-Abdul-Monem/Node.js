import z from "zod"
export function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (result.success) {
            next();
        } else {
            return res
                .status(422)
                .json({ errors: z.treeifyError(result.error).properties });
        }
    };

}

export function validateParams(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);

        if (result.success) {
            next();
        } else {
            return res
                .status(422)
                .json({ errors: z.treeifyError(result.error).properties });
        }
    };
}

export function validateQuery(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);

        if (result.success) {
            next();
        } else {
            return res
                .status(422)
                .json({ errors: z.treeifyError(result.error).properties });
        }
    };
}