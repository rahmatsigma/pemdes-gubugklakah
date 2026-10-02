import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "default";
};

export default function Badge({ children, variant = "default" }: BadgeProps) {
  const variants = {
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200",
    default: "bg-neutral-100 text-neutral-800 border border-neutral-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider ${variants[variant]}`}
    >
      {children}
    </span>
  );
}