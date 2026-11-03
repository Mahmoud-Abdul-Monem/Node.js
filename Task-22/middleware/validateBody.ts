import type { Request, Response, NextFunction } from 'express';
import z from "zod";

export function validateBody(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const result = schema.safeParse(body);

    if (result.success) {
      req.body = result.data;
      next();
    } else {
      return res
        .status(422)
        .json({ errors: (z as any).treeifyError(result.error).properties });
    }
  };
}
