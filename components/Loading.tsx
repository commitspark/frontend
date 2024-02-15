export default function Loading() {
  return (
    <div className="form-input-background form-input-ring p-4 flex">
      <div className="flex-1 space-y-6 animate-pulse">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-2 bg-gray-700 rounded col-span-2"></div>
          <div className="h-2 bg-gray-700 rounded col-span-1"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-2 bg-gray-700 rounded col-span-2"></div>
          <div className="h-2 bg-gray-700 rounded col-span-1"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-2 bg-gray-700 rounded col-span-2"></div>
          <div className="h-2 bg-gray-700 rounded col-span-1"></div>
        </div>
      </div>
    </div>
  )
}
