"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { fetchAllBookings } from "@/store/slices/bookingSlice";
import BookingTable from "@/components/admin/BookingTable";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function AdminBookingsPage() {
  const dispatch = useDispatch();
  const { allBookings, loading, error } = useSelector((state: RootState) => state.bookings);

  useEffect(() => {
    dispatch(fetchAllBookings() as any);
  }, [dispatch]);

  if (loading && allBookings.length === 0) return <Loader fullPage />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Bookings</h1>
      <p className="text-secondary mb-6">Manage all customer bookings</p>

      <BookingTable bookings={allBookings} />
    </div>
  );
}
