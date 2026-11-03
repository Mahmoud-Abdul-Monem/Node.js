import { forgotPasswordSchema, resetPasswordSchema } from "../validation-schemas/auth.schema.js";
import { Router } from 'express';
import { checkAuth } from "../middleware/checkAuth.js"
import { upload } from "../middleware/upload.js"
import { validateBody } from "../middleware/validateBody.js"
import { registerSchema, loginSchema } from "../validation-schemas/auth.schema.js";
import { User } from "../models/User.js"
import bcrypt from "bcrypt"
const router = Router();

router.post('/register', upload.single('image'), validateBody(registerSchema), async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const image = req.file ? req.file.filename : null;

        const newUser = new User({
            username,
            email,
            password,
            image
        });

        await newUser.save().then()

        const userResponse = newUser.toObject();
        delete userResponse.password;
        delete userResponse.resetOtp;
        delete userResponse.resetOtpExpires;

        return res.status(201).json({
            message: "register successful, you can now login",
            data: {
                user: userResponse
            }
        });
    } catch (err) {
        next(err);
    }
});

router.post('/login', validateBody(loginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "invalid email or password" });
        }

        req.session.user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            image: user.image,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return res.status(200).json({
            message: "login successful",
            data: {
                user: req.session.user
            }
        });
    } catch (err) {
        next(err);
    }
});

router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }

        res.clearCookie('movie_session');

        return res.status(200).json({
            message: "logout successful"
        });
    });
});


router.post('/forgot-password', validateBody(forgotPasswordSchema), async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "user with this email does not exist" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

        user.resetOtp = otp;
        user.resetOtpExpires = otpExpires;
        await user.save();

        return res.status(200).json({
            message: "otp generated successfully",
            otp: otp
        });
    } catch (err) {
        next(err);
    }
});
router.post('/reset-password', validateBody(resetPasswordSchema), async (req, res, next) => {
    try {
        const { email, otp, new_password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "user with this email does not exist" });
        }

        if (!user.resetOtp || user.resetOtp !== otp || user.resetOtpExpires < new Date()) {
            return res.status(400).json({ error: "invalid or expired otp" });
        }

        user.password = new_password;
        user.resetOtp = undefined;
        user.resetOtpExpires = undefined;
        await user.save();

        return res.status(200).json({
            message: "password reset successful, you can now login"
        });
    } catch (err) {
        next(err);
    }
});

router.get('/me', checkAuth, (req, res) => {
    res.status(200).json({
        data: {
            user: req.user
        }
    });
});
export default router;
