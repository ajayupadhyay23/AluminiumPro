"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface ProductCardProps {
  product: any
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItemToCart = useCartStore(state => state.addItem)
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore()
  
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isWishlisted = mounted && wishlistItems.some(item => item.id === product.id)
  // Safe extraction of primary image
  let imageUrl = "https://picsum.photos/400/300?random=1"
  if (product.primaryImage) {
    imageUrl = product.primaryImage
  } else if (Array.isArray(product.images) && product.images.length > 0) {
    const primary = product.images.find((img: any) => img.isPrimary)
    imageUrl = primary ? primary.url : product.images[0].url
  }

  // Stock status
  let stockBadge = { text: "In Stock", color: "bg-green-100 text-green-800" }
  if (product.stock === 0) stockBadge = { text: "Out of Stock", color: "bg-red-100 text-red-800" }
  else if (product.stock < 50) stockBadge = { text: "Low Stock", color: "bg-orange-100 text-orange-800" }

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[4/3] bg-lightbg overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <img 
            src={imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${stockBadge.color}`}>
            {stockBadge.text}
          </span>
          {product.isFeatured && (
            <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-gold text-white w-fit">
              Featured
            </span>
          )}
        </div>
        <button 
          type="button"
          className={cn(
            "absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
            isWishlisted 
              ? "bg-red-500 text-white shadow-lg scale-110" 
              : "bg-white/80 backdrop-blur text-gray-500 hover:text-red-500 hover:bg-white"
          )}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (isWishlisted) {
              removeFromWishlist(product.id)
              toast.success("Removed from wishlist")
            } else {
              addToWishlist({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.pricePerKg,
                image: imageUrl,
                category: product.category
              })
              toast.success("Added to wishlist!")
            }
          }}
        >
          <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
        </button>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/products/${product.slug}`} className="flex-1">
            <h3 className="font-heading font-bold text-charcoal leading-tight line-clamp-2 group-hover:text-gold transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        
        <div className="text-xs text-silver mb-4 uppercase tracking-wider font-medium">
          {product.category} | SKU: {product.sku}
        </div>
        
        <div className="flex gap-1 mb-4 flex-wrap">
          {product.finish?.map((f: string) => {
            const colors: any = { COLOUR: "bg-orange-500", SILVER: "bg-gray-300", WOODEN: "bg-amber-800" }
            return (
              <span key={f} className={`w-3 h-3 rounded-full ${colors[f] || 'bg-gray-400'}`} title={f} />
            )
          })}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div>
            {product.category === 'Sheets' || product.category === 'Grills' ? (
              <p className="text-lg font-bold text-charcoal">₹{product.pricePerKg}<span className="text-sm font-normal text-gray-500">/{product.specs?.unit || 'sheet'}</span></p>
            ) : product.category === 'Accessories' ? (
              <p className="text-lg font-bold text-charcoal">₹{product.pricePerKg}<span className="text-sm font-normal text-gray-500">/{product.specs?.unit || 'pc'}</span></p>
            ) : (
              <>
                <p className="text-lg font-bold text-charcoal">₹{product.pricePerKg}<span className="text-sm font-normal text-gray-500">/kg</span></p>
                {product.pricePerFoot > 0 && <p className="text-xs text-silver">₹{product.pricePerFoot}/ft</p>}
              </>
            )}
          </div>
          <Button 
            size="sm" 
            className="bg-gold text-charcoal hover:bg-charcoal hover:text-white transition-colors"
            onClick={(e) => {
              e.preventDefault()
              const isSheet = product.category === 'Sheets'
              const isAcc = product.category === 'Accessories'
              const isGrill = product.category === 'Grills'
              const unit = product.specs?.unit || (isSheet || isGrill ? 'sheet' : (isAcc ? 'pc' : 'kg'))
              const qty = product.moq || (isSheet || isGrill ? 1 : (isAcc ? 1 : 100))
              
              addItemToCart({
                id: `${product.id}-${product.finish?.[0] || 'Standard'}-${unit}`,
                productId: product.id,
                name: product.name,
                slug: product.slug,
                finish: product.finish?.[0] || 'Standard',
                quantity: qty,
                unit: unit,
                price: product.pricePerKg,
                image: imageUrl
              })
              toast.success(`Added ${qty} ${unit} to cart!`)
            }}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
