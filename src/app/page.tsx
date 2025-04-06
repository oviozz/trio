
"use client"
import { useState, useEffect } from "react"
import { SearchBar } from "@/components/search-bar"
import { SuggestionPills } from "@/components/suggestion-pills"
import { TrendingProducts } from "@/components/trending-products"
import { ProductGrid } from "@/components/product-grid"
import type { ProductType } from "@/types/product"
import { Logo } from "@/components/logo"
import { ProductSkeleton } from "@/components/product-skeleton"
import {Camera} from "lucide-react";
import {useRouter} from "next/navigation";

export default function Home() {

    const router = useRouter();
    const [products, setProducts] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [query, setQuery] = useState("")
    const [isSearchMode, setIsSearchMode] = useState(false)

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return

        setLoading(true)
        setError(null)
        setIsSearchMode(true)

        try {
            const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`)

            if (!response.ok) {
                throw new Error("Failed to fetch products")
            }

            const data = await response.json()
            setProducts(data.shopping_results || [])
        } catch (err) {
            setError("An error occurred while fetching products. Please try again.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectSuggestion = (suggestion: string) => {
        setQuery(suggestion)
        handleSearch(suggestion)
    }

    // Load some initial trending products
    useEffect(() => {
        const fetchTrendingProducts = async () => {
            try {
                const response = await fetch("/api/search?query=trending+fashion")
                if (response.ok) {
                    const data = await response.json()
                    setProducts(data.shopping_results || [])
                }
            } catch (error) {
                console.error("Failed to fetch trending products:", error)
            } finally {
                setInitialLoading(false)
            }
        }

        fetchTrendingProducts()
    }, [])

    return (
        <main className="min-h-screen bg-[#F6F2EA]">
            <div className="container mx-auto px-4 max-w-5xl">
                <Logo />
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => router.push('/reverse-lens')}
                        className="flex items-center bg-[#0A8A74] text-white px-4 py-2 rounded-lg hover:bg-[#087a66] transition-colors"
                    >
                        <Camera className="h-5 w-5 mr-2" />
                        <span>Search by Image</span>
                    </button>
                </div>

                <div className="text-center mb-5 mt-5">
                    <h1 className="text-4xl font-serif mb-2 text-center">What can I help you find? 🔍</h1>
                    <p className="text-gray-500 mb-8 text-center">
                        Shopping online is convenient—but how many times have you ordered something that looked great in the photo,
                        only to try it on? 🛍️
                    </p>
                </div>

                <SearchBar onSearch={handleSearch} query={query} setQuery={setQuery} />

                <SuggestionPills onSelectSuggestion={handleSelectSuggestion} />

                {loading && <ProductSkeleton count={8} isSearching={true} />}
                {initialLoading && <ProductSkeleton count={4} isSearching={false} />}

                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded my-6">{error}</div>}

                {!loading &&
                    !initialLoading &&
                    !error &&
                    products.length > 0 &&
                    (isSearchMode ? <ProductGrid products={products} /> : <TrendingProducts products={products} />)}
            </div>
        </main>
    )
}

