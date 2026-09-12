"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import type { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role !== "admin") {
      router.push("/customer");
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    dispatch(logout());
    toast.info("Logged out successfully");
    router.push("/");
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
      <div className="dashboard-main">
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
