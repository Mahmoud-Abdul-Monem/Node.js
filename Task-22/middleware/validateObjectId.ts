import type { Request, Response, NextFunction } from 'express';
import mongoose from "mongoose";

export function validateObjectId(paramName = "id") {
    return (req: Request, res: Response, next: NextFunction) => {
        const id = req.params[paramName];

        if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: `Invalid ${paramName} format` });
        }

        next();
    };
}
