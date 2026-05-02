"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Save, MapPin, Truck, Package, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const STATUS_OPTIONS = [
  { value: 'PLACED',     label: 'Placed — Awaiting confirmation' },
  { value: 'CONFIRMED',  label: 'Confirmed — Payment received' },
  { value: 'PROCESSING', label: 'Processing — Being prepared' },
  { value: 'PACKED',     label: 'Packed — Ready to ship' },
  { value: 'DISPATCHED', label: 'Dispatched — Handed to courier' },
  { value: 'IN_TRANSIT', label: 'In Transit — On the way' },
  { value: 'DELIVERED',  label: 'Delivered — Order complete' },
  { value: 'CANCELLED',  label: 'Cancelled' },
  { value: 'REFUNDED',   label: 'Refunded' },
]

const STATUS_COLORS: Record<string, string> = {
  PLACED:     'bg-blue-100 text-blue-800',
  CONFIRMED:  'bg-sky-100 text-sky-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  PACKED:     'bg-yellow-100 text-yellow-800',
  DISPATCHED: 'bg-orange-100 text-orange-800',
  IN_TRANSIT: 'bg-amber-100 text-amber-800',
  DELIVERED:  'bg-green-100 text-green-800',
  CANCELLED:  'bg-red-100 text-red-800',
  REFUNDED:   'bg-gray-100 text-gray-600',
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [status, setStatus] = useState("")
  const [note, setNote] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [courierName, setCourierName] = useState("")
  const [trackingUrl, setTrackingUrl] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/api/admin/orders/${params.id}`)
      if (res.data.success) {
        const o = res.data.order
        setOrder(o)
        setStatus(o.status)
        setTrackingNumber(o.trackingNumber || "")
        setCourierName(o.courierName || "")
        setTrackingUrl(o.trackingUrl || "")
      }
    } catch (error) {
      console.error("Failed to fetch order", error)
      toast.error("Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrder() }, [params.id])

  const handleUpdate = async () => {
    setSaving(true)
    try {
      const res = await axios.patch(`/api/admin/orders/${params.id}`, {
        status,
        note: note || undefined,
        trackingNumber: trackingNumber || undefined,
        courierName: courierName || undefined,
        trackingUrl: trackingUrl || undefined,
      })
      if (res.data.success) {
        toast.success("Order updated — customer notified by email")
        setOrder(res.data.order)
        setNote("")
      } else {
        toast.error(res.data.error || "Update failed")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-charcoal" />
      </div>
    )
  }

  if (!order) return (
    <div className="text-center py-20 text-gray-500">
      Order not found. <Link href="/admin/orders" className="text-gold underline">Go back</Link>
    </div>
  )

  // Pull address from snapshot (saved at purchase time)
  const addr = order.addressSnapshot || order.address || {}
  const showTracking = ['DISPATCHED','IN_TRANSIT','DELIVERED'].includes(status)

  return (
    <div className="space-y-6 max-w-6xl">
      
      {/* Header */}
      <div className="flex items-center gap-4 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <Link href="/admin/orders" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-heading font-extrabold text-charcoal">
              Order #{order.orderNumber || order.id.slice(-8).toUpperCase()}
            </h2>
            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
              {order.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Order Details */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <h3 className="font-bold text-charcoal">Order Items ({order.items?.length || 0})</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items?.map((item: any) => {
                // Support both old (primaryImage) and new (images array) formats
                const imgUrl = item.product?.images?.[0]?.url || "https://picsum.photos/100"
                return (
                  <div key={item.id} className="p-4 flex gap-4 items-center">
                    <div className="w-14 h-14 bg-gray-50 rounded border border-gray-100 flex-shrink-0 overflow-hidden">
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-charcoal text-sm truncate">{item.productName || item.product?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        SKU: {item.productSku || item.product?.sku} &bull; Finish: {item.finishSelected}
                      </p>
                      <p className="text-xs font-bold text-gray-600 mt-1">
                        {item.qty} {item.unit} @ ₹{item.priceAtPurchase}/{item.unit}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-charcoal">₹{Number(item.subtotal).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Totals */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>GST</span>
                    <span>₹{Number(order.gstAmount).toLocaleString('en-IN')}</span>
                  </div>
                  {order.shippingAmount > 0 && (
                    <div className="flex justify-between text-gray-500">
                      <span>Shipping</span>
                      <span>₹{Number(order.shippingAmount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                      <span>-₹{Number(order.discount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-extrabold text-charcoal text-base border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span className="text-gold">₹{Number(order.total).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Shipping Address
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-bold text-charcoal">{addr.name || order.user?.businessName || order.user?.name}</p>
                {addr.line1 && <p>{addr.line1}</p>}
                {addr.line2 && <p>{addr.line2}</p>}
                {addr.city && <p>{addr.city}, {addr.state}</p>}
                {addr.pincode && <p className="font-bold">PIN: {addr.pincode}</p>}
                {addr.phone && <p className="mt-2">📞 {addr.phone}</p>}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-charcoal mb-4">Payment Details</h3>
              <div className="text-sm text-gray-600 space-y-3">
                <div>
                  <p className="font-bold text-charcoal text-xs uppercase tracking-wider text-gray-400 mb-1">Payment Method</p>
                  <p className="font-medium">{order.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-bold text-charcoal text-xs uppercase tracking-wider text-gray-400 mb-1">Payment Status</p>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.paymentId && (
                  <div>
                    <p className="font-bold text-charcoal text-xs uppercase tracking-wider text-gray-400 mb-1">Reference ID</p>
                    <p className="font-mono text-xs bg-gray-50 p-2 rounded border border-gray-100 break-all">{order.paymentId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status History */}
          {order.statusHistory?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <h3 className="font-bold text-charcoal">Status History</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {order.statusHistory.map((h: any) => (
                  <div key={h.id} className="px-6 py-3 flex items-start gap-4">
                    <span className={`mt-0.5 px-2 py-0.5 rounded text-xs font-bold shrink-0 ${STATUS_COLORS[h.status] || 'bg-gray-100 text-gray-700'}`}>
                      {h.status}
                    </span>
                    <div className="flex-1">
                      {h.note && <p className="text-sm text-gray-600">{h.note}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(h.createdAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Status Updater */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-charcoal mb-5 border-b pb-4">Update Order Status</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="status">New Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {showTracking && (
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> Tracking Info
                  </p>
                  <div className="space-y-1.5">
                    <Label htmlFor="courier">Courier Name</Label>
                    <Input
                      id="courier"
                      placeholder="e.g. BlueDart, DTDC, FedEx"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="trackingNo">Tracking Number</Label>
                    <Input
                      id="trackingNo"
                      placeholder="e.g. BD123456789"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="trackingUrl">Tracking URL</Label>
                    <Input
                      id="trackingUrl"
                      placeholder="https://track.bluedart.com/..."
                      value={trackingUrl}
                      onChange={(e) => setTrackingUrl(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="note">Internal Note (optional)</Label>
                <textarea
                  id="note"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Called customer, awaiting payment..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gold resize-none"
                />
              </div>

              <Button 
                onClick={handleUpdate} 
                disabled={saving || status === order.status}
                className="w-full bg-charcoal hover:bg-black text-white"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Save & Notify Customer</>
                )}
              </Button>

              <p className="text-xs text-gray-400 leading-relaxed text-center">
                Customer will receive an email notification when status changes.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
