"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-stone-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 rounded-md border border-stone-300 bg-stone-50 px-3.5 text-base text-stone-900 placeholder:text-stone-400 transition-colors focus:border-moss-500 focus:outline-none focus:ring-2 focus:ring-moss-500/30",
            error && "border-status-overdue focus:ring-status-overdue/30",
            className
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {error && <p className="text-sm text-status-overdue">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
