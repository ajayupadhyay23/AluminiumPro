"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import ProductCard from "@/components/products/ProductCard"

export default function FeaturedProducts({ selectedFinish }: { selectedFinish: string }) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`/api/products?featured=true&finish=${selectedFinish}&limit=8`)
        if (res.data.success) {
          setProducts(res.data.products)
        }
      } catch (error) {
        console.error("Failed to fetch featured products", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [selectedFinish])

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-charcoal text-center mb-4">
            Featured Profiles
          </h2>
          <p className="text-silver text-center max-w-2xl">
            Our most popular {selectedFinish === 'all' ? '' : selectedFinish} aluminium sections, trusted by fabricators across the nation.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-96 w-full"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-lightbg rounded-xl border border-dashed border-gray-300">
            No featured products found for this finish.
          </div>
        )}
      </div>
    </section>
  )
}
