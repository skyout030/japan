"use client";

export function Button({ children, variant = "primary", ...props }) {
  const base = "px-4 py-2 rounded font-medium";
  const style =
    variant === "primary"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-300 text-gray-800 hover:bg-gray-400";
  return (
    <button className={`${base} ${style}`} {...props}>
      {children}
    </button>
  );
}
