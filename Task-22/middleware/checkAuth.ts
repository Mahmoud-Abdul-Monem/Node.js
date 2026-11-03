import type { Request, Response, NextFunction } from 'express';
export async function checkAuth(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.session || !(req.session as any).user) {
            return res.status(401).json({ error: "Unauthorized: Please log in first" });
        }

        req.user = (req.session as any).user as Express.UserSession;

        return next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({ error: "Invalid session" });
    }
}
