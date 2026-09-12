import { z } from "zod";

export const createBookingSchema = z.object({
    service_id: z
        .number()
        .int("Service ID must be a whole number")
        .positive("Service ID must be greater than 0"),

    booking_date: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Date must be in YYYY-MM-DD format"
        ),

    booking_time: z
        .string()
        .regex(
            /^([01]\d|2[0-3]):[0-5]\d$/,
            "Time must be in HH:MM format"
        ),
});

export const updateBookingStatusSchema = z.object({
    status: z.enum([
        "pending",
        "confirmed",
        "cancelled",
        "completed",
    ]),
});

export type CreateBookingInput = z.infer<
    typeof createBookingSchema
>;

export type UpdateBookingStatusInput = z.infer<
    typeof updateBookingStatusSchema
>;