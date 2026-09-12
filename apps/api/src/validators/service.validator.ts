import { z } from "zod";

export const createServiceSchema = z.object({
    name: z
        .string()
        .min(2, "Service name must be at least 2 characters")
        .max(150, "Service name is too long"),

    description: z
        .string()
        .max(1000, "Description is too long")
        .optional(),

    price: z
        .number()
        .positive("Price must be greater than 0"),

    duration_minutes: z
        .number()
        .int("Duration must be a whole number")
        .positive("Duration must be greater than 0"),

    is_active: z
        .boolean()
        .optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;