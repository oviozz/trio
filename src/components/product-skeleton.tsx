interface ProductSkeletonProps {
  count?: number
  isSearching?: boolean
}

export function ProductSkeleton({ count = 4, isSearching = false }: ProductSkeletonProps) {
  return (
    <div className="mt-8">
      <div className="h-8 w-48 bg-gray-200 rounded-md mb-6 animate-pulse"></div>

      {isSearching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="flex flex-col">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="flex gap-4 overflow-x-hidden">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-64">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

