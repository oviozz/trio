"use client"

interface SuggestionPillsProps {
  onSelectSuggestion: (suggestion: string) => void
}

export function SuggestionPills({ onSelectSuggestion }: SuggestionPillsProps) {
  const suggestions = [
    { text: "Green hoodies", emoji: "👕" },
    { text: "Cute summer dresses", emoji: "👗" },
    { text: "Vintage jeans", emoji: "👖" },
    { text: "Workout leggings", emoji: "🏃‍♀️" },
    { text: "Casual sneakers", emoji: "👟" },
    { text: "Formal blazers", emoji: "🧥" },
    { text: "Cozy sweaters", emoji: "🧶" },
    { text: "Designer bags", emoji: "👜" },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelectSuggestion(suggestion.text)}
          className="px-5 py-2.5 bg-white rounded-full text-gray-700 hover:bg-[#0A8A74] hover:text-white transition-colors text-sm font-medium border border-gray-100"
        >
          <span className="mr-2">{suggestion.emoji}</span>
          {suggestion.text}
        </button>
      ))}
    </div>
  )
}

