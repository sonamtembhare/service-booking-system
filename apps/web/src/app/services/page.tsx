"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { fetchServices } from "@/store/slices/serviceSlice";
import ServiceCard from "@/components/service/ServiceCard";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import EmptyState from "@/components/common/EmptyState";

export default function ServicesPage() {
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((state: RootState) => state.services);

  useEffect(() => {
    dispatch(fetchServices() as any);
  }, [dispatch]);

  if (loading) return <Loader fullPage />;
  if (error) return <div className="container" style={{ padding: "40px 0" }}><ErrorMessage message={error} /></div>;

  return (
    <div className="container" style={{ padding: "40px 0" }}>
      <h1 className="section-title">Our Services</h1>
      <p className="section-subtitle">Browse our salon and spa treatments and book your appointment</p>

      {services.length === 0 ? (
        <EmptyState message="No services available at the moment." />
      ) : (
        <div className="grid grid-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
