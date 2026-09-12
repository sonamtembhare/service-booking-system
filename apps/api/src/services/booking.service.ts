import pool from "../config/db";

import type {
    CreateBookingInput,
    UpdateBookingStatusInput,
} from "../validators/booking.validator";


// Create booking
export const createBooking = async (
    userId: number,
    data: CreateBookingInput
) => {
    const {
        service_id,
        booking_date,
        booking_time,
    } = data;

    // 1. Check service exists and is active
    const serviceResult = await pool.query(
        `SELECT id, name, price, duration_minutes
     FROM services
     WHERE id = $1
     AND is_active = true`,
        [service_id]
    );

    if (serviceResult.rows.length === 0) {
        throw new Error("Service not found or inactive");
    }

    const service = serviceResult.rows[0];

    // 2. Check if slot is already booked
    const existingBooking = await pool.query(
        `SELECT id
     FROM bookings
     WHERE service_id = $1
     AND booking_date = $2
     AND booking_time = $3
     AND status != 'cancelled'`,
        [
            service_id,
            booking_date,
            booking_time,
        ]
    );

    if (existingBooking.rows.length > 0) {
        throw new Error(
            "This time slot is already booked"
        );
    }

    // 3. Get price from database
    const amount = service.price;

    // 4. Create booking
    const result = await pool.query(
        `INSERT INTO bookings
      (
        user_id,
        service_id,
        booking_date,
        booking_time,
        amount,
        status
      )
     VALUES
      ($1, $2, $3, $4, $5, 'pending')
     RETURNING *`,
        [
            userId,
            service_id,
            booking_date,
            booking_time,
            amount,
        ]
    );

    return result.rows[0];
};


// Get customer's bookings
export const getCustomerBookings = async (
    userId: number
) => {
    const result = await pool.query(
        `SELECT
       b.id,
       b.booking_date,
       b.booking_time,
       b.amount,
       b.status,
       b.created_at,

       s.id AS service_id,
       s.name AS service_name,
       s.duration_minutes

     FROM bookings b

     JOIN services s
       ON b.service_id = s.id

     WHERE b.user_id = $1

     ORDER BY
       b.booking_date DESC,
       b.booking_time DESC`,
        [userId]
    );

    return result.rows;
};


// Cancel booking
export const cancelBooking = async (
    userId: number,
    bookingId: number
) => {
    // 1. Find customer's booking
    const bookingResult = await pool.query(
        `SELECT *
     FROM bookings
     WHERE id = $1
     AND user_id = $2`,
        [bookingId, userId]
    );

    if (bookingResult.rows.length === 0) {
        throw new Error(
            "Booking not found"
        );
    }

    const booking = bookingResult.rows[0];

    // 2. Don't cancel already cancelled booking
    if (booking.status === "cancelled") {
        throw new Error(
            "Booking is already cancelled"
        );
    }

    // 3. Don't cancel completed booking
    if (booking.status === "completed") {
        throw new Error(
            "Completed booking cannot be cancelled"
        );
    }

    // 4. Update status
    const result = await pool.query(
        `UPDATE bookings
     SET
       status = 'cancelled',
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
        [bookingId]
    );

    return result.rows[0];
};


// Get all bookings - Admin
export const getAllBookings = async () => {
    const result = await pool.query(
        `SELECT
       b.id,
       b.booking_date,
       b.booking_time,
       b.amount,
       b.status,
       b.created_at,

       u.id AS user_id,
       u.name AS customer_name,
       u.email AS customer_email,

       s.id AS service_id,
       s.name AS service_name

     FROM bookings b

     JOIN users u
       ON b.user_id = u.id

     JOIN services s
       ON b.service_id = s.id

     ORDER BY b.created_at DESC`
    );

    return result.rows;
};


// Update booking status - Admin
export const updateBookingStatus = async (
    bookingId: number,
    data: UpdateBookingStatusInput
) => {
    const existingBooking = await pool.query(
        `SELECT id
     FROM bookings
     WHERE id = $1`,
        [bookingId]
    );

    if (existingBooking.rows.length === 0) {
        throw new Error(
            "Booking not found"
        );
    }

    const result = await pool.query(
        `UPDATE bookings
     SET
       status = $1,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
        [
            data.status,
            bookingId,
        ]
    );

    return result.rows[0];
};