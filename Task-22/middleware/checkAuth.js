export async function checkAuth(req, res, next) {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ error: "Unauthorized: Please log in first" });
        }

        req.user = req.session.user;

        return next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({ error: "Invalid session" });
    }
}