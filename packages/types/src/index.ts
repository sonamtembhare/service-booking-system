export interface User {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
  created_at?: string;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  user_id?: number;
  service_id: number;
  service_name: string;
  duration_minutes?: number;
  booking_date: string;
  booking_time: string;
  amount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
  updated_at?: string;
}

export interface AdminBooking extends Booking {
  customer_name: string;
  customer_email: string;
}

export interface DashboardStats {
  total_bookings: string;
  pending_bookings: string;
  confirmed_bookings: string;
  completed_bookings: string;
  cancelled_bookings: string;
  total_revenue: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}
