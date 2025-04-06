import { Star } from "lucide-react"
import type { ProductType } from "@/types/product"

interface ProductCardProps {
  product: ProductType
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200">
        {product.thumbnail ? (
          <img
            src={product.thumbnail || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
        )}
        {product.tag && (
          <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">{product.tag}</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10">{product.title}</h3>
        <div className="mt-2 flex justify-between items-center">
          <div>
            <p className="text-lg font-bold text-gray-900">{product.price}</p>
            {product.old_price && <p className="text-sm text-gray-500 line-through">{product.old_price}</p>}
          </div>
          {product.rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
              {product.reviews && <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>}
            </div>
          )}
        </div>
        <div className="mt-2 text-xs text-gray-500">{product.source && <p>From: {product.source}</p>}</div>
      </div>
    </div>
  )
}

