export interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white/5 rounded-lg h-full w-full" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10">
      <div className="animate-pulse space-y-4">
        <div className="w-14 h-14 bg-white/5 rounded-xl" />
        <div className="h-6 bg-white/5 rounded w-3/4" />
        <div className="h-4 bg-white/5 rounded w-full" />
        <div className="h-4 bg-white/5 rounded w-5/6" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-white/5 rounded w-1/2 mx-auto" />
          <div className="h-6 bg-white/5 rounded w-3/4 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
