"use client";

export function Card({ children, className = "", ...props }) {
  return (
    <div className={`bg-white rounded shadow p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-2 ${className}`} {...props}>
      {children}
    </div>
  );
}
