export function SkeletonCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-slate-800" />

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-slate-850 rounded w-1/4" />
          <div className="h-6 bg-slate-850 rounded-full w-20" />
        </div>

        <div className="h-6 bg-slate-850 rounded w-3/4" />

        <div className="space-y-2">
          <div className="h-4 bg-slate-850 rounded w-1/2" />
          <div className="h-4 bg-slate-850 rounded w-2/3" />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <div className="h-6 bg-slate-850 rounded w-1/3" />
          <div className="h-9 bg-slate-850 rounded-lg w-20" />
        </div>
      </div>
    </div>
  );
}
