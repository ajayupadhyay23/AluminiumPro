"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Trash2, ShoppingCart, ArrowLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlistStore } from "@/store/wishlistStore"
import { useCartStore } from "@/store/cartStore"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

export default function WishlistPage() {
  const { items: wishlistItems, removeItem: removeFromWishlist, clearWishlist } = useWishlistStore()
  const addItemToCart = useCartStore(state => state.addItem)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleMoveToCart = (item: any) => {
    addItemToCart({
      id: `${item.id}-Standard-unit`, // Simple fallback since we don't have all details here
      productId: item.id,
      name: item.name,
      slug: item.slug,
      finish: 'Standard',
      quantity: 1,
      unit: 'unit',
      price: item.price,
      image: item.image
    })
    removeFromWishlist(item.id)
    toast.success("Moved to cart!")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/account/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <h1 className="text-3xl font-heading font-bold text-charcoal flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-current" /> My Wishlist
          </h1>
        </div>
        {wishlistItems.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-500 border-red-200 hover:bg-red-50"
            onClick={() => {
              if (confirm("Clear all items from wishlist?")) {
                clearWishlist()
                toast.success("Wishlist cleared")
              }
            }}
          >
            Clear Wishlist
          </Button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Save your favorite aluminium profiles and accessories here to keep track of what you need for your project.
          </p>
          <Link href="/products">
            <Button className="bg-gold text-charcoal hover:bg-charcoal hover:text-white px-8 h-12 text-lg">
              Explore Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="relative aspect-[4/3] bg-lightbg overflow-hidden">
                <Link href={`/products/${item.slug}`}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="text-xs text-silver mb-1 uppercase tracking-wider font-semibold">
                  {item.category}
                </div>
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-heading font-bold text-charcoal mb-4 hover:text-gold transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                </Link>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="text-lg font-bold text-gold">
                    ₹{item.price}<span className="text-xs font-normal text-gray-400">/kg</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-gold text-gold hover:bg-gold hover:text-white"
                      onClick={() => handleMoveToCart(item)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
