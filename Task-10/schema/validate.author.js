import z from "zod"
export const authorSchema = z.object({
    name: z.string().trim().min(2),
    age: z.number().min(12),
    email: z.email()
})


export const authorParamsSchema = z.object({
    author_id: z.coerce.number().positive("ID must be a positive number"),
});

export const authorQuerySchema = z.object({
    search: z.string().trim().min(1, "Search cannot be empty").optional(),
});