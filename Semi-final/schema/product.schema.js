import { z } from "zod";

export const productSchema = z.object({
    name: z.string(),
    desc: z.string(),
    price: z.coerce.number().positive(), 
    img: z.string().optional(),
});