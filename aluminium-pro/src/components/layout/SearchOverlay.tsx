"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Loader2, ArrowRight } from "lucide-react"
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
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
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
      setSelectedIndex(-1)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && results[selectedIndex]) {
          e.preventDefault()
          router.push(`/products/${results[selectedIndex].slug}`)
          onClose()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, results, selectedIndex, router])

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      fetchResults(debouncedQuery)
    } else {
      setResults([])
      setSelectedIndex(-1)
    }
  }, [debouncedQuery])

  const fetchResults = async (searchQuery: string) => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
      setResults(res.data.products || [])
      setSelectedIndex(-1)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

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
        <button onClick={onClose} className="text-silver hover:text-white ml-4 p-2 rounded-full hover:bg-white/10 transition-colors">
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:px-12 scrollbar-thin scrollbar-thumb-white/10">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-silver gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-gold" />
              <p className="text-sm font-medium tracking-widest uppercase">Searching Catalogue...</p>
            </div>
          ) : query.length >= 2 ? (
            results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-silver/60 text-xs font-bold uppercase tracking-widest pb-2 border-b border-white/5">
                  <span>Product Matches</span>
                  <span>{results.length} Found</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {results.map((product, idx) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group ${
                        selectedIndex === idx 
                          ? "bg-white/10 border-white/20 translate-x-2" 
                          : "bg-white/5 border-transparent hover:bg-white/5"
                      } border`}
                    >
                      <div className="relative w-16 h-16 shrink-0">
                        {product.primaryImage ? (
                          <img src={product.primaryImage} alt={product.name} className="w-full h-full object-cover rounded-lg bg-white" />
                        ) : (
                          <div className="w-full h-full bg-white/10 rounded-lg flex items-center justify-center">
                            <Search className="w-6 h-6 text-silver" />
                          </div>
                        )}
                        {selectedIndex === idx && (
                          <div className="absolute -inset-1 rounded-lg border border-gold/50 animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold transition-colors line-clamp-1 ${selectedIndex === idx ? "text-gold" : "text-white"}`}>
                          {product.name}
                        </h4>
                        <p className="text-sm text-gold mt-1">
                          ₹{product.pricePerKg}
                          <span className="text-xs text-silver ml-1">
                            /{product.category === 'Accessories' ? 'pc' : product.category === 'Sheets' ? 'sheet' : 'kg'}
                          </span>
                        </p>
                        <p className="text-sm text-silver/70 flex items-center gap-2">
                          <span className="text-xs px-1.5 py-0.5 rounded bg-white/10">{product.category}</span>
                          {product.finish && product.finish.length > 0 && (
                            <span className="text-xs font-medium text-gold/80">{product.finish.join(" • ")}</span>
                          )}
                        </p>
                      </div>
                      <div className={`transition-all duration-300 ${selectedIndex === idx ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}>
                        <ArrowRight className="w-5 h-5 text-gold" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-silver">
                <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 opacity-20" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                <p className="text-silver/60">No products found matching "{query}"</p>
              </div>
            )
          ) : recentSearches.length > 0 ? (
            <div>
              <h3 className="text-silver/50 font-heading mb-6 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                <div className="w-1 h-4 bg-gold rounded-full" />
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-3">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => handleRecentClick(term)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 hover:border-white/20 border border-transparent text-white rounded-xl text-sm transition-all flex items-center gap-2 group"
                  >
                    <Search className="w-3.5 h-3.5 text-silver group-hover:text-gold transition-colors" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-silver/40 text-sm font-medium tracking-widest uppercase">Start typing to search our inventory</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
