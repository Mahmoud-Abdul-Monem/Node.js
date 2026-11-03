import { Router } from 'express';
import { validateBody } from '@middleware/validateBody.ts';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '@validation/auth.schema.js';
import { checkAuth } from '@middleware/checkAuth.ts';
import { upload } from '@middleware/upload.ts';
import { User } from "@models/User.ts";
import { successRes, errorRes } from '@utils/responses.js';
import bcrypt from "bcrypt";
import type { Request, Response, NextFunction } from 'express';

export const authRouter = Router();

authRouter.post('/register', upload.single('image'), validateBody(registerSchema), async (req, res) => {
    const { username, password, email } = req.body
    const image = req.file ? req.file.filename : null
    const newUser = new User({ username, email, password, image })
    const userResponse: any = newUser.toObject()
    await newUser.save()
    delete userResponse.password;
    delete userResponse.resetOtp;
    delete userResponse.resetOtpExpires;
    return successRes(res, { user: userResponse }, "register successful, you can now login", 201);

});

authRouter.post('/login', validateBody(loginSchema), async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email });
    if (!user) {
        return errorRes(res, "invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return errorRes(res, "invalid email or password", 401);
    }
    (req.session as any).user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
    return successRes(res, { user: (req.session as any).user }, "login successful", 200);

});

authRouter.post('/logout', async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }

        res.clearCookie('movie_session');

        return successRes(res, null, "logout successful", 200);
    })
});

authRouter.post('/forgot-password', validateBody(forgotPasswordSchema), async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email });
    if (!user) {
        return errorRes(res, "user with this email does not exist", 404);
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetOtp = otp;
    user.resetOtpExpires = otpExpires;
    await user.save();

    return successRes(res, { otp }, "otp generated successfully", 200);

});

authRouter.post('/reset-password', validateBody(resetPasswordSchema), async (req, res) => {
    const { email, otp, new_password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        return errorRes(res, "user with this email does not exist", 404);
    }
    if (!user.resetOtp || user.resetOtp !== otp || (user.resetOtpExpires && user.resetOtpExpires < new Date())) {
        return errorRes(res, "invalid or expired otp", 400);
    }
    user.password = new_password;
    user.resetOtp = undefined
    user.resetOtpExpires = undefined
    await user.save()
    return successRes(res, null, "password reset successful, you can now login", 200);


});

authRouter.get('/me', checkAuth, async (req, res) => {
    return successRes(res, { user: req.user })
});