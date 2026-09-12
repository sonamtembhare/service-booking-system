"use client";

import { useEffect, useState } from "react";
import { dashboardAPI } from "@/lib/api";
import type { DashboardStats } from "@repo/types";
import StatsCard from "@/components/admin/StatsCard";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardAPI
      .getStats()
      .then((res) => setStats(res.stats))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Dashboard</h1>

      <div className="stats-grid">
        <StatsCard label="Total Bookings" value={stats?.total_bookings || 0} variant="primary" />
        <StatsCard label="Pending" value={stats?.pending_bookings || 0} variant="warning" />
        <StatsCard label="Confirmed" value={stats?.confirmed_bookings || 0} variant="info" />
        <StatsCard label="Completed" value={stats?.completed_bookings || 0} variant="success" />
        <StatsCard label="Cancelled" value={stats?.cancelled_bookings || 0} variant="danger" />
        <StatsCard label="Total Revenue" value={`Rs. ${stats?.total_revenue || 0}`} variant="primary" />
      </div>
    </div>
  );
}
