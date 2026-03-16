import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function MeditationCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <Skeleton className="h-32 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function PrayerCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="space-y-2 mb-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

// Skeleton para cards de mídia com imagem (Orações, Meditações, Estudos)
export function ImageCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/80 dark:bg-[#231F1B]/80 border border-white/60 dark:border-white/[0.06] shadow-sm">
      <Skeleton className="h-40 w-full rounded-none bg-gray-200 dark:bg-gray-700" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700" />
        <div className="flex gap-1.5 pt-0.5">
          <Skeleton className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

// Skeleton para card compacto de estudo (imagem menor)
export function StudyCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/80 dark:bg-[#231F1B]/80 border border-white/60 dark:border-white/[0.06] shadow-sm">
      <Skeleton className="h-24 w-full rounded-none bg-gray-200 dark:bg-gray-700" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center justify-between pt-0.5">
          <Skeleton className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-12 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

export function TabLoadingSkeleton() {
  return (
    <div className="px-4 pt-4 pb-24 space-y-4">
      <Skeleton className="h-7 w-40" />
      <div className="grid grid-cols-2 gap-3">
        <ImageCardSkeleton />
        <ImageCardSkeleton />
        <ImageCardSkeleton />
        <ImageCardSkeleton />
      </div>
      <div className="space-y-3 mt-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export function BibleBookSkeleton() {
  return (
    <div className="bg-white rounded-2xl px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
}

export function DiaryEntrySkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="space-y-2 mb-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
      <div className="flex space-x-2 mb-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-24" />
    </div>
  );
}