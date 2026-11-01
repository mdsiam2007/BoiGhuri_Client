export default function BookSkeleton() {
  return (
    <div className="flex flex-col w-full rounded-xl border border-border/70 overflow-hidden bg-card p-0 shadow-xs">
      {/* Aspect 3/4 Image placeholder */}
      <div className="skeleton aspect-[3/4] w-full" />
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Title */}
          <div className="skeleton h-4 w-3/4 rounded-md" />
          {/* Author */}
          <div className="skeleton h-3 w-1/2 rounded-md" />
          {/* Description line 1 & 2 */}
          <div className="skeleton h-2.5 w-full rounded-md mt-2" />
          <div className="skeleton h-2.5 w-4/5 rounded-md" />
        </div>
        {/* Button */}
        <div className="pt-3 border-t border-border/40">
          <div className="skeleton h-8 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

