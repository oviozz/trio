"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {ArrowLeft, Upload, Sparkles, Star, InfoIcon, ShoppingBag, Loader} from "lucide-react"
import { Logo } from "@/components/logo"
import type { ProductType } from "@/types/product"

type TryOnPageProps = {
    productID: string
}

export default function TryOnPageClient({ productID }: TryOnPageProps) {

    const router = useRouter()
    const [product, setProduct] = useState<ProductType | null>(null)
    const [productDetails, setProductDetails] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [userImage, setUserImage] = useState<string | null>(null)
    const [generatingImage, setGeneratingImage] = useState(false)
    const [resultImage, setResultImage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'try-on' | 'details'>('try-on')

    useEffect(() => {
        // In a real app, you would fetch the specific product from your API
        const fetchProduct = async () => {
            try {
                const storedProduct = localStorage.getItem(`product_${productID}`)
                if (storedProduct) {
                    setProduct(JSON.parse(storedProduct))
                } else {
                    // Fallback if product not found in localStorage
                    router.push("/")
                }

                // Fetch additional product details from API
                try {
                    const response = await fetch(`https://api.scrapingdog.com/google_product?product_id=${productID}&api_key=67f1df956b79bec13e27b30a&country=us`)
                    if (response.ok) {
                        const data = await response.json()
                        setProductDetails(data)
                    }
                } catch (apiError) {
                    console.error("Error fetching product details:", apiError)
                }
            } catch (error) {
                console.error("Error fetching product:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [productID, router])

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setUserImage(event.target?.result as string)
                setError(null)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleTryOn = async () => {
        if (!userImage || !product) return

        setGeneratingImage(true)
        setError(null)

        try {
            // Call the API route
            const response = await fetch("/api/generate-try-on", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productImage: product.thumbnail,
                    userImage: userImage,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to generate try-on image")
            }

            const data = await response.json()
            setResultImage(data.resultImageUrl)
        } catch (error) {
            console.error("Error generating try-on image:", error)
            setError(
                typeof error === "object" && error !== null ? (error as Error).message : "Failed to generate try-on image",
            )
        } finally {
            setGeneratingImage(false)
        }
    }

    // Function to render star rating
    const renderStars = (rating: number) => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
        }

        if (hasHalfStar) {
            stars.push(
                <div key="half" className="relative">
                    <Star className="h-4 w-4 text-gray-300" />
                    <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                </div>
            )
        }

        const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
        }

        return stars
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F6F2EA] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader className={"w-10 h-10 animate-spin"}/>
                    <p className="text-[#0A8A74] font-medium">Loading product details...</p>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#F6F2EA] flex flex-col items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <p className="text-xl mb-4">Product not found</p>
                    <button onClick={() => router.push("/")} className="flex items-center justify-center text-[#0A8A74] hover:underline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Return to home
                    </button>
                </div>
            </div>
        )
    }

    const productData = productDetails?.product_results || null

    return (
        <main className="min-h-screen bg-[#F6F2EA]">
            <div className="container mx-auto px-4 sm:py-0 py-4 max-w-6xl">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => router.push("/")} className="hover:cursor-pointer flex items-center text-[#0A8A74] hover:underline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to search
                    </button>
                    <div className={"sm:block hidden"}><Logo /></div>
                    <div className="w-24"></div>
                </div>

                {/* Product Header */}
                <div className="flex justify-between items-center bg-white rounded-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-50">
                            <img
                                src={product.thumbnail || "/no-image.png"}
                                alt={product.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.onerror = null
                                    e.currentTarget.src = "/no-image.png"
                                }}
                            />
                        </div>
                        <div className="flex-grow">
                            <h1 className="text-2xl font-serif">{productData?.title || product.title}</h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                                <div className="flex items-baseline gap-2">
                                    <p className="font-bold text-[#0A8A74]">{productData?.prices?.[0] || product.price}</p>
                                    {product.old_price && <p className="text-sm text-gray-500 line-through">{product.old_price}</p>}
                                </div>
                                {productData?.rating && (
                                    <div className="flex items-center gap-1">
                                        <div className="flex">
                                            {renderStars(parseFloat(productData.rating))}
                                        </div>
                                        <span className="text-sm text-gray-600">({productData.reviews || 0})</span>
                                    </div>
                                )}
                                <p className="text-sm text-gray-500">From: {product.source}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-xl p-6 mb-6">
                    <div>
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-medium">See how it looks on you!</h2>
                            <p className="text-gray-500">Upload your photo to visualize this item on yourself</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Product Section */}
                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                                <h3 className="text-lg font-medium mb-4">Selected Item</h3>
                                <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4 relative">
                                    <img
                                        src={product.thumbnail || "/no-image.png"}
                                        alt={product.title}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null
                                            e.currentTarget.src = "/no-image.png"
                                        }}
                                    />
                                </div>
                                {productData?.descriptions && (
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">{productData.descriptions}</p>
                                )}
                                {productData?.extensions && productData.extensions.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {productData.extensions.map((tag: string, index: number) => (
                                            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                                    {tag}
                                                </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* User Photo Upload Section */}
                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                                <h3 className="text-lg font-medium mb-4">Your Photo</h3>

                                {!resultImage ? (
                                    <>
                                        <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4 flex items-center justify-center border-2 border-dashed border-gray-200">
                                            {userImage ? (
                                                <img
                                                    src={userImage || "/placeholder.svg"}
                                                    alt="Your uploaded photo"
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="text-center p-6">
                                                    <Upload className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-gray-400">Upload your photo</p>
                                                    <p className="text-xs text-gray-400 mt-1">For best results, use a full-body photo</p>
                                                </div>
                                            )}
                                        </div>

                                        {error && (
                                            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                                                <p>{error}</p>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-4">
                                            <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg text-center cursor-pointer transition-colors">
                                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                                                <Upload className="h-4 w-4 inline-block mr-2" />
                                                {userImage ? "Choose a different photo" : "Upload a photo"}
                                            </label>

                                            <button
                                                onClick={handleTryOn}
                                                disabled={!userImage || generatingImage}
                                                className={`flex items-center justify-center gap-2 py-3 rounded-lg text-white font-medium transition-colors ${
                                                    userImage && !generatingImage
                                                        ? "bg-[#0A8A74] hover:bg-[#087a66]"
                                                        : "bg-gray-300 cursor-not-allowed"
                                                }`}
                                            >
                                                {generatingImage ? (
                                                    <>
                                                        <Loader className={"w-5 h-5 animate-spin"}/>
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="h-4 w-4" />
                                                        Try It On
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4 relative">
                                            <img
                                                src={resultImage || "/placeholder.svg"}
                                                alt="Virtual try-on result"
                                                className="w-full h-full object-contain"
                                            />
                                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                                <span className="bg-[#0A8A74] text-white px-3 py-1 rounded-full text-sm">AI Generated Preview</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <button
                                                onClick={() => {
                                                    setResultImage(null)
                                                    setUserImage(null)
                                                }}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg text-center transition-colors"
                                            >
                                                Try with a different photo
                                            </button>

                                            <button
                                                onClick={() => window.open(product.product_link, "_blank")}
                                                className="bg-[#0A8A74] hover:bg-[#087a66] text-white py-3 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ShoppingBag className="h-4 w-4" />
                                                Shop this item
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 mb-6">
                    <div>
                        {productData ? (
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Product Images */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Product Gallery</h3>

                                    {/* Main product image */}
                                    <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4 border border-gray-100">
                                        <img
                                            src={(productData.media && productData.media[0]?.link) || product.thumbnail || "/placeholder.svg"}
                                            alt={productData.title}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Thumbnail images */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {productData.media && productData.media.map((item: any, index: number) => (
                                            <div
                                                key={index}
                                                className="aspect-square bg-white rounded-md overflow-hidden border border-gray-100 hover:border-[#0A8A74] cursor-pointer transition-colors"
                                            >
                                                <img
                                                    src={item.link}
                                                    alt={`Product view ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Product Information</h3>

                                    <div className="space-y-6">
                                        {/* Description */}
                                        <div className="bg-white p-4 rounded-lg border border-gray-100">
                                            <h4 className="font-medium mb-2">Description</h4>
                                            <p className="text-gray-600 line-clamp-7">{productData.descriptions || "No description available"}</p>
                                        </div>

                                        {/* Features and Tags */}
                                        <div className="bg-white p-4 rounded-lg border border-gray-100">
                                            <h4 className="font-medium mb-2">Features & Categories</h4>
                                            {productData.extensions && productData.extensions.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {productData.extensions.map((tag: string, index: number) => (
                                                        <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                                                {tag}
                                                            </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">No features available</p>
                                            )}
                                        </div>

                                        {/* Specifications */}
                                        <div className="bg-white p-4 rounded-lg border border-gray-100">
                                            <h4 className="font-medium mb-2">Specifications</h4>
                                            {productData.specifications?.details && Object.keys(productData.specifications.details).length > 0 ? (
                                                <div className="space-y-2">
                                                    {Object.entries(productData.specifications.details).map(([key, value]: [string, any]) => (
                                                        <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                                                            <span className="text-gray-500">{key}</span>
                                                            <span className="font-medium">{value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">No specifications available</p>
                                            )}
                                        </div>

                                        {/* Reviews */}
                                        <div className="bg-white p-4 rounded-lg border border-gray-100">
                                            <h4 className="font-medium mb-2">Customer Reviews</h4>
                                            {productData.rating ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-2xl font-bold">{productData.rating}</div>
                                                        <div className="flex">
                                                            {renderStars(parseFloat(productData.rating))}
                                                        </div>
                                                        <div className="text-sm text-gray-500">({productData.reviews} reviews)</div>
                                                    </div>

                                                    {productData.reviews_results?.ratings && productData.reviews_results.ratings.length > 0 && (
                                                        <div className="space-y-1 mt-2">
                                                            {productData.reviews_results.ratings.map((rating: any) => (
                                                                <div key={rating.name} className="flex items-center gap-3">
                                                                    <div className="w-12 text-right">{rating.name} stars</div>
                                                                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                                                        <div
                                                                            className="bg-yellow-400 h-full rounded-full"
                                                                            style={{
                                                                                width: `${parseInt(rating.amount) / parseInt(productData.reviews) * 100}%`
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">{rating.amount}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">No reviews available</p>
                                            )}
                                        </div>

                                        {/* Buy Now Button */}
                                        <button
                                            onClick={() => window.open(product.product_link, "_blank")}
                                            className="w-full bg-[#0A8A74] hover:cursor-pointer hover:bg-[#087a66] text-white py-3 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ShoppingBag className="h-4 w-4" />
                                            Shop at {productData.online_sellers?.[0]?.name || product.source}
                                            {productData.online_sellers?.[0]?.base_price && ` - ${productData.online_sellers[0].base_price}`}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <InfoIcon className="h-12 w-12 text-gray-300 mb-4" />
                                <p className="text-gray-500">Detailed product information is not available.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}