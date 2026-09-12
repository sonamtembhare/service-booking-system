"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { RootState } from "@/store/store";
import { createBooking } from "@/store/slices/bookingSlice";
import { servicesAPI } from "@/lib/api";
import type { Service } from "@repo/types";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";

const bookingSchema = z.object({
  booking_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((val) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(val);
      return selected >= today;
    }, "Booking date must be today or in the future"),
  booking_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in HH:MM format"),
});

type BookingForm = z.infer<typeof bookingSchema>;

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

function BookingFormInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.bookings);
  const [service, setService] = useState<Service | null>(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const serviceId = Number(searchParams.get("serviceId"));

  useEffect(() => {
    if (!serviceId) {
      setFetchError("No service selected. Please select a service first.");
      setFetching(false);
      return;
    }
    servicesAPI
      .getById(serviceId)
      .then((res) => setService(res.service))
      .catch((err) => setFetchError(err.message))
      .finally(() => setFetching(false));
  }, [serviceId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      booking_date: "",
      booking_time: "",
    },
  });

  const onSubmit = async (data: BookingForm) => {
    if (!serviceId) return;
    const result = await dispatch(createBooking({ service_id: serviceId, ...data }) as any);
    if (createBooking.fulfilled.match(result)) {
      toast.success("Booking created successfully!");
      router.push("/customer/bookings");
    } else {
      toast.error(result.payload as string);
    }
  };

  if (fetching) return <Loader fullPage />;
  if (fetchError) return <div className="container" style={{ padding: "40px 0" }}><ErrorMessage message={fetchError} /></div>;
  if (!service) return null;

  return (
    <div className="container" style={{ padding: "40px 0", maxWidth: 640 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Book Service</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
        Select your preferred date and time
      </p>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="flex justify-between items-center">
          <div>
            <h3 style={{ fontWeight: 600 }}>{service.name}</h3>
            <p className="text-secondary" style={{ fontSize: 14 }}>{service.duration_minutes} minutes</p>
          </div>
          <p style={{ fontWeight: 700, color: "var(--primary)", fontSize: 18 }}>Rs. {service.price}</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Booking Date"
            type="date"
            error={errors.booking_date?.message}
            {...register("booking_date")}
          />

          <div className="form-group">
            <label className="form-label">Booking Time</label>
            <select
              className="form-select"
              {...register("booking_time")}
            >
              <option value="">Select a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.booking_time && (
              <p className="form-error">{errors.booking_time.message}</p>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} style={{ flex: 2 }}>
              Confirm Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<Loader fullPage />}>
      <BookingFormInner />
    </Suspense>
  );
}
