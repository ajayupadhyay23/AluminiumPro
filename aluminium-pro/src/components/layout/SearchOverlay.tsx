"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useDebounce } from "@/hooks/useDebounce"

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load recent searches
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    if (!isOpen) {
      setQuery("")
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      fetchResults(debouncedQuery)
    } else {
      setResults([])
    }
  }, [debouncedQuery])

  const fetchResults = async (searchQuery: string) => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
      setResults(res.data.products || [])
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    // Save to recent
    const updatedRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updatedRecent)
    localStorage.setItem("recentSearches", JSON.stringify(updatedRecent))

    router.push(`/search?q=${encodeURIComponent(query)}`)
    onClose()
  }

  const handleRecentClick = (term: string) => {
    setQuery(term)
    router.push(`/search?q=${encodeURIComponent(term)}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-charcoal/95 backdrop-blur-md transition-opacity">
      <div className="flex items-center justify-between p-4 sm:p-6 lg:px-12 border-b border-white/10">
        <form onSubmit={handleSearch} className="flex-1 max-w-4xl mx-auto flex items-center relative">
          <Search className="absolute left-4 w-6 h-6 text-silver" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search aluminium profiles, sections, accessories..."
            className="w-full bg-transparent text-white text-xl sm:text-2xl placeholder:text-gray-500 border-none outline-none pl-14 pr-4 py-4"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-12 text-silver hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </form>
        <button onClick={onClose} className="text-silver hover:text-white ml-4">
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-silver">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : query.length >= 2 ? (
            results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    {product.primaryImage ? (
                      <img src={product.primaryImage} alt={product.name} className="w-16 h-16 object-cover rounded bg-white" />
                    ) : (
                      <div className="w-16 h-16 bg-white/10 rounded flex items-center justify-center">
                        <Search className="w-6 h-6 text-silver" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-medium group-hover:text-gold transition-colors line-clamp-1">{product.name}</h4>
                      <p className="text-sm text-silver">{product.category}</p>
                      <p className="text-sm text-gold mt-1">₹{product.pricePerKg}/kg</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-silver">
                No products found matching "{query}"
              </div>
            )
          ) : recentSearches.length > 0 ? (
            <div>
              <h3 className="text-silver font-heading mb-4 text-sm tracking-wider uppercase">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => handleRecentClick(term)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
