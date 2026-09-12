"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function AdminHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header className="dashboard-header">
      <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
        &#9776;
      </button>
      <div style={{ fontWeight: 600, fontSize: 16 }}>Service Booking System</div>
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{user?.name}</span>
        <span className="badge badge-confirmed" style={{ textTransform: "capitalize" }}>{user?.role}</span>
      </div>
    </header>
  );
}
