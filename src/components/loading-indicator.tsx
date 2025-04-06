export function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center my-16">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#3D7E7C] border-opacity-20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-[#3D7E7C] rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-[#3D7E7C] font-medium">Finding items for you...</p>
    </div>
  )
}

