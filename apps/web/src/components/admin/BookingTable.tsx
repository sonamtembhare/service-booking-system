"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { RootState } from "@/store/store";
import { updateBookingStatus } from "@/store/slices/bookingSlice";
import type { AdminBooking } from "@repo/types";
import Button from "@/components/common/Button";

export default function BookingTable({ bookings }: { bookings: AdminBooking[] }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.bookings);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusChange = async (id: number, status: AdminBooking["status"]) => {
    setUpdatingId(id);
    const result = await dispatch(updateBookingStatus({ id, status }) as any);
    if (updateBookingStatus.fulfilled.match(result)) {
      toast.success("Booking status updated");
    } else {
      toast.error(result.payload as string);
    }
    setUpdatingId(null);
  };

  if (bookings.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-message">No bookings found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>#{b.id}</td>
                <td>
                  <div>{b.customer_name}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>{b.customer_email}</div>
                </td>
                <td>{b.service_name}</td>
                <td>{b.booking_date}</td>
                <td>{b.booking_time}</td>
                <td>Rs. {b.amount}</td>
                <td>
                  <span className={`badge badge-${b.status}`}>{b.status}</span>
                </td>
                <td>
                  <select
                    className="form-select"
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.id, e.target.value as AdminBooking["status"])}
                    disabled={loading && updatingId === b.id}
                    style={{ width: "auto", minWidth: 110, padding: "4px 8px", fontSize: 13 }}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div style={{ display: "none" }}>
        {bookings.map((b) => (
          <div key={b.id} className="card mb-4">
            <div className="flex justify-between items-center mb-2">
              <strong>#{b.id}</strong>
              <span className={`badge badge-${b.status}`}>{b.status}</span>
            </div>
            <p style={{ fontSize: 14 }}><strong>Customer:</strong> {b.customer_name}</p>
            <p style={{ fontSize: 14 }}><strong>Service:</strong> {b.service_name}</p>
            <p style={{ fontSize: 14 }}><strong>Date:</strong> {b.booking_date} at {b.booking_time}</p>
            <p style={{ fontSize: 14 }}><strong>Amount:</strong> Rs. {b.amount}</p>
            <div className="mt-3">
              <select
                className="form-select"
                value={b.status}
                onChange={(e) => handleStatusChange(b.id, e.target.value as AdminBooking["status"])}
                disabled={loading && updatingId === b.id}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .table-wrapper { display: none !important; }
          div[style*="display: none"] { display: block !important; }
        }
      `}</style>
    </>
  );
}
