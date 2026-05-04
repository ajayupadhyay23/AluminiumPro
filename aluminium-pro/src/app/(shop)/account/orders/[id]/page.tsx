"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { Loader2, ArrowLeft, Package, Truck, CheckCircle2, Building2, MapPin, Download, CreditCard, Copy, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-charcoal mb-4">Order Not Found</h2>
        <p className="text-gray-500 mb-8">This order might not exist or you don't have permission to view it.</p>
        <Button onClick={() => router.push("/account/orders")} className="bg-charcoal">Back to Orders</Button>
      </div>
    )
  }

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'CONFIRMED': return 1;
      case 'PROCESSING': return 1;
      case 'PACKED': return 1;
      case 'DISPATCHED': return 2;
      case 'IN_TRANSIT': return 2;
      case 'DELIVERED': return 3;
      case 'CANCELLED': return -1;
      default: return 0;
    }
  }

  const currentStep = getStatusStep(order.status)
  const isPending = order.status === 'PLACED' && order.paymentStatus === 'PENDING'

  // Extract primary image helper
  const getPrimaryImage = (item: any) => {
    if (!item.product?.images) return "https://picsum.photos/400/400?random=1"
    const images = item.product.images as any[]
    const primary = images.find(img => img.isPrimary)
    return primary ? primary.url : images[0]?.url
  }

  const upiId = process.env.NEXT_PUBLIC_UPI_ID || "aluminiumpro@okicici"
  const upiName = process.env.NEXT_PUBLIC_UPI_NAME || "Aluminium Pro"

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/account/orders" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-charcoal">
                Order #{order.orderNumber || order.id.slice(-8).toUpperCase()}
              </h2>
              <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                order.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 
                order.status === 'DELIVERED' ? 'bg-green-100 text-green-600' : 'bg-gold/10 text-gold-700'
              }`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {order.status !== 'PLACED' && order.status !== 'CANCELLED' && (
          <Button variant="outline" className="text-gold border-gold hover:bg-gold hover:text-white shrink-0 transition-all">
            <Download className="w-4 h-4 mr-2" /> GST Invoice
          </Button>
        )}
      </div>

      {/* Payment Instructions (If Pending) */}
      {isPending && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-amber-600">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900 mb-2">Pending Payment - Manual Verification Required</h3>
              <p className="text-amber-800/80 text-sm mb-4 leading-relaxed">
                To confirm your order, please complete the payment of <strong className="text-amber-950">₹{order.total.toLocaleString()}</strong> via UPI. 
                Once paid, our team will verify the transaction and confirm your order within 2–4 business hours.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-amber-200">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">UPI Details</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">VPA / UPI ID</span>
                      <button onClick={() => copyToClipboard(upiId)} className="flex items-center gap-2 text-sm font-bold text-charcoal hover:text-gold transition-colors">
                        {upiId} <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Payee Name</span>
                      <span className="text-sm font-bold text-charcoal">{upiName}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-amber-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Bank Transfer (IMPS/NEFT)</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Bank Name</span>
                      <span className="font-bold text-charcoal">{process.env.NEXT_PUBLIC_BANK_NAME || "HDFC Bank"}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Acc No.</span>
                      <button onClick={() => copyToClipboard(process.env.NEXT_PUBLIC_BANK_ACC_NO || "")} className="font-bold text-charcoal hover:text-gold flex items-center gap-1">
                        {process.env.NEXT_PUBLIC_BANK_ACC_NO || "50100..."} <Copy className="w-2 h-2" />
                      </button>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">IFSC Code</span>
                      <button onClick={() => copyToClipboard(process.env.NEXT_PUBLIC_BANK_IFSC || "")} className="font-bold text-charcoal hover:text-gold flex items-center gap-1">
                        {process.env.NEXT_PUBLIC_BANK_IFSC || "HDFC..."} <Copy className="w-2 h-2" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-amber-200 flex flex-col items-center justify-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Scan via any UPI App</p>
                  <div className="p-2 bg-gray-50 rounded-lg shadow-inner">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${upiName}&am=${order.total}&cu=INR`)}`}
                      alt="UPI QR Code"
                      className="w-28 h-28"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Timeline */}
      {order.status !== 'CANCELLED' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="flex items-center justify-between relative mb-8">
              
              {/* Line */}
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-gray-100 -z-10 rounded">
                <div 
                  className="h-full bg-gold rounded transition-all duration-1000"
                  style={{ width: `${(Math.max(0, currentStep) / 3) * 100}%` }}
                />
              </div>

              {[
                { label: "Order Placed", icon: Package },
                { label: "Confirmed", icon: Building2 },
                { label: "Shipped", icon: Truck },
                { label: "Delivered", icon: CheckCircle2 }
              ].map((step, idx) => {
                const isCompleted = currentStep >= idx
                const isActive = currentStep === idx
                return (
                  <div key={idx} className="flex flex-col items-center gap-3 relative bg-white px-2">
                    <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                      isCompleted ? 'border-gold bg-gold text-charcoal' : 'border-gray-200 bg-white text-gray-300'
                    } ${isActive ? 'ring-4 ring-gold/20 scale-110' : ''}`}>
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
              <div className="text-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-sm font-medium text-gray-600 flex items-center justify-center gap-2">
                  <Truck className="w-4 h-4 text-gold" />
                  Tracking Details: <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="text-gold hover:underline font-bold">{order.trackingNumber || 'View Tracking'}</a>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {order.status === 'CANCELLED' && (
        <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 font-bold text-center flex flex-col items-center gap-2">
          <span className="text-2xl">⚠️</span>
          <p>This order has been cancelled.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-charcoal">Items Ordered</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {order.items.map((item: any) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-gray-50/50 transition-colors">
                <div className="w-20 h-20 bg-lightbg rounded-xl border border-gray-100 flex-shrink-0 overflow-hidden shadow-inner">
                  <img 
                    src={getPrimaryImage(item)} 
                    alt={item.productName}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.productSku}`} className="font-bold text-charcoal hover:text-gold text-lg truncate block">
                    {item.productName}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1 uppercase font-medium tracking-tighter">
                    SKU: {item.productSku} | <span className="text-gold font-bold">Finish: {item.finishSelected}</span>
                  </p>
                  <p className="text-sm font-bold text-gray-600 mt-2">
                    {item.qty} {item.unit} x ₹{item.priceAtPurchase.toLocaleString()}/{item.unit}
                  </p>
                </div>
                <div className="text-right sm:ml-auto">
                  <p className="font-heading font-extrabold text-charcoal text-xl">₹{item.subtotal.toLocaleString()}</p>
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
              <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span>Subtotal</span>
                <span className="text-charcoal">₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span>GST (18%)</span>
                <span className="text-charcoal">₹{order.gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-400 text-xs uppercase tracking-widest">Grand Total</span>
                <span className="font-heading font-extrabold text-charcoal text-2xl">
                  ₹{order.total.toLocaleString()}
                </span>
              </div>
            </div>
            
            {order.paymentId && (
              <div className="mt-6 text-xs text-gray-500 break-all bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-3 h-3" />
                  <span className="font-bold text-charcoal uppercase tracking-tighter">Payment Ref</span>
                </div>
                <span className="font-mono bg-white px-2 py-1 rounded border border-gray-100">{order.paymentId}</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-charcoal mb-4 border-b pb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold" /> Shipping Address
            </h3>
            {order.addressSnapshot ? (
              <address className="not-italic text-sm text-gray-600 leading-relaxed">
                <p className="font-bold text-charcoal mb-2 text-base">{(order.addressSnapshot as any).name || order.user.email}</p>
                <p className="flex items-start gap-2">{(order.addressSnapshot as any).street}</p>
                <p>{(order.addressSnapshot as any).city}, {(order.addressSnapshot as any).state} - {(order.addressSnapshot as any).pincode}</p>
                <p className="mt-2 font-bold text-charcoal">📞 {(order.addressSnapshot as any).phone}</p>
              </address>
            ) : (
              <p className="text-sm text-gray-500">Address snapshot not found.</p>
            )}

            {(order.addressSnapshot as any)?.gstNumber && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
                <span className="font-bold text-gray-400 uppercase text-xs tracking-widest block mb-1">GST Number</span>
                <span className="text-charcoal font-bold uppercase">{(order.addressSnapshot as any).gstNumber}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
