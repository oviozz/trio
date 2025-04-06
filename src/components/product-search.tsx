"use client"

import { useState, type FormEvent } from "react"
import { Search } from "lucide-react"

interface ProductSearchProps {
  onSearch: (query: string) => void
}

export function ProductSearch({ onSearch }: ProductSearchProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-4 text-white bg-purple-600 rounded-r-lg hover:bg-purple-700 transition-colors"
        >
          Search
        </button>
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </form>
    </div>
  )
}

