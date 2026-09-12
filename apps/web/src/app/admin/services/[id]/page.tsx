"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { servicesAPI } from "@/lib/api";
import type { Service } from "@repo/types";
import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import Modal from "@/components/common/Modal";

export default function AdminServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    servicesAPI
      .getById(id)
      .then((res) => setService(res.service))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await servicesAPI.delete(id);
      toast.success("Service deleted successfully");
      router.push("/admin/services");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
    setDeleting(false);
  };

  const handleToggleActive = async () => {
    if (!service) return;
    try {
      await servicesAPI.update(id, { is_active: !service.is_active });
      toast.success(`Service ${!service.is_active ? "activated" : "deactivated"}`);
      setService({ ...service, is_active: !service.is_active });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  if (loading) return <Loader fullPage />;
  if (error) return <div className="dashboard-content"><ErrorMessage message={error} /></div>;
  if (!service) return null;

  return (
    <div>
      <button
        onClick={() => router.back()}
        style={{ background: "none", border: "none", color: "var(--primary)", fontSize: 14, marginBottom: 24, cursor: "pointer" }}
      >
        &larr; Back to Services
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Service Details</h1>
        <div className="flex gap-2">
          <Link href={`/admin/services/${id}/edit`}>
            <Button variant="outline">Edit Service</Button>
          </Link>
          <Button variant={service.is_active ? "secondary" : "primary"} onClick={handleToggleActive}>
            {service.is_active ? "Deactivate" : "Activate"}
          </Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="card" style={{ padding: 32 }}>
        <div className="flex justify-between items-center mb-4">
          <h2 style={{ fontSize: 22, fontWeight: 600 }}>{service.name}</h2>
          <span className={`badge ${service.is_active ? "badge-active" : "badge-inactive"}`}>
            {service.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        <p style={{ fontSize: 20, fontWeight: 700, color: "var(--primary)", marginBottom: 16 }}>
          Rs. {service.price}
        </p>

        {service.description && (
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.7 }}>
            {service.description}
          </p>
        )}

        <div className="grid grid-2" style={{ maxWidth: 400 }}>
          <div className="card" style={{ padding: 16 }}>
            <div className="text-secondary" style={{ fontSize: 13, marginBottom: 4 }}>Duration</div>
            <div style={{ fontWeight: 600 }}>{service.duration_minutes} minutes</div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="text-secondary" style={{ fontSize: 13, marginBottom: 4 }}>Service ID</div>
            <div style={{ fontWeight: 600 }}>#{service.id}</div>
          </div>
        </div>

        <div className="mt-4 text-secondary" style={{ fontSize: 13 }}>
          Created: {new Date(service.created_at).toLocaleDateString()}
          &nbsp;&middot;&nbsp;
          Updated: {new Date(service.updated_at).toLocaleDateString()}
        </div>
      </div>

      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Service"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button>
          </>
        }
      >
        <p className="confirm-text">
          Are you sure you want to delete <strong>{service.name}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
