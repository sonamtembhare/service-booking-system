"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import type { RootState } from "@/store/store";
import { fetchServiceById, clearSelectedService } from "@/store/slices/serviceSlice";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import Button from "@/components/common/Button";
import Link from "next/link";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedService, loading, error } = useSelector((state: RootState) => state.services);

  const id = Number(params.id);

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(id) as any);
    }
    return () => {
      dispatch(clearSelectedService());
    };
  }, [id, dispatch]);

  if (loading) return <Loader fullPage />;
  if (error) return <div className="container" style={{ padding: "40px 0" }}><ErrorMessage message={error} /></div>;
  if (!selectedService) return null;

  return (
    <div className="container" style={{ padding: "40px 0", maxWidth: 720 }}>
      <button
        onClick={() => router.back()}
        style={{ background: "none", border: "none", color: "var(--primary)", fontSize: 14, marginBottom: 24, cursor: "pointer" }}
      >
        &larr; Back to Services
      </button>

      <div className="card" style={{ padding: 32 }}>
        <div className="flex justify-between items-center mb-4">
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>{selectedService.name}</h1>
          <span className={`badge ${selectedService.is_active ? "badge-active" : "badge-inactive"}`}>
            {selectedService.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        <p style={{ fontSize: 20, fontWeight: 700, color: "var(--primary)", marginBottom: 16 }}>
          Rs. {selectedService.price}
        </p>

        {selectedService.description && (
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.7 }}>
            {selectedService.description}
          </p>
        )}

        <div className="flex gap-4 mb-6" style={{ flexWrap: "wrap" }}>
          <div className="card" style={{ padding: 16, flex: "1 1 120px" }}>
            <div className="text-secondary" style={{ fontSize: 13, marginBottom: 4 }}>Duration</div>
            <div style={{ fontWeight: 600 }}>{selectedService.duration_minutes} minutes</div>
          </div>
          <div className="card" style={{ padding: 16, flex: "1 1 120px" }}>
            <div className="text-secondary" style={{ fontSize: 13, marginBottom: 4 }}>Status</div>
            <div style={{ fontWeight: 600 }}>{selectedService.is_active ? "Available" : "Unavailable"}</div>
          </div>
        </div>

        {selectedService.is_active ? (
          <Link href={`/booking?serviceId=${selectedService.id}`}>
            <Button className="btn-block btn-lg">Book Now</Button>
          </Link>
        ) : (
          <Button className="btn-block btn-lg" disabled>
            Currently Unavailable
          </Button>
        )}
      </div>
    </div>
  );
}
