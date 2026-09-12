"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "\u25A6" },
  { href: "/admin/services", label: "Services", icon: "\u2699" },
  { href: "/admin/services/add", label: "Add Service", icon: "+" },
  { href: "/admin/bookings", label: "Bookings", icon: "\u2637" },
  { href: "/admin/routes", label: "Routes", icon: "\u21C4" },
];

export default function AdminSidebar({ open, onClose, onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
    if (href === "/admin/services") return pathname === "/admin/services";
    if (href === "/admin/services/add") return pathname === "/admin/services/add";
    if (href === "/admin/bookings") return pathname === "/admin/bookings";
    if (href === "/admin/routes") return pathname === "/admin/routes";
    return pathname === href;
  };

  return (
    <>
      {open && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 99 }}
          onClick={onClose}
        />
      )}
      <aside className={`dashboard-sidebar ${open ? "open" : ""}`}>
        <div className="dashboard-sidebar-logo">
          <Link href="/admin/dashboard" style={{ color: "#fff" }}>Service Booking System</Link>
        </div>
        <nav className="dashboard-sidebar-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-link ${isActive(link.href) ? "active" : ""}`}
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-logout">
          <button
            onClick={onLogout}
            className="sidebar-link"
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
          >
            <span className="sidebar-link-icon">&#10140;</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
