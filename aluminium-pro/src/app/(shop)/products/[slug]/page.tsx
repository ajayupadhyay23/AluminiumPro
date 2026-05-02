"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import toast from "react-hot-toast"
import { Loader2, CheckCircle2, ShieldCheck, Truck, Package, MessageCircle } from "lucide-react"

import ImageGallery from "@/components/products/ImageGallery"
import PriceCalculator from "@/components/shared/PriceCalculator"
import ProductCard from "@/components/products/ProductCard"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedFinish, setSelectedFinish] = useState<string>("")
  const [pincode, setPincode] = useState("")
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null)
  const [deliveryLoading, setDeliveryLoading] = useState(false)
  
  const addItemToCart = useCartStore(state => state.addItem)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${slug}`)
        if (res.data.success) {
          setProduct(res.data.product)
          setRelatedProducts(res.data.relatedProducts)
          // Set initial finish
          if (res.data.product.finish && res.data.product.finish.length > 0) {
            setSelectedFinish(res.data.product.finish[0])
          }
        }
      } catch (error) {
        console.error("Failed to load product", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  const checkPincode = async () => {
    if (pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode")
      return
    }
    setDeliveryLoading(true)
    try {
      const res = await axios.get(`/api/pincode/${pincode}`)
      setDeliveryInfo(res.data.data)
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to check delivery")
    } finally {
      setDeliveryLoading(false)
    }
  }

  const handleAddToCart = (quantity: number, unit: string) => {
    if (!product) return
    
    // Safely extract the primary image
    let imageUrl = "https://picsum.photos/400/300?random=1"
    if (product.primaryImage) {
      imageUrl = product.primaryImage
    } else if (Array.isArray(product.images) && product.images.length > 0) {
      const primary = product.images.find((img: any) => img.isPrimary)
      imageUrl = primary ? primary.url : product.images[0].url
    }

    const cartItem = {
      id: `${product.id}-${selectedFinish}-${unit}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      finish: selectedFinish || product.finish?.[0] || 'Standard',
      quantity,
      unit,
      price: unit === 'kg' ? product.pricePerKg : (product.pricePerFoot || product.pricePerKg * (product.weightPerFoot || 1)),
      image: imageUrl
    }
    
    addItemToCart(cartItem)
    toast.success(`Added ${quantity} ${unit} to cart!`)
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-gold" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-charcoal mb-4">Product Not Found</h1>
        <p className="text-silver mb-8">The profile you are looking for does not exist or has been removed.</p>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="bg-lightbg border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 text-sm font-medium text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-gold">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gold">Products</Link>
          <span>/</span>
          <Link href={`/category/${product.category.toLowerCase().replace(/\\s+/g, '-')}`} className="hover:text-gold">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-charcoal truncate">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Image Gallery */}
          <div>
            <ImageGallery images={product.images || []} selectedFinish={selectedFinish} />
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs font-bold rounded uppercase tracking-wider">
                SKU: {product.sku}
              </span>
              {product.stock > 0 ? (
                <span className="bg-green-100 text-green-700 px-2 py-1 text-xs font-bold rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> In Stock ({product.stock} kg)
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 px-2 py-1 text-xs font-bold rounded">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-heading font-extrabold text-charcoal mb-4">
              {product.name}
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Finish Selection */}
            {product.finish && product.finish.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-3">
                  Select Finish
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.finish.map((f: string) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFinish(f)}
                      className={`px-4 py-2 border-2 rounded-md font-medium text-sm transition-all ${
                        selectedFinish === f 
                          ? 'border-gold bg-gold/5 text-charcoal' 
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Calculator */}
            <div className="mb-8">
              <PriceCalculator 
                pricePerKg={product.pricePerKg}
                pricePerFoot={product.pricePerFoot}
                weightPerFoot={product.weightPerFoot}
                category={product.category}
                unitName={product.specs?.unit}
                onAddToCart={handleAddToCart}
              />
            </div>

            {/* Pincode Checker */}
            <div className="bg-lightbg p-5 rounded-xl border border-gray-100 mb-8">
              <h3 className="text-sm font-bold text-charcoal flex items-center gap-2 mb-3">
                <Truck className="w-4 h-4 text-gold" /> Check Delivery Estimate
              </h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\\D/g, '').slice(0,6))}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-gold focus:ring-gold sm:text-sm px-3 py-2 border outline-none"
                />
                <Button onClick={checkPincode} disabled={deliveryLoading} variant="secondary">
                  {deliveryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check"}
                </Button>
              </div>
              {deliveryInfo && (
                <p className={`mt-3 text-sm font-medium ${deliveryInfo.isDeliverable ? 'text-green-600' : 'text-red-500'}`}>
                  {deliveryInfo.isDeliverable 
                    ? `✓ ${deliveryInfo.estimate}` 
                    : "✗ " + deliveryInfo.message}
                </p>
              )}
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-gold" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Alloy Grade</p>
                  <p className="font-medium text-charcoal">{product.alloyGrade}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Package className="w-6 h-6 text-gold" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Temper</p>
                  <p className="font-medium text-charcoal">{product.temper}</p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-8">
              <a 
                href={`https://wa.me/919876543210?text=Hi, I am interested in bulk ordering ${product.name} (SKU: ${product.sku}).`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-md font-bold text-lg transition-colors"
              >
                <MessageCircle className="w-6 h-6" /> Enquire on WhatsApp
              </a>
            </div>

          </div>
        </div>

        {/* Specifications Table */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-6 border-b pb-2">Technical Specifications</h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm text-gray-600">
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(product.specifications).map(([key, value]: [string, any], index) => (
                    <tr key={key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-medium text-charcoal w-1/3 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                      <td className="px-6 py-4">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-6 border-b pb-2">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
