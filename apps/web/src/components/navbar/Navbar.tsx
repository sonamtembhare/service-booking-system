"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import type { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.info("Logged out successfully");
    setMobileOpen(false);
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  const guestLinks = (
    <>
      <Link href="/" className={`navbar-link ${isActive("/") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
        Home
      </Link>
      <Link href="/services" className={`navbar-link ${isActive("/services") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
        Services
      </Link>
      <Link href="/login" className={`navbar-link ${isActive("/login") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
        Login
      </Link>
      <Link href="/register" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>
        Register
      </Link>
    </>
  );

  const customerLinks = (
    <>
      <Link href="/" className={`navbar-link ${isActive("/") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
        Home
      </Link>
      <Link href="/services" className={`navbar-link ${isActive("/services") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
        Services
      </Link>
      <Link href="/customer" className={`navbar-link ${isActive("/customer") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
        Dashboard
      </Link>
      <Link href="/customer/bookings" className={`navbar-link ${isActive("/customer/bookings") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
        My Bookings
      </Link>
      <button onClick={handleLogout} className="btn btn-secondary btn-sm">
        Logout
      </button>
    </>
  );

  const adminLinks = (
    <>
      <Link href="/admin" className={`navbar-link ${isActive("/admin") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
        Dashboard
      </Link>
      <Link href="/admin/services" className={`navbar-link ${isActive("/admin/services") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
        Services
      </Link>
      <Link href="/admin/bookings" className={`navbar-link ${isActive("/admin/bookings") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
        Bookings
      </Link>
      <button onClick={handleLogout} className="btn btn-secondary btn-sm">
        Logout
      </button>
    </>
  );

  const renderLinks = () => {
    if (!isAuthenticated) return guestLinks;
    if (user?.role === "admin") return adminLinks;
    return customerLinks;
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          Service Booking System
        </Link>

        <div className="navbar-links">{renderLinks()}</div>

        <button
          className="navbar-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "\u2715" : "\u2630"}
        </button>
      </div>

      {mobileOpen && <div className="navbar-mobile">{renderLinks()}</div>}
    </nav>
  );
}
