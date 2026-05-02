"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { Loader2, ArrowLeft, Package, Truck, CheckCircle2, Building2, MapPin, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/user/orders/${params.id}`)
        if (res.data.success) {
          setOrder(res.data.order)
        }
      } catch (error) {
        console.error("Failed to fetch order details", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
        <h2 className="text-2xl font-bold text-charcoal mb-4">Order Not Found</h2>
        <p className="text-gray-500 mb-8">This order might not exist or you don't have permission to view it.</p>
        <Button onClick={() => router.push("/account/orders")}>Back to Orders</Button>
      </div>
    )
  }

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'PAID': return 1;
      case 'PROCESSING': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      case 'CANCELLED': return -1;
      default: return 0;
    }
  }

  const currentStep = getStatusStep(order.status)

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/account/orders" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal">
              Order #{order.id.slice(-8).toUpperCase()}
            </h2>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {order.status !== 'PENDING' && order.status !== 'CANCELLED' && (
          <Button variant="outline" className="text-gold border-gold hover:bg-gold hover:text-white shrink-0">
            <Download className="w-4 h-4 mr-2" /> GST Invoice
          </Button>
        )}
      </div>

      {/* Tracking Timeline */}
      {order.status !== 'CANCELLED' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="flex items-center justify-between relative mb-8">
              
              {/* Line */}
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-gray-200 -z-10 rounded">
                <div 
                  className="h-full bg-gold rounded transition-all duration-1000"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>

              {[
                { label: "Order Placed", icon: Package },
                { label: "Processing", icon: Building2 },
                { label: "Shipped", icon: Truck },
                { label: "Delivered", icon: CheckCircle2 }
              ].map((step, idx) => {
                const isCompleted = currentStep >= idx
                const isActive = currentStep === idx
                return (
                  <div key={idx} className="flex flex-col items-center gap-3 relative bg-white px-2">
                    <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-colors ${
                      isCompleted ? 'border-gold bg-gold text-charcoal' : 'border-gray-200 bg-white text-gray-300'
                    } ${isActive ? 'ring-4 ring-gold/20' : ''}`}>
                      <step.icon className={`w-5 h-5 ${isCompleted ? 'text-charcoal' : ''}`} />
                    </div>
                    <span className={`text-sm font-bold ${isCompleted ? 'text-charcoal' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
            
            {order.trackingUrl && (
              <div className="text-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-sm font-medium text-gray-600">
                  Tracking URL: <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{order.trackingUrl}</a>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {order.status === 'CANCELLED' && (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 font-bold text-center">
          This order was cancelled.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-charcoal">Items Ordered</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {order.items.map((item: any) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-20 h-20 bg-lightbg rounded-md border border-gray-100 flex-shrink-0 overflow-hidden">
                  <img 
                    src={item.product.primaryImage || "https://picsum.photos/200"} 
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Link href={`/products/${item.product.sku}`} className="font-bold text-charcoal hover:text-gold text-lg">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">SKU: {item.product.sku} | Finish: {item.finish}</p>
                  <p className="text-sm font-medium text-gray-600 mt-2">
                    {item.quantity} {item.unit} x ₹{item.price}/{item.unit}
                  </p>
                </div>
                <div className="text-right sm:ml-auto">
                  <p className="font-bold text-charcoal text-lg">₹{item.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Addresses */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-charcoal mb-4 border-b pb-2">Order Summary</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-charcoal">₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>GST (18%)</span>
                <span className="font-medium text-charcoal">₹{order.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <span className="font-bold text-charcoal text-lg">Total</span>
              <span className="font-heading font-extrabold text-charcoal text-2xl">
                ₹{order.totalAmount.toLocaleString()}
              </span>
            </div>
            
            {order.razorpayPaymentId && (
              <div className="mt-6 text-xs text-gray-500 break-all bg-gray-50 p-3 rounded border border-gray-100">
                <span className="font-bold text-charcoal">Payment Ref:</span> {order.razorpayPaymentId}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-charcoal mb-4 border-b pb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold" /> Shipping Address
            </h3>
            {order.shippingAddress ? (
              <address className="not-italic text-sm text-gray-600 leading-relaxed">
                <p className="font-bold text-charcoal mb-1">{order.user.email}</p>
                <p>{(order.shippingAddress as any).street}</p>
                <p>{(order.shippingAddress as any).city}, {(order.shippingAddress as any).state}</p>
                <p>Pincode: {(order.shippingAddress as any).pincode}</p>
              </address>
            ) : (
              <p className="text-sm text-gray-500">Address not provided.</p>
            )}

            {order.gstNumber && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
                <span className="font-bold text-charcoal">GST Number:</span>
                <span className="text-gray-600 ml-2 uppercase">{order.gstNumber}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
