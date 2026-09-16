import z from "zod";


export const cartSchema = z.object({
    id: z.string(), 
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    image: z.string().optional(),
    quantity: z.number().optional().default(1),
});
export const updateCartSchema = z.object({
    quantity: z.number().int().positive(),
});