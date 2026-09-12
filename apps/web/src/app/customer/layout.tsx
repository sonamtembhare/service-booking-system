"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role === "admin") {
      router.push("/admin");
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="page-wrapper">
      {children}
    </div>
  );
}
