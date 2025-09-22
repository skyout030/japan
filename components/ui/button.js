"use client";

import { cva } from "class-variance-authority";

export function Button({ children, ...props }) {
  return (
    <button className="px-4 py-2 rounded bg-blue-500 text-white" {...props}>
      {children}
    </button>
  );
}
