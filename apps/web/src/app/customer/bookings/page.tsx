"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { RootState } from "@/store/store";
import { fetchMyBookings, cancelBooking } from "@/store/slices/bookingSlice";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import EmptyState from "@/components/common/EmptyState";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";

export default function CustomerBookingsPage() {
  const dispatch = useDispatch();
  const { myBookings, loading, error } = useSelector((state: RootState) => state.bookings);
  const [cancelId, setCancelId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchMyBookings() as any);
  }, [dispatch]);

  const handleCancel = async () => {
    if (!cancelId) return;
    const result = await dispatch(cancelBooking(cancelId) as any);
    if (cancelBooking.fulfilled.match(result)) {
      toast.success("Booking cancelled successfully");
    } else {
      toast.error(result.payload as string);
    }
    setCancelId(null);
  };

  if (loading && myBookings.length === 0) return <Loader fullPage />;
  if (error) return <div className="container" style={{ padding: "40px 0" }}><ErrorMessage message={error} /></div>;

  return (
    <div className="container" style={{ padding: "40px 0" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>My Bookings</h1>
      <p className="text-secondary mb-6">Manage all your salon and spa bookings</p>

      {myBookings.length === 0 ? (
        <EmptyState message="You have no salon bookings yet." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="table-wrapper" style={{ display: "block" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>#{booking.id}</td>
                    <td>{booking.service_name}</td>
                    <td>{booking.booking_date}</td>
                    <td>{booking.booking_time}</td>
                    <td>Rs. {booking.amount}</td>
                    <td>
                      <span className={`badge badge-${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      {booking.status !== "cancelled" && booking.status !== "completed" && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setCancelId(booking.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mobile-cards" style={{ display: "none" }}>
            {myBookings.map((booking) => (
              <div key={booking.id} className="card mb-4">
                <div className="flex justify-between items-center mb-2">
                  <strong>#{booking.id}</strong>
                  <span className={`badge badge-${booking.status}`}>{booking.status}</span>
                </div>
                <p style={{ fontSize: 14 }}><strong>Service:</strong> {booking.service_name}</p>
                <p style={{ fontSize: 14 }}><strong>Date:</strong> {booking.booking_date}</p>
                <p style={{ fontSize: 14 }}><strong>Time:</strong> {booking.booking_time}</p>
                <p style={{ fontSize: 14 }}><strong>Amount:</strong> Rs. {booking.amount}</p>
                {booking.status !== "cancelled" && booking.status !== "completed" && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-3"
                    onClick={() => setCancelId(booking.id)}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            ))}
          </div>

          <style>{`
            @media (max-width: 768px) {
              .table-wrapper { display: none !important; }
              .mobile-cards { display: block !important; }
            }
          `}</style>
        </>
      )}

      <Modal
        isOpen={cancelId !== null}
        onClose={() => setCancelId(null)}
        title="Cancel Booking"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelId(null)}>
              Keep Booking
            </Button>
            <Button variant="danger" onClick={handleCancel} loading={loading}>
              Yes, Cancel
            </Button>
          </>
        }
      >
        <p className="confirm-text">
          Are you sure you want to cancel booking <strong>#{cancelId}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
