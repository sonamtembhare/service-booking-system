import { Request, Response } from "express";

import {
    createBooking,
    getCustomerBookings,
    cancelBooking,
    getAllBookings,
    updateBookingStatus,
} from "../services/booking.service";

import {
    createBookingSchema,
    updateBookingStatusSchema,
} from "../validators/booking.validator";


// Create booking
export const create = async (
    req: Request,
    res: Response
) => {
    try {
        // userId will come from JWT middleware
        const userId = (req as any).user.userId;

        const data = createBookingSchema.parse(req.body);

        const booking = await createBooking(
            userId,
            data
        );

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking,
        });
    } catch (error: any) {
        console.error(error);

        res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to create booking",
        });
    }
};


// Get customer's bookings
export const getMyBookings = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = (req as any).user.userId;

        const bookings =
            await getCustomerBookings(userId);

        res.status(200).json({
            success: true,
            bookings,
        });
    } catch (error: any) {
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch your bookings",
        });
    }
};


// Cancel customer's booking
export const cancel = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = (req as any).user.userId;

        const bookingId = Number(
            req.params.id
        );

        if (isNaN(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID",
            });
        }

        const booking =
            await cancelBooking(
                userId,
                bookingId
            );

        res.status(200).json({
            success: true,
            message:
                "Booking cancelled successfully",
            booking,
        });
    } catch (error: any) {
        console.error(error);

        res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to cancel booking",
        });
    }
};


// Get all bookings - Admin
export const getAll = async (
    req: Request,
    res: Response
) => {
    try {
        const bookings =
            await getAllBookings();

        res.status(200).json({
            success: true,
            bookings,
        });
    } catch (error: any) {
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch bookings",
        });
    }
};


// Update booking status - Admin
export const updateStatus = async (
    req: Request,
    res: Response
) => {
    try {
        const bookingId = Number(
            req.params.id
        );

        if (isNaN(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID",
            });
        }

        const data =
            updateBookingStatusSchema.parse(
                req.body
            );

        const booking =
            await updateBookingStatus(
                bookingId,
                data
            );

        res.status(200).json({
            success: true,
            message:
                "Booking status updated successfully",
            booking,
        });
    } catch (error: any) {
        console.error(error);

        res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to update booking status",
        });
    }
};