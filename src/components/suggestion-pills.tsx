"use client"

interface SuggestionPillsProps {
  onSelectSuggestion: (suggestion: string) => void
}

export function SuggestionPills({ onSelectSuggestion }: SuggestionPillsProps) {

  const suggestions = [
    { text: "Trendy hoodies", emoji: "🧥" },
    { text: "Leather jackets", emoji: "🥼" },
    { text: "Cozy beanies", emoji: "🧢" },
    { text: "Stylish caps", emoji: "🧢" },
    { text: "Retro sunglasses", emoji: "🕶️" },
    { text: "Chic handbags", emoji: "👜" },
    { text: "Crossbody bags", emoji: "🎒" },
    { text: "Denim vests", emoji: "👖" },
    { text: "Bucket hats", emoji: "👒" },
    { text: "Winter scarves", emoji: "🧣" },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelectSuggestion(suggestion.text)}
          className="px-4 py-2.5 bg-white rounded-full text-gray-700 hover:cursor-pointer hover:scale-110 hover:bg-[#0A8A74] hover:text-white transition-colors transition-transform duration-300 text-sm font-medium border border-gray-100"
        >
          <span className="mr-2">{suggestion.emoji}</span>
          {suggestion.text}
        </button>
      ))}
    </div>
  )
}

