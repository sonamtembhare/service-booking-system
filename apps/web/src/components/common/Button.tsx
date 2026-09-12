"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, children, className = "", disabled, ...props }, ref) => {
    const classes = [
      "btn",
      `btn-${variant}`,
      size === "sm" ? "btn-sm" : "",
      size === "lg" ? "btn-lg" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="spinner spinner-sm" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
