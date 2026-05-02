export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 animate-pulse">
      
      {/* Header Skeleton */}
      <div className="mb-8 space-y-4">
        <div className="h-10 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="w-full lg:w-1/4 xl:w-1/5 shrink-0 hidden lg:block">
          <div className="h-8 bg-gray-200 rounded w-full mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-100 rounded w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="w-full lg:w-3/4 xl:w-4/5">
          <div className="flex justify-between mb-6">
            <div className="h-5 bg-gray-100 rounded w-32" />
            <div className="h-8 bg-gray-200 rounded w-48" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 h-80 flex flex-col">
                <div className="w-full h-40 bg-gray-100 rounded-lg mb-4" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-auto" />
                <div className="flex justify-between items-end mt-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                  <div className="h-8 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
