import { z } from 'zod';

export const createActorSchema = z.object({
    name: z.string().min(1, "name is required"),
    birthdate: z.string().optional().transform(val => val ? new Date(val) : undefined)
});

export const updateActorSchema = createActorSchema.partial();