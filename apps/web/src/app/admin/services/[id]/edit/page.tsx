"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { servicesAPI } from "@/lib/api";
import type { Service } from "@repo/types";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";

const serviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(150, "Name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  duration_minutes: z.coerce.number().int("Duration must be a whole number").positive("Duration must be greater than 0"),
  is_active: z.boolean(),
});

type ServiceForm = z.infer<typeof serviceSchema>;

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [service, setService] = useState<Service | null>(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
  });

  useEffect(() => {
    servicesAPI
      .getById(id)
      .then((res) => {
        setService(res.service);
        reset({
          name: res.service.name,
          description: res.service.description || "",
          price: res.service.price,
          duration_minutes: res.service.duration_minutes,
          is_active: res.service.is_active,
        });
      })
      .catch((err) => setFetchError(err.message))
      .finally(() => setFetching(false));
  }, [id, reset]);

  const onSubmit = async (data: ServiceForm) => {
    setSubmitting(true);
    try {
      await servicesAPI.update(id, data);
      toast.success("Service updated successfully!");
      router.push(`/admin/services/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update service");
    }
    setSubmitting(false);
  };

  if (fetching) return <Loader fullPage />;
  if (fetchError) return <div className="dashboard-content"><ErrorMessage message={fetchError} /></div>;
  if (!service) return null;

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Edit Service</h1>
      <p className="text-secondary mb-6">Update service #{id} details</p>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Service Name"
            placeholder="e.g. Haircut"
            error={errors.name?.message}
            {...register("name")}
          />

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Brief description of the service"
              {...register("description")}
            />
            {errors.description && <p className="form-error">{errors.description.message}</p>}
          </div>

          <div className="grid grid-2">
            <Input
              label="Price (Rs.)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.price?.message}
              {...register("price")}
            />
            <Input
              label="Duration (minutes)"
              type="number"
              placeholder="30"
              error={errors.duration_minutes?.message}
              {...register("duration_minutes")}
            />
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                {...register("is_active")}
                style={{ width: 16, height: 16 }}
              />
              <span className="form-label" style={{ marginBottom: 0 }}>Active (visible to customers)</span>
            </label>
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
            <Button type="submit" loading={submitting} style={{ flex: 2 }}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
