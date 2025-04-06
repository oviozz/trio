
"use client";
import { useState, FormEvent } from "react";
import { Search, ShoppingBag, Loader2 } from "lucide-react";

interface ProductResult {
    title: string;
    link: string;
    source: string;
    original_thumbnail?: string;
    thumbnail: string;
    tag?: string;
    in_stock?: string;
    position: number;
}

interface ApiResponse {
    lens_results?: ProductResult[];
}

export default function ReverseLensSearch() {
    const [imageUrl, setImageUrl] = useState<string>("");
    const [results, setResults] = useState<ProductResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
        if (!imageUrl) return;

        setLoading(true);
        setError(null);

        try {
            const apiUrl = `https://api.scrapingdog.com/google_lens?api_key=67f2d56b52500eaf2f2ef55b&url=${encodeURIComponent(imageUrl)}&country=us`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error("Failed to fetch results");
            }

            const data: ApiResponse = await response.json();
            setResults(data.lens_results || []);
        } catch (err) {
            console.error("Error searching image:", err);
            setError("An error occurred while searching. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F6F2EA] py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-[#0A8A74] text-white p-3 rounded-full">
                        <ShoppingBag className="h-8 w-8" />
                    </div>
                </div>

                <h1 className="text-4xl font-serif mb-3 text-center">TrioLens</h1>
                <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
                    Found something you love? Paste the image URL below to find similar products and where to buy them.
                </p>

                <form onSubmit={handleSearch} className="mb-10">
                    <div className="relative flex items-center max-w-3xl mx-auto">
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Paste image URL here..."
                            className="w-full px-5 py-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0A8A74] text-gray-700 bg-white pr-20"
                        />
                        <button
                            type="submit"
                            disabled={loading || !imageUrl}
                            className="absolute right-2 bg-[#0A8A74] text-white rounded-lg p-2 hover:bg-[#087a66] transition-colors disabled:bg-gray-300"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded my-6 max-w-3xl mx-auto">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-10 w-10 text-[#0A8A74] animate-spin" />
                        <span className="ml-3 text-lg text-gray-600">Searching for similar items...</span>
                    </div>
                )}

                {!loading && results.length > 0 && (
                    <>
                        <h2 className="text-2xl font-serif mb-6 text-center">Found {results.length} Similar Items</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((item, index) => (
                                <div key={index} className="bg-white rounded-lg overflow-hidden border border-gray-100">
                                    <div className="h-64 overflow-hidden">
                                        <img
                                            src={item.original_thumbnail || item.thumbnail}
                                            alt={item.title}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-medium mb-2 line-clamp-2">{item.title}</h3>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#0A8A74] font-semibold">{item.tag || "View Details"}</span>
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#0A8A74] text-white px-4 py-2 rounded-lg hover:bg-[#087a66] transition-colors inline-flex items-center"
                                            >
                                                <ShoppingBag className="h-4 w-4 mr-1" />
                                                Buy Now
                                            </a>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-2">{item.source}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {!loading && !error && results.length === 0 && imageUrl && (
                    <div className="text-center py-10">
                        <p className="text-gray-600">No results found. Try a different image URL.</p>
                    </div>
                )}

                {!imageUrl && !loading && (
                    <div className="bg-white rounded-lg p-6 max-w-3xl mx-auto border border-gray-100">
                        <h3 className="text-xl font-medium mb-3">How to use TrioLens:</h3>
                        <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                            <li>Find an image of clothing or accessories you like online</li>
                            <li>Right-click on the image and select "Copy image address" or "Copy image URL"</li>
                            <li>Paste the URL in the search box above</li>
                            <li>Click search to find similar items available for purchase</li>
                        </ol>
                    </div>
                )}
            </div>
        </main>
    );
}