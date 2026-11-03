import { Router } from 'express';
import { validateBody } from '../middleware/validateBody.js';
import { checkAuth } from '../middleware/checkAuth.js';
import { findUserByEmail, createUser, verifyPassword } from '../queries/auth.queries.js';
import { loginSchema, registerSchema } from '../validation-schema/auth.js';

export const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(422).json({
                errors: { email: { errors: ['email already in use'] } },
            });
        }

        await createUser({ username, email, password });

        return res.status(201).json({ message: 'register successful, you can now login' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

authRouter.post('/login', validateBody(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'invalid email or password' });
        }

        const validPassword = await verifyPassword(password, user.passwordHash);
        if (!validPassword) {
            return res.status(401).json({ error: 'invalid email or password' });
        }

        req.session.userId = user.id;

        return res.status(200).json({
            message: 'login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                },
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

authRouter.post('/logout', checkAuth, async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.clearCookie('blog_session');
            return res.status(200).json({ message: 'logout successful' });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

authRouter.get('/me', checkAuth, (req, res) => {
    return res.status(200).json({
        data: {
            user: req.user,
        },
    });
});