import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(2, 'username must be at least 2 characters'),
    email: z.string().email('invalid email address'),
    password: z
        .string()
        .min(8, 'password must be at least 8 characters')
        .regex(/[A-Z]/, 'password must contain uppercase letter')
        .regex(/[a-z]/, 'password must contain lowercase letter')
        .regex(/[0-9]/, 'password must contain digit')
        .regex(/[^A-Za-z0-9]/, 'password must contain special character'),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'passwords must match',
    path: ['password_confirmation'],
});

export const loginSchema = z.object({
    email: z.email('invalid email address'),
    password: z.string().min(8, 'password must be at least 8 characters'),
});