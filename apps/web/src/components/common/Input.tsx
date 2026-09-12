"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const inputClasses = ["form-input", error ? "error" : "", className].filter(Boolean).join(" ");

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
