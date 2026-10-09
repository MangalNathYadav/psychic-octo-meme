"use client";

import React from "react";

interface ViewSkeletonProps {
  type?: "scanner" | "simulator" | "history" | "social" | "docs" | "about" | "admin";
}

export default function ViewSkeleton({ type = "scanner" }: ViewSkeletonProps) {
  return (
    <div className="space-y-6 animate-fade-in-up max-w-5xl mx-auto w-full">
      {/* Header Skeleton */}
      <div className="surface-card rounded-2xl p-6 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-24 rounded-md skeleton-shimmer" />
          <div className="h-4 w-32 rounded-md skeleton-shimmer opacity-70" />
        </div>
        <div className="h-7 w-3/5 rounded-lg skeleton-shimmer" />
        <div className="h-3.5 w-4/5 rounded-md skeleton-shimmer opacity-60" />

        {/* If Admin, show stats ribbon skeleton */}
        {type === "admin" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-app-border/80">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 rounded-xl bg-app-surface-subtle border border-app-border space-y-1.5">
                <div className="h-2.5 w-16 rounded skeleton-shimmer mx-auto opacity-60" />
                <div className="h-6 w-12 rounded skeleton-shimmer mx-auto" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preset Cards Skeleton (for Scanner) */}
      {type === "scanner" && (
        <div className="space-y-2">
          <div className="h-3.5 w-36 rounded skeleton-shimmer opacity-70" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="surface-card rounded-xl p-3.5 border border-app-border space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-16 rounded skeleton-shimmer" />
                  <div className="h-2 w-2 rounded-full skeleton-shimmer" />
                </div>
                <div className="h-4 w-3/4 rounded skeleton-shimmer" />
                <div className="h-3 w-full rounded skeleton-shimmer opacity-60" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Body Skeleton */}
      {type === "history" ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-8 w-60 rounded-xl skeleton-shimmer" />
            <div className="h-8 w-48 rounded-xl skeleton-shimmer" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="surface-card rounded-2xl p-4 border border-app-border space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl skeleton-shimmer shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-28 rounded skeleton-shimmer" />
                    <div className="h-4 w-64 rounded skeleton-shimmer" />
                  </div>
                </div>
                <div className="h-6 w-20 rounded-full skeleton-shimmer" />
              </div>
              <div className="h-3 w-5/6 rounded skeleton-shimmer opacity-70" />
            </div>
          ))}
        </div>
      ) : type === "social" ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-8 w-72 rounded-xl skeleton-shimmer" />
            <div className="h-8 w-32 rounded-xl skeleton-shimmer" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="surface-card rounded-2xl p-5 border border-app-border space-y-3">
              <div className="flex justify-between">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 rounded-full skeleton-shimmer" />
                  <div className="h-5 w-72 rounded skeleton-shimmer" />
                  <div className="h-3 w-40 rounded skeleton-shimmer opacity-60" />
                </div>
                <div className="h-7 w-20 rounded-xl skeleton-shimmer" />
              </div>
              <div className="h-14 w-full rounded-xl skeleton-shimmer opacity-80" />
              <div className="flex justify-between">
                <div className="h-3 w-1/2 rounded skeleton-shimmer opacity-60" />
                <div className="h-4 w-16 rounded skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      ) : type === "about" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="surface-card rounded-2xl p-5 border border-app-border space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-11 w-11 rounded-xl skeleton-shimmer shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-32 rounded skeleton-shimmer" />
                  <div className="h-3 w-24 rounded skeleton-shimmer opacity-70" />
                </div>
                <div className="h-5 w-16 rounded-full skeleton-shimmer" />
              </div>
              <div className="h-12 w-full rounded-xl skeleton-shimmer opacity-70" />
              <div className="flex space-x-1.5">
                <div className="h-4 w-16 rounded skeleton-shimmer" />
                <div className="h-4 w-20 rounded skeleton-shimmer" />
                <div className="h-4 w-16 rounded skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="surface-card rounded-2xl p-6 border border-app-border space-y-4">
          <div className="h-5 w-48 rounded skeleton-shimmer" />
          <div className="h-24 w-full rounded-xl skeleton-shimmer" />
          <div className="flex justify-between items-center pt-2">
            <div className="h-4 w-32 rounded skeleton-shimmer opacity-60" />
            <div className="h-9 w-28 rounded-xl skeleton-shimmer" />
          </div>
        </div>
      )}
    </div>
  );
}
