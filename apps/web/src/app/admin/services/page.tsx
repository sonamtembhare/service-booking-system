"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { servicesAPI } from "@/lib/api";
import type { Service } from "@repo/types";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadServices = () => {
    setLoading(true);
    servicesAPI
      .getAll()
      .then((res) => setServices(res.services))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await servicesAPI.delete(deleteId);
      toast.success("Service deleted successfully");
      setServices((prev) => prev.filter((s) => s.id !== deleteId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
    setDeleting(false);
    setDeleteId(null);
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await servicesAPI.update(service.id, { is_active: !service.is_active });
      toast.success(`Service ${!service.is_active ? "activated" : "deactivated"}`);
      loadServices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  if (loading) return <Loader fullPage />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Services</h1>
        <Link href="/admin/services/add">
          <Button>Add Service</Button>
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-message">No services yet. Create your first service.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>#{service.id}</td>
                  <td style={{ fontWeight: 500 }}>{service.name}</td>
                  <td className="text-secondary" style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {service.description || "-"}
                  </td>
                  <td>Rs. {service.price}</td>
                  <td>{service.duration_minutes} min</td>
                  <td>
                    <span className={`badge ${service.is_active ? "badge-active" : "badge-inactive"}`}>
                      {service.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link href={`/admin/services/${service.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(service)}
                      >
                        {service.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteId(service.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Service"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
          </>
        }
      >
        <p className="confirm-text">
          Are you sure you want to delete service <strong>#{deleteId}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
