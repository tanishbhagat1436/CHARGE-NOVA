import React from 'react';

/**
 * Skeleton shimmer placeholder.
 * Usage:
 *   <Skeleton className="h-4 w-3/4" />
 *   <Skeleton variant="circle" className="w-10 h-10" />
 */
export default function Skeleton({ className = '', variant = 'rect', ...props }) {
  const base = 'skeleton animate-shimmer';
  const shape =
    variant === 'circle'
      ? 'rounded-full'
      : variant === 'pill'
      ? 'rounded-full'
      : 'rounded-lg';

  return (
    <div
      className={`${base} ${shape} ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}

/** Preset skeleton rows — convenience helper */
export function SkeletonRow({ cols = 3, className = '' }) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

/** Skeleton card — stands in for a metric or summary card */
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`p-4 rounded-xl border border-surface-border space-y-2 ${className}`}>
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

/** Skeleton list item — for autocomplete dropdowns */
export function SkeletonListItem({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 ${className}`}>
      <Skeleton variant="circle" className="w-7 h-7 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-2.5 w-1/2" />
      </div>
    </div>
  );
}
