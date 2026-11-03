import { z } from 'zod';

export const createPostSchema = z.object({
    content: z.string().min(1, 'post content cannot be empty').max(5000, 'content is too long'),
});