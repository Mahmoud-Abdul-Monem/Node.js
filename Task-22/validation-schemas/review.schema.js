import { z } from 'zod';

export const createReviewSchema = z.object({
    number: z.coerce.number()
        .min(0, "rating must be between 0 and 10")
        .max(10, "rating must be between 0 and 10"),
    comment: z.string().optional()
});

export const updateReviewSchema = createReviewSchema.partial();