import { z } from "zod";

export const productSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.coerce.number().positive(),
    image: z.string().optional(),
});