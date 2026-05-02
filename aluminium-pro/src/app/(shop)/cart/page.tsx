"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useCartStore } from "@/store/cartStore"
import { Trash2, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CartPage() {
  // Fix hydration mismatch with Zustand persist
  const [mounted, setMounted] = useState(false)
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const subtotal = getSubtotal()
  const gst = subtotal * 0.18
  const total = subtotal + gst

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Trash2 className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-charcoal mb-4">Your Cart is Empty</h1>
        <p className="text-silver mb-8 max-w-md">Looks like you haven't added any premium aluminium profiles to your wholesale cart yet.</p>
        <Link href="/products">
          <Button className="h-12 px-8 text-lg">Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-lightbg min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl lg:text-4xl font-heading font-extrabold text-charcoal mb-8">
          Wholesale Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Desktop Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    
                    <div className="col-span-1 sm:col-span-6 flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-lightbg border border-gray-100" />
                      <div>
                        <Link href={`/products/${item.slug}`} className="font-bold text-charcoal hover:text-gold line-clamp-2">
                          {item.name}
                        </Link>
                        <div className="text-sm text-gray-500 mt-1 flex gap-2">
                          <span>Finish: <span className="font-medium text-charcoal">{item.finish}</span></span>
                          <span>|</span>
                          <span>Unit: <span className="font-medium text-charcoal">{item.unit.toUpperCase()}</span></span>
                        </div>
                        <div className="text-sm text-gold font-bold mt-1">₹{item.price}/{item.unit}</div>
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-3 flex justify-start sm:justify-center">
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - (item.unit === 'kg' ? 10 : 1))}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 h-8 text-center text-sm font-bold border-none focus:ring-0"
                        />
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + (item.unit === 'kg' ? 10 : 1))}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 text-left sm:text-right font-bold text-charcoal text-lg">
                      ₹{(item.price * item.quantity).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-heading font-bold text-charcoal mb-6 border-b pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium text-charcoal">₹{subtotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-medium text-charcoal">₹{gst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Calculated at Checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-charcoal">Total Amount</span>
                  <div className="text-right">
                    <span className="block text-3xl font-heading font-extrabold text-charcoal">
                      ₹{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-gray-500">(Includes GST)</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout" className="block w-full">
                <Button className="w-full h-14 text-lg bg-gold text-charcoal hover:bg-charcoal hover:text-white transition-colors group">
                  Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <div className="mt-6 flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-green-600 shrink-0" />
                <p className="text-xs text-green-800 font-medium">
                  Safe & Secure Checkout. GST Input Credit invoice will be generated automatically.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
