"use client";

import type { HTMLAttributes } from "react";

/**
 * Placeholder with shimmer animation for loading states (case: skeleton + shimmer).
 */
export type SkeletonProps = {
  /** Optional width (e.g. "60%", "120px") */
  width?: string | number;
  /** Optional height (e.g. "24px", 20) */
  height?: string | number;
  /** Rounded style */
  rounded?: "default" | "full" | "lg";
  /** Additional class name */
  className?: string;
  /** Accessibility: hide from screen readers when purely decorative */
  "aria-hidden"?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

const roundedClass = {
  default: "",
  full: "skeleton--rounded-full",
  lg: "skeleton--rounded-lg",
};

export function Skeleton({
  width,
  height,
  rounded = "default",
  className = "",
  "aria-hidden": ariaHidden = true,
  style,
  ...props
}: SkeletonProps) {
  const resolvedStyle: React.CSSProperties = {
    ...style,
    ...(width != null && { width: typeof width === "number" ? `${width}px` : width }),
    ...(height != null && { height: typeof height === "number" ? `${height}px` : height }),
  };
  return (
    <div
      className={`skeleton ${roundedClass[rounded]} ${className}`.trim()}
      style={resolvedStyle}
      aria-hidden={ariaHidden}
      {...props}
    />
  );
}

export default Skeleton;
