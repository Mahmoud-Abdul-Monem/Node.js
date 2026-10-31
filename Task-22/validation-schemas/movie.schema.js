import { z } from 'zod';

export const createMovieSchema = z.object({
    title: z.string().min(1, "title is required"),
    year: z.coerce.number()
        .min(1888, "year must be 1888 or later")
        .max(2100, "year cannot exceed 2100"),
    genres: z.union([
        z.string().transform(val => val.split(',').map(g => g.trim()).filter(Boolean)),
        z.array(z.string())
    ]),
    description: z.string().min(1, "description is required"),
    trailerLink: z.url("invalid trailer link URL"),
    director: z.string().min(1, "director is required"),
    actors: z.union([
        z.string().transform(val => {
            try { return JSON.parse(val); } catch { return [val].filter(Boolean); }
        }),
        z.array(z.string())
    ]).optional()
});

export const updateMovieSchema = createMovieSchema.partial();