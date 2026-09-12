"use client";

const apiRoutes = [
  { method: "GET", path: "/api/health", description: "Health check", access: "Public" },
  { method: "POST", path: "/api/auth/register", description: "Register new user", access: "Public" },
  { method: "POST", path: "/api/auth/login", description: "Login user", access: "Public" },
  { method: "GET", path: "/api/services", description: "List all services", access: "Public" },
  { method: "GET", path: "/api/services/:id", description: "Get service by ID", access: "Public" },
  { method: "POST", path: "/api/services", description: "Create service", access: "Admin" },
  { method: "PUT", path: "/api/services/:id", description: "Update service", access: "Admin" },
  { method: "DELETE", path: "/api/services/:id", description: "Delete service", access: "Admin" },
  { method: "POST", path: "/api/bookings", description: "Create booking", access: "Customer" },
  { method: "GET", path: "/api/bookings/my", description: "Get my bookings", access: "Customer" },
  { method: "PATCH", path: "/api/bookings/:id/cancel", description: "Cancel booking", access: "Customer" },
  { method: "GET", path: "/api/bookings/admin/all", description: "Get all bookings", access: "Admin" },
  { method: "PATCH", path: "/api/bookings/admin/:id/status", description: "Update booking status", access: "Admin" },
  { method: "GET", path: "/api/dashboard/stats", description: "Dashboard statistics", access: "Admin" },
];

const frontendRoutes = [
  { path: "/", description: "Home page", access: "Public" },
  { path: "/login", description: "Login page", access: "Public" },
  { path: "/register", description: "Register page", access: "Public" },
  { path: "/services", description: "Services listing", access: "Public" },
  { path: "/customer", description: "Customer dashboard", access: "Customer" },
  { path: "/customer/bookings", description: "Customer bookings", access: "Customer" },
  { path: "/admin/dashboard", description: "Admin dashboard", access: "Admin" },
  { path: "/admin/services", description: "Manage services", access: "Admin" },
  { path: "/admin/services/add", description: "Add new service", access: "Admin" },
  { path: "/admin/services/[id]", description: "View service", access: "Admin" },
  { path: "/admin/services/[id]/edit", description: "Edit service", access: "Admin" },
  { path: "/admin/bookings", description: "Manage bookings", access: "Admin" },
  { path: "/admin/routes", description: "Route listing", access: "Admin" },
];

const methodColors: Record<string, string> = {
  GET: "#22c55e",
  POST: "#3b82f6",
  PUT: "#f59e0b",
  PATCH: "#a855f7",
  DELETE: "#ef4444",
};

const accessColors: Record<string, string> = {
  Public: "#22c55e",
  Customer: "#3b82f6",
  Admin: "#ef4444",
};

export default function AdminRoutesPage() {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Routes</h1>
      <p className="text-secondary mb-6">All API and frontend routes in the application</p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>API Routes</h2>
      <div style={{ overflowX: "auto", marginBottom: 32 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
              <th style={{ padding: "10px 12px", fontWeight: 600 }}>Method</th>
              <th style={{ padding: "10px 12px", fontWeight: 600 }}>Path</th>
              <th style={{ padding: "10px 12px", fontWeight: 600 }}>Description</th>
              <th style={{ padding: "10px 12px", fontWeight: 600 }}>Access</th>
            </tr>
          </thead>
          <tbody>
            {apiRoutes.map((route, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "10px 12px" }}>
                  <span
                    style={{
                      background: methodColors[route.method] || "#6b7280",
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {route.method}
                  </span>
                </td>
                <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 13 }}>
                  {route.path}
                </td>
                <td style={{ padding: "10px 12px" }}>{route.description}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span
                    style={{
                      background: accessColors[route.access] || "#6b7280",
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  >
                    {route.access}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Frontend Routes</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
              <th style={{ padding: "10px 12px", fontWeight: 600 }}>Path</th>
              <th style={{ padding: "10px 12px", fontWeight: 600 }}>Description</th>
              <th style={{ padding: "10px 12px", fontWeight: 600 }}>Access</th>
            </tr>
          </thead>
          <tbody>
            {frontendRoutes.map((route, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 13 }}>
                  {route.path}
                </td>
                <td style={{ padding: "10px 12px" }}>{route.description}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span
                    style={{
                      background: accessColors[route.access] || "#6b7280",
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  >
                    {route.access}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
