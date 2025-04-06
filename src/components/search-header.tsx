import { ShoppingBag } from "lucide-react"

export function SearchHeader() {
  return (
    <header className="bg-purple-700 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8" />
            <h1 className="text-2xl font-bold">ShopSearch</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li className="hover:text-purple-200 transition-colors">Home</li>
              <li className="hover:text-purple-200 transition-colors">Categories</li>
              <li className="hover:text-purple-200 transition-colors">Deals</li>
              <li className="hover:text-purple-200 transition-colors">Contact</li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

