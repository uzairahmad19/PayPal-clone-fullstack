"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section Skeleton */}
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Enhanced Balance Card Skeleton */}
        <Card className="col-span-full md:col-span-2 lg:col-span-3 relative overflow-hidden">
          <div className="absolute inset-0 shimmer"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="flex items-center gap-2 mt-1">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </CardHeader>
          <CardContent className="relative">
            <Skeleton className="h-20 w-72 mb-2" />
            <Skeleton className="h-4 w-48 mb-6" />
            <div className="flex flex-col sm:flex-row gap-3">
              <Skeleton className="h-12 flex-1 rounded-xl" />
              <Skeleton className="h-12 flex-1 rounded-xl" />
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions Skeleton */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 shimmer"></div>
          <CardHeader className="relative">
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
            <div className="pt-4 border-t border-white/20">
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Activity Skeleton */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 shimmer opacity-30"></div>
        <CardHeader className="relative">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-7 w-40 mb-2" />
              <Skeleton className="h-5 w-80" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8 relative">
          {/* Enhanced Summary Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="relative overflow-hidden">
                <div className="absolute inset-0 shimmer opacity-50"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </CardHeader>
                <CardContent className="relative">
                  <Skeleton className="h-9 w-32 mb-1" />
                  <Skeleton className="h-4 w-28" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Chart Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="relative">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <div className="absolute inset-0 shimmer opacity-30 rounded-lg"></div>
            </div>
          </div>

          {/* Enhanced Transaction List Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="rounded-lg border overflow-hidden">
              <div className="p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b last:border-b-0">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
