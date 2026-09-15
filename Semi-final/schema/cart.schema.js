import z from "zod";

export const cartSchema = z.object({
    productId: z.string(),
    quantity: z.number().int().positive()
});

export const updateCartSchema = z.object({
    quantity: z.number().int().positive(),
});