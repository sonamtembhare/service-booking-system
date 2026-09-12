const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

import type { User } from "@repo/types";

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface ServicesResponse {
  success: boolean;
  services: import("@repo/types").Service[];
}

export interface ServiceResponse {
  success: boolean;
  service: import("@repo/types").Service;
}

export interface BookingsResponse {
  success: boolean;
  bookings: import("@repo/types").Booking[];
}

export interface AdminBookingsResponse {
  success: boolean;
  bookings: import("@repo/types").AdminBooking[];
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking: import("@repo/types").Booking;
}

export interface DashboardStatsResponse {
  success: boolean;
  stats: import("@repo/types").DashboardStats;
}

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<RegisterResponse>("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data),
};

export const servicesAPI = {
  getAll: () => api.get<ServicesResponse>("/services"),

  getById: (id: number) => api.get<ServiceResponse>(`/services/${id}`),

  create: (data: { name: string; description?: string; price: number; duration_minutes: number; is_active?: boolean }) =>
    api.post<{ success: boolean; message: string; service: import("@repo/types").Service }>("/services", data),

  update: (id: number, data: { name?: string; description?: string; price?: number; duration_minutes?: number; is_active?: boolean }) =>
    api.put<{ success: boolean; message: string; service: import("@repo/types").Service }>(`/services/${id}`, data),

  delete: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/services/${id}`),
};

export const bookingsAPI = {
  create: (data: { service_id: number; booking_date: string; booking_time: string }) =>
    api.post<BookingResponse>("/bookings", data),

  getMy: () => api.get<BookingsResponse>("/bookings/my"),

  cancel: (id: number) =>
    api.patch<BookingResponse>(`/bookings/${id}/cancel`),

  getAll: () => api.get<AdminBookingsResponse>("/bookings/admin/all"),

  updateStatus: (id: number, data: { status: "pending" | "confirmed" | "cancelled" | "completed" }) =>
    api.patch<{ success: boolean; message: string; booking: import("@repo/types").Booking }>(`/bookings/admin/${id}/status`, data),
};

export const dashboardAPI = {
  getStats: () => api.get<DashboardStatsResponse>("/dashboard/stats"),
};
