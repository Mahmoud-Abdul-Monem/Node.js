import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(2, "username must be at least 2 characters"),
    email: z.email("invalid email format").transform(val => val.toLowerCase()),
    password: z.string()
        .min(8, "password must be at least 8 characters")
        .regex(/[A-Z]/, "password must contain at least 1 capital letter")
        .regex(/[a-z]/, "password must contain at least 1 small letter")
        .regex(/[0-9]/, "password must contain at least 1 digit")
        .regex(/[^A-Za-z0-9]/, "password must contain at least 1 special character"),
    password_confirmation: z.string()
}).refine(data => data.password === data.password_confirmation, {
    message: "passwords do not match",
    path: ["password_confirmation"]
});

export const loginSchema = z.object({
    email: z.email("invalid email format").transform(val => val.toLowerCase()),
    password: z.string().min(1, "password is required")
});

export const forgotPasswordSchema = z.object({
    email: z.email("invalid email format").transform(val => val.toLowerCase())
});

export const resetPasswordSchema = z.object({
    email: z.email("invalid email format").transform(val => val.toLowerCase()),
    otp: z.string().length(6, "otp must be 6 digits"),
    new_password: z.string()
        .min(8, "password must be at least 8 characters")
        .regex(/[A-Z]/, "password must contain at least 1 capital letter")
        .regex(/[a-z]/, "password must contain at least 1 small letter")
        .regex(/[0-9]/, "password must contain at least 1 digit")
        .regex(/[^A-Za-z0-9]/, "password must contain at least 1 special character"),
    new_password_confirmation: z.string()
}).refine(data => data.new_password === data.new_password_confirmation, {
    message: "passwords do not match",
    path: ["new_password_confirmation"]
});