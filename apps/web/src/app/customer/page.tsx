"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { fetchMyBookings } from "@/store/slices/bookingSlice";
import Loader from "@/components/common/Loader";
import Link from "next/link";

export default function CustomerDashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { myBookings, loading } = useSelector((state: RootState) => state.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings() as any);
  }, [dispatch]);

  const stats = useMemo(() => {
    const total = myBookings.length;
    const pending = myBookings.filter((b) => b.status === "pending").length;
    const confirmed = myBookings.filter((b) => b.status === "confirmed").length;
    const completed = myBookings.filter((b) => b.status === "completed").length;
    const cancelled = myBookings.filter((b) => b.status === "cancelled").length;
    return { total, pending, confirmed, completed, cancelled };
  }, [myBookings]);

  if (loading && myBookings.length === 0) return <Loader fullPage />;

  return (
    <div className="container" style={{ padding: "40px 0" }}>
      <div className="mb-6">
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Welcome back, {user?.name}!</h1>
        <p className="text-secondary">Here&apos;s an overview of your salon bookings</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Bookings</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-value">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card info">
          <span className="stat-value">{stats.confirmed}</span>
          <span className="stat-label">Confirmed</span>
        </div>
        <div className="stat-card success">
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card danger">
          <span className="stat-value">{stats.cancelled}</span>
          <span className="stat-label">Cancelled</span>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Recent Bookings</h2>
          <Link href="/customer/bookings" className="btn btn-outline btn-sm">
            View All
          </Link>
        </div>

        {myBookings.length === 0 ? (
          <p className="text-muted text-center" style={{ padding: 32 }}>
            You have no bookings yet.{" "}
            <Link href="/services" style={{ color: "var(--primary)" }}>
              Browse salon services
            </Link>{" "}
            to get started.
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myBookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.service_name}</td>
                    <td>{booking.booking_date}</td>
                    <td>{booking.booking_time}</td>
                    <td>
                      <span className={`badge badge-${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
