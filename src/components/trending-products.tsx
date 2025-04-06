"use client"

import {useRef, useTransition} from "react"
import {ArrowLeft, ArrowRight, Eye, ExternalLink, Loader2} from "lucide-react"
import type { ProductType } from "@/types/product"
import { motion } from "framer-motion"
import {useRouter} from "next/navigation";

interface TrendingProductsProps {
  products: ProductType[]
}

export function TrendingProducts({ products }: TrendingProductsProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [isPending, startTransition] = useTransition();


  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return

    const container = carouselRef.current
    const scrollAmount = 300 // Adjust as needed

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleTryOn = (product: ProductType) => {
    startTransition(() => {
      try {
        localStorage.setItem(`product_${product.product_id}`, JSON.stringify(product))
        router.push(`/try-on/${product.product_id}`)
      } catch (error) {
        console.error("Error storing product data:", error)
      }
    })
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  // Limit to first 10 products for the carousel
  const visibleProducts = products.slice(0, 10)

  return (
    <div className="hide-scrollbar">
      <h2 className="text-2xl font-serif text-gray-900 mb-4">✨ Trending this Week</h2>

      <div className="relative">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 bg-white rounded-full p-2 z-10 hover:bg-[#0A8A74] hover:text-white transition-colors border border-gray-100"
          onClick={() => scrollCarousel("left")}
        >
          <ArrowLeft size={20} />
        </button>

        <motion.div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {visibleProducts.map((product, index) => {
            const hasDiscount = product.old_price && product.old_price_extracted && product.extracted_price

            return (
              <motion.div
                key={`${product.product_id || index}-${index}`}
                className="flex-shrink-0 w-64 snap-start group"
                variants={item}
              >
                <div className="aspect-square bg-white rounded-lg overflow-hidden mb-3 relative border border-gray-100">
                  <img
                    src={product.thumbnail || "/placeholder.svg?height=300&width=300"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = "/api/placeholder/400/320"
                    }}
                  />

                  {/* Source Badge */}
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-medium border border-gray-100">
                    {product.source}
                  </div>

                  {/* Discount Tag */}
                  {product.tag && hasDiscount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      {product.tag}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-opacity-60 opacity-0 group-hover:opacity-100 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <button
                        onClick={() => handleTryOn(product)}
                        className="bg-[#0A8A74] text-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-[#087a66] transition-colors transform hover:scale-105 shadow-lg"
                    >
                      {isPending ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            <span className="font-medium">Loading...</span>
                          </>
                      ) : (
                          <>
                            <Eye className="h-5 w-5 mr-2" />
                            <span className="font-medium">Try It On</span>
                          </>
                      )}
                    </button>
                  </div>

                </div>
                <div className="flex justify-between items-start">
                  <p className="text-sm line-clamp-1 flex-grow">{product.title}</p>
                  <a
                    href={product.product_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-gray-500 hover:text-[#0A8A74] transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className={`font-bold ${hasDiscount ? "text-red-500" : "text-[#0A8A74]"} text-sm`}>
                    {product.price}
                  </p>
                  {hasDiscount && <p className="text-xs text-gray-500 line-through">{product.old_price}</p>}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 bg-white rounded-full p-2 z-10 hover:bg-[#0A8A74] hover:text-white transition-colors border border-gray-100"
          onClick={() => scrollCarousel("right")}
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}

