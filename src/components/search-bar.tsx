
import type { FormEvent } from "react"
import { MessageSquare, Search } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
  query: string
  setQuery: (query: string) => void
}

export function SearchBar({ onSearch, query, setQuery }: SearchBarProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-5">
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try 'Outfit inspo for date night outfits, Mystique Boutique style'"
            className="w-full px-12 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0A8A74] text-gray-700 bg-white"
          />
          <button
            type="submit"
            className="absolute right-2 bg-[#0A8A74] text-white rounded-full p-3 hover:bg-[#087a66] transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

