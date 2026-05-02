"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ChevronDown, ChevronUp, Check, X, SlidersHorizontal } from "lucide-react"

export default function FilterSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    finish: true,
    alloyGrade: true
  })

  // State from URL
  const selectedCategories = searchParams.get("category")?.split(",") || []
  const selectedFinishes = searchParams.get("finish")?.split(",") || []
  const selectedGrades = searchParams.get("alloyGrade")?.split(",") || []

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const updateFilters = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    
    // For arrays
    if (['category', 'finish', 'alloyGrade'].includes(key)) {
      const existing = current.get(key)?.split(",") || []
      let newValues = []
      
      if (existing.includes(value)) {
        newValues = existing.filter(v => v !== value)
      } else {
        newValues = [...existing, value]
      }

      if (newValues.length > 0) {
        current.set(key, newValues.join(","))
      } else {
        current.delete(key)
      }
    } else {
      // For single values
      if (value) {
        current.set(key, value)
      } else {
        current.delete(key)
      }
    }

    // Reset page to 1 when filters change
    current.delete("page")
    
    router.push(`${pathname}?${current.toString()}`)
  }

  const clearFilters = () => {
    router.push(pathname)
    setIsMobileOpen(false)
  }

  const FilterSection = ({ title, id, options, selectedValues }: any) => (
    <div className="py-4 border-b border-gray-100">
      <button 
        onClick={() => toggleSection(id)}
        className="flex items-center justify-between w-full text-left font-bold text-charcoal hover:text-gold transition-colors"
      >
        {title}
        {openSections[id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {openSections[id] && (
        <div className="mt-4 space-y-3">
          {options.map((option: any) => {
            const isSelected = selectedValues.includes(option.value)
            return (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={isSelected}
                  onChange={() => updateFilters(id, option.value)} 
                />
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-gold border-gold text-white' : 'border-gray-300 group-hover:border-gold'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-sm ${isSelected ? 'text-charcoal font-semibold' : 'text-gray-600'}`}>
                  {option.label}
                </span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 w-full px-4 py-3 bg-white border border-gray-200 rounded-lg mb-4 text-charcoal font-bold"
      >
        <SlidersHorizontal className="w-5 h-5" /> Filters
      </button>

      {/* Sidebar Content */}
      <div className={`
        fixed inset-0 z-50 lg:z-0 lg:static lg:block
        ${isMobileOpen ? 'block' : 'hidden'}
      `}>
        {/* Mobile Overlay */}
        <div 
          className="absolute inset-0 bg-charcoal/50 lg:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />

        {/* Sidebar Panel */}
        <div className="absolute lg:static inset-y-0 left-0 w-80 lg:w-full max-w-full bg-white lg:bg-transparent shadow-2xl lg:shadow-none overflow-y-auto lg:overflow-visible flex flex-col h-full">
          
          <div className="p-4 lg:p-0 flex items-center justify-between border-b lg:border-none border-gray-100">
            <h2 className="text-xl font-heading font-bold text-charcoal">Filters</h2>
            <div className="flex items-center gap-4">
              <button onClick={clearFilters} className="text-sm text-gold hover:underline font-medium">
                Clear all
              </button>
              <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-gray-400 hover:text-charcoal">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-4 lg:p-0 flex-1">
            {!pathname.includes('/category/') && (
              <FilterSection 
                title="Categories" 
                id="category" 
                selectedValues={selectedCategories}
                options={[
                  { label: "Sheets", value: "Sheets" },
                  { label: "Material", value: "Material" },
                  { label: "Grills", value: "Grills" },
                  { label: "Accessories", value: "Accessories" },
                ]} 
              />
            )}

            {!pathname.includes('/category/accessories') && (
              <FilterSection 
                title="Color / Finish" 
                id="finish" 
                selectedValues={selectedFinishes}
                options={[
                  { label: "Silver", value: "SILVER" },
                  { label: "Colour (Mixed)", value: "COLOUR" },
                  { label: "Wooden", value: "WOODEN" },
                  { label: "White", value: "WHITE" },
                  { label: "Black", value: "BLACK" },
                  { label: "Brown", value: "BROWN" },
                  { label: "Bronze", value: "BRONZE" },
                  { label: "Champagne", value: "CHAMPAGNE" },
                  { label: "Red", value: "RED" },
                  { label: "Blue", value: "BLUE" },
                  { label: "Green", value: "GREEN" },
                  { label: "Ivory", value: "IVORY" },
                ]} 
              />
            )}

            {!(pathname.includes('/category/sheets') || pathname.includes('/category/accessories')) && (
              <FilterSection 
                title="Alloy Grade" 
                id="alloyGrade" 
                selectedValues={selectedGrades}
                options={[
                  { label: "6063 (Standard)", value: "6063" },
                  { label: "6061 (Structural)", value: "6061" },
                ]} 
              />
            )}
          </div>

          <div className="p-4 lg:hidden border-t border-gray-100 bg-gray-50">
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="w-full py-3 bg-charcoal text-white font-bold rounded-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
