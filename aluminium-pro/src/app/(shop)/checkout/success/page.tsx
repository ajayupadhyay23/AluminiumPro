"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Package, ArrowRight, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BUSINESS_CONFIG } from "@/config/business"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams?.get("orderId")
  const [mounted, setMounted] = useState(false)
  const [order, setOrder] = useState<any>(null)
  
  // Use environment variables for payment details
  // Use config for payment details
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || BUSINESS_CONFIG.upi.id
  const phoneNumber = process.env.NEXT_PUBLIC_UPI_PHONE || BUSINESS_CONFIG.upi.phone
  const displayName = process.env.NEXT_PUBLIC_UPI_NAME || BUSINESS_CONFIG.upi.name

  useEffect(() => {
    setMounted(true)
    if (!orderId) {
      router.push("/")
      return
    }
    // Fetch order details to get the exact amount
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/user/orders/${orderId}`)
        if (res.ok) {
          const data = await res.json()
          setOrder(data.order)
        }
      } catch (err) {
        console.error("Failed to fetch order", err)
      }
    }
    fetchOrder()
  }, [orderId, router])

  if (!mounted || !orderId) return null

  return (
    <div className="min-h-screen bg-lightbg flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-green-50 -z-10" />
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-green-500 animate-ping rounded-full opacity-20" />
          <CheckCircle2 className="w-12 h-12 text-green-600 relative z-10" />
        </div>

        <h1 className="text-3xl font-heading font-extrabold text-charcoal mb-2">Order Saved Successfully!</h1>
        <p className="text-gray-500 mb-6">
          Your order has been recorded. To complete your purchase and begin processing, please make the payment using Google Pay or PhonePe.
        </p>

        {order && (
          <div className="bg-[#0C1A30] rounded-xl p-6 mb-8 text-white">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Amount to Pay</p>
            <p className="text-4xl font-extrabold font-heading mb-6">₹{order.total?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            
            <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center">
              <p className="text-sm font-bold text-charcoal mb-3">Scan via any UPI App</p>
              {/* Generate QR Code using a free QR API */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${displayName}&am=${order.total.toFixed(2)}&cu=INR`)}`}
                alt="UPI QR Code"
                className="w-48 h-48 mb-4"
              />
              
              {/* Mobile Pay Button */}
              <a 
                href={`upi://pay?pa=${upiId}&pn=${displayName}&am=${order.total.toFixed(2)}&cu=INR`}
                className="sm:hidden w-full bg-gold text-charcoal py-3 rounded-lg font-bold flex items-center justify-center gap-2 mb-2"
              >
                <QrCode className="w-5 h-5" /> Pay Now
              </a>
              
              <p className="text-xs text-gray-500">Google Pay • PhonePe • Paytm</p>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-6 text-left mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <span className="text-sm font-bold text-gray-500 uppercase">Order Reference</span>
            <span className="font-mono font-bold text-charcoal">{orderId}</span>
          </div>

          {order?.addressSnapshot?.gstNumber && (
            <div className="mb-4 pb-4 border-b border-gray-200 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500 uppercase">GST Number</span>
              <span className="font-bold text-charcoal uppercase">{order.addressSnapshot.gstNumber}</span>
            </div>
          )}
          
          <div className="flex items-start gap-4">
            <Package className="w-6 h-6 text-gold shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-charcoal">Manual Payment Details</h4>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Phone Number:</strong> {phoneNumber}<br/>
                <strong>UPI ID:</strong> {upiId}
              </p>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed border-t pt-3 border-gray-200">
                After making the payment, our team will verify the transaction within a few hours and begin dispatching your profiles. You will receive an email once it is shipped.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/account/orders" className="flex-1">
            <Button className="w-full h-12 bg-charcoal hover:bg-black text-white font-bold">
              View Order Details
            </Button>
          </Link>
          <Link href="/products" className="flex-1">
            <Button variant="outline" className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold group">
              Continue Shopping <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
