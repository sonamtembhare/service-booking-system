import Link from "next/link";
import type { Service } from "@repo/types";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="card service-card">
      <div className="service-card-header">
        <h3 className="service-card-name">{service.name}</h3>
        <p className="service-card-price">Rs. {service.price}</p>
      </div>
      <p className="service-card-desc">
        {service.description || "Professional service tailored to your needs."}
      </p>
      <div className="service-card-meta">
        <span>{service.duration_minutes} min</span>
        <span className={`badge ${service.is_active ? "badge-active" : "badge-inactive"}`}>
          {service.is_active ? "Available" : "Unavailable"}
        </span>
      </div>
      <div className="service-card-actions">
        <Link href={`/services/${service.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
          View Details
        </Link>
        {service.is_active && (
          <Link href={`/booking?serviceId=${service.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
            Book Now
          </Link>
        )}
      </div>
    </div>
  );
}
