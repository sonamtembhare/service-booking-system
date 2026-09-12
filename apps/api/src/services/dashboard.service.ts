import pool from "../config/db";

export const getDashboardStats = async () => {
    const result = await pool.query(`
    SELECT
      COUNT(*) AS total_bookings,

      COUNT(*) FILTER (
        WHERE status = 'pending'
      ) AS pending_bookings,

      COUNT(*) FILTER (
        WHERE status = 'confirmed'
      ) AS confirmed_bookings,

      COUNT(*) FILTER (
        WHERE status = 'completed'
      ) AS completed_bookings,

      COUNT(*) FILTER (
        WHERE status = 'cancelled'
      ) AS cancelled_bookings,

      COALESCE(
        SUM(amount) FILTER (
          WHERE status != 'cancelled'
        ),
        0
      ) AS total_revenue

    FROM bookings
  `);

    return result.rows[0];
};