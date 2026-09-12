import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Booking, AdminBooking } from "@repo/types";
import { bookingsAPI } from "@/lib/api";

export interface BookingState {
  myBookings: Booking[];
  allBookings: AdminBooking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  myBookings: [],
  allBookings: [],
  loading: false,
  error: null,
};

export const fetchMyBookings = createAsyncThunk(
  "bookings/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await bookingsAPI.getMy();
      return res.bookings;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch bookings");
    }
  }
);

export const createBooking = createAsyncThunk(
  "bookings/create",
  async (data: { service_id: number; booking_date: string; booking_time: string }, { rejectWithValue }) => {
    try {
      const res = await bookingsAPI.create(data);
      return res.booking;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to create booking");
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancel",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await bookingsAPI.cancel(id);
      return res.booking;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to cancel booking");
    }
  }
);

export const fetchAllBookings = createAsyncThunk(
  "bookings/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await bookingsAPI.getAll();
      return res.bookings;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch bookings");
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "bookings/updateStatus",
  async ({ id, status }: { id: number; status: "pending" | "confirmed" | "cancelled" | "completed" }, { rejectWithValue }) => {
    try {
      const res = await bookingsAPI.updateStatus(id, { status });
      return res.booking;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to update booking status");
    }
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookingError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const idx = state.myBookings.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) {
          state.myBookings[idx] = action.payload;
        }
      })
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.allBookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const idx = state.allBookings.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) {
          state.allBookings[idx] = { ...state.allBookings[idx], ...action.payload } as AdminBooking;
        }
      });
  },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
