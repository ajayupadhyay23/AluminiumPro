"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import FilterSidebar from "@/components/products/FilterSidebar"
import ProductCard from "@/components/products/ProductCard"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"

function CategoryContent({ categorySlug }: { categorySlug: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  // Map slug to proper category string
  const getCategoryName = (slug: string) => {
    switch(slug) {
      case "sheets": return "Sheets"
      case "material": return "Material"
      case "grills": return "Grills"
      case "accessories": return "Accessories"
      default: return slug.replace(/-/g, ' ')
    }
  }

  const getBannerImage = (slug: string) => {
    switch(slug) {
      case "sheets": return "https://images.unsplash.com/photo-1518557984649-7b161c230cfa?q=80&w=1600&auto=format&fit=crop" // Metallic texture
      case "material": return "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop" // Construction/metal
      case "grills": return "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1600&auto=format&fit=crop" // Architectural/grid
      case "accessories": return "https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=1600&auto=format&fit=crop" // Hardware/tools
      default: return "https://images.unsplash.com/photo-1518557984649-7b161c230cfa?q=80&w=1600&auto=format&fit=crop"
    }
  }

  const categoryName = getCategoryName(categorySlug)
  const bannerImage = getBannerImage(categorySlug)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        // Force the category filter
        current.set("category", categoryName)
        
        const res = await axios.get(`/api/products?${current.toString()}`)
        if (res.data.success) {
          setProducts(res.data.products)
          setPagination(res.data.pagination)
        }
      } catch (error) {
        console.error("Failed to fetch category products", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams, categoryName])

  const handlePageChange = (newPage: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set("page", newPage.toString())
    router.push(`${pathname}?${current.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set("sort", e.target.value)
    current.set("page", "1")
    router.push(`${pathname}?${current.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Header Banner */}
      <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden relative mb-8 flex items-center justify-center">
        <img src={bannerImage} alt={categoryName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/70 bg-aluminium-texture" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold mb-4 capitalize drop-shadow-md">
            {categoryName}
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto drop-shadow">
            Explore our premium range of {categoryName.toLowerCase()} designed for maximum durability and finish.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 xl:w-1/5 shrink-0">
          <FilterSidebar />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4 xl:w-4/5 flex flex-col min-h-[600px]">
          
          {categorySlug === "sheets" && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-1">Looking for Standard ACP Sizes?</h3>
                <p className="text-blue-700 text-sm">View our complete catalogue of Areca and Skybond ACP sheet sizes, thicknesses, and colours.</p>
              </div>
              <Link href="/acp-sheet-sizes" className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm">
                View Size Guide
              </Link>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
            <div className="text-sm text-gray-500 font-medium">
              Showing {products.length} of {pagination.total} products
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort by:</label>
              <select 
                id="sort" 
                className="text-sm border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                value={searchParams.get("sort") || "newest"}
                onChange={handleSortChange}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-gold" />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-auto flex justify-center items-center gap-2 border-t pt-8">
                  <button 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-md font-bold text-sm ${
                        pagination.page === i + 1 
                          ? 'bg-charcoal text-white' 
                          : 'border hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-lightbg rounded-2xl border border-dashed border-gray-300">
              <h3 className="text-xl font-bold text-charcoal mb-2">No products found</h3>
              <p className="text-silver">Try adjusting your filters or search terms to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-gold" />
      </div>
    }>
      <CategoryContent categorySlug={params.slug} />
    </Suspense>
  )
}
