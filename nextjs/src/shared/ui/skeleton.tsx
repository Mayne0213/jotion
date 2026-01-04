import { cn } from "../lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className
      )}
    />
  );
};

// Document Card Skeleton
export const DocumentCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-secondary rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center justify-center aspect-square">
      <Skeleton className="w-12 h-12 rounded-lg mb-2" />
      <Skeleton className="w-full h-4 mb-2" />
      <Skeleton className="w-3/4 h-3" />
    </div>
  );
};

// Folder Card Skeleton
export const FolderCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-secondary rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center justify-center aspect-square">
      <Skeleton className="w-12 h-12 rounded-lg mb-2" />
      <Skeleton className="w-full h-4" />
    </div>
  );
};

// Folder View Skeleton
export const FolderViewSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Folder header skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-48 h-4" />
        </div>
      </div>

      {/* Subfolders section */}
      <div>
        <Skeleton className="w-24 h-5 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <FolderCardSkeleton key={`folder-${i}`} />
          ))}
        </div>
      </div>

      {/* Documents section */}
      <div>
        <Skeleton className="w-24 h-5 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <DocumentCardSkeleton key={`doc-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Documents Page Skeleton
export const DocumentsPageSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Folders section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-20 h-4" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <FolderCardSkeleton key={`folder-${i}`} />
          ))}
        </div>
      </div>

      {/* Recent pages section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-20 h-4" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <DocumentCardSkeleton key={`doc-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Document Detail Page Skeleton
export const DocumentDetailSkeleton = () => {
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#1F1F1F]">
      {/* Header skeleton */}
      <div className="bg-secondary border-b border-gray-200 dark:border-gray-700 sticky h-16 top-0 z-10">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-20 h-8 rounded" />
              <Skeleton className="w-48 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-24 h-8 rounded" />
              <Skeleton className="w-20 h-8 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Document header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-3/4 h-8 sm:h-10" />
                <div className="flex gap-4">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-32 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Editor skeleton */}
          <div className="bg-white dark:bg-secondary rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
            <div className="space-y-3">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-5/6 h-4" />
              <Skeleton className="w-4/5 h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4" />
              <div className="pt-4">
                <Skeleton className="w-2/3 h-4" />
                <Skeleton className="w-5/6 h-4 mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shared Document Page Skeleton
export const SharedDocumentSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1F1F1F]">
      {/* Header skeleton */}
      <div className="bg-white dark:bg-secondary border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-20 h-8 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-24 h-8 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Document header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="w-3/4 h-10" />
              <div className="flex gap-4">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-40 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="bg-white dark:bg-secondary rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <div className="space-y-4">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-5/6 h-4" />
            <Skeleton className="w-4/5 h-4" />
            <div className="pt-4">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4 mt-2" />
              <Skeleton className="w-5/6 h-4 mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

