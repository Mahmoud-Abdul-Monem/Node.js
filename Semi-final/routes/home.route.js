import { Router } from "express";
import { checkAuth } from "../middleware/check.auth.js";


export const homeRouter = Router()

homeRouter.get("/home", checkAuth , (req, res) => {
    res.json({ message: `Welcome to the home page, user ${req.user.email}!` });
});