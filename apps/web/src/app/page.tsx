"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { servicesAPI } from "@/lib/api";
import type { Service } from "@repo/types";

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    servicesAPI.getAll().then((res) => setServices(res.services.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Look Your <span>Best, Feel Your Best</span>
            </h1>
            <p className="hero-description">
              Book premium salon and spa services at your convenience.
              From haircuts to facials, massages to bridal makeup — all in one place.
            </p>
            <div className="hero-actions">
              <Link href="/services" className="btn btn-primary btn-lg">
                Explore Services
              </Link>
              <Link href="/register" className="btn btn-outline btn-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title text-center">Our Popular Services</h2>
          <p className="section-subtitle text-center">
            Explore our most loved salon and spa treatments
          </p>
          <div className="grid grid-3">
            {services.map((service) => (
              <div key={service.id} className="card service-card">
                <div className="service-card-header">
                  <h3 className="service-card-name">{service.name}</h3>
                  <p className="service-card-price">Rs. {service.price}</p>
                </div>
                <p className="service-card-desc">
                  {service.description || "Professional treatment tailored to your needs."}
                </p>
                <div className="service-card-meta">
                  <span>{service.duration_minutes} min</span>
                  <span className="badge badge-active">Available</span>
                </div>
                <div className="service-card-actions">
                  <Link href={`/services/${service.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                    View Details
                  </Link>
                  <Link href={`/booking?serviceId=${service.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/services" className="btn btn-outline">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <h2 className="section-title text-center">Why Choose Service Booking System</h2>
          <p className="section-subtitle text-center">
            Your trusted partner for all salon and spa needs
          </p>
          <div className="grid grid-4">
            <div className="card feature-card">
              <div className="feature-icon">&#9733;</div>
              <h3 className="feature-title">Expert Stylists</h3>
              <p className="feature-desc">Professional and experienced salon experts for every service.</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">&#128336;</div>
              <h3 className="feature-title">Flexible Scheduling</h3>
              <p className="feature-desc">Book your preferred date and time slot at your convenience.</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">&#128176;</div>
              <h3 className="feature-title">Transparent Pricing</h3>
              <p className="feature-desc">No hidden charges. View service prices before you book.</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">&#128640;</div>
              <h3 className="feature-title">Instant Confirmation</h3>
              <p className="feature-desc">Get immediate booking confirmation after scheduling.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title text-center">Our Full Service Menu</h2>
          <p className="section-subtitle text-center">
            Hair care, skin care, body treatments and more
          </p>
          <div className="grid grid-4">
            {services.map((service) => (
              <div key={service.id} className="card" style={{ padding: 16, textAlign: "center" }}>
                <h4 style={{ fontWeight: 600, marginBottom: 4 }}>{service.name}</h4>
                <p style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)" }}>Rs. {service.price}</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{service.duration_minutes} min</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">Service Booking System</div>
              <p className="footer-desc">
                Your trusted platform for booking salon and spa services. Quality treatments made simple.
              </p>
            </div>
            <div>
              <h4 className="footer-title">Quick Links</h4>
              <div className="footer-links">
                <Link href="/" className="footer-link">Home</Link>
                <Link href="/services" className="footer-link">Services</Link>
              </div>
            </div>
            <div>
              <h4 className="footer-title">Account</h4>
              <div className="footer-links">
                <Link href="/login" className="footer-link">Login</Link>
                <Link href="/register" className="footer-link">Register</Link>
              </div>
            </div>

          </div>
          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} Service Booking System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
