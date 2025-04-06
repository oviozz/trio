
"use client"
import { ExternalLink, Eye, Loader2 } from "lucide-react"
import type { ProductType } from "@/types/product"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface ProductGridProps {
    products: ProductType[]
}

export function ProductGrid({ products }: ProductGridProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition();

    const handleTryOn = (product: ProductType) => {
        startTransition(() => {
            localStorage.setItem(`product_${product.product_id}`, JSON.stringify(product))
            router.push(`/try-on/${product.product_id}`)
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

    return (
        <div className="mt-5">
            <h2 className="text-2xl font-serif mb-6">Search Results</h2>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {products.map((product, index) => {
                    const hasDiscount = product.old_price && product.old_price_extracted && product.extracted_price

                    return (
                        <motion.div key={`${product.product_id || index}-${index}`} className="flex flex-col group" variants={item}>
                            <div className="aspect-square bg-white rounded-lg overflow-hidden mb-3 relative border border-gray-100 group-hover:border-[#0A8A74] transition-colors">
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
                                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-medium border border-gray-100 z-10">
                                    {product.source}
                                </div>

                                {/* Discount Tag */}
                                {product.tag && hasDiscount && (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                                        {product.tag}
                                    </div>
                                )}

                                {/* Hover overlay with Try It On button */}
                                <div className="absolute inset-0 bg-opacity-60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                    <button
                                        onClick={() => handleTryOn(product)}
                                        disabled={isPending}
                                        className="bg-[#0A8A74] text-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-[#087a66] transition-colors transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
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
        </div>
    )
}