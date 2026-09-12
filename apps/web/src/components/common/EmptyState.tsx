import type { ReactNode } from "react";

export default function EmptyState({
  message,
  action,
}: {
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">&#9744;</div>
      <p className="empty-state-message">{message}</p>
      {action}
    </div>
  );
}
