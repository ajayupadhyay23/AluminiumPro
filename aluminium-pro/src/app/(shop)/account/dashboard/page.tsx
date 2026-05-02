"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import axios from "axios"
import { Package, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"
import { Loader2 } from "lucide-react"

export default function AccountDashboard() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/user/orders")
        if (res.data.success) {
          setOrders(res.data.orders)
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  const activeOrders = orders.filter(o => o.status === "PENDING" || o.status === "PROCESSING" || o.status === "SHIPPED").length
  const totalOrders = orders.length
  const recentOrder = orders[0]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-charcoal rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-aluminium-texture opacity-20" />
        <div className="relative z-10">
          <h2 className="text-2xl font-heading font-bold mb-2">
            Welcome back, {session?.user?.name || "Partner"}!
          </h2>
          <p className="text-silver">
            Manage your wholesale orders, track shipments, and update your business details.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Shipments</p>
            <p className="text-3xl font-heading font-extrabold text-charcoal">{activeOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Orders</p>
            <p className="text-3xl font-heading font-extrabold text-charcoal">{totalOrders}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Account Status</p>
            <p className="text-xl font-heading font-bold text-charcoal mt-1">Verified</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-heading font-bold text-charcoal">Recent Activity</h3>
          <Link href="/account/orders" className="text-sm font-bold text-gold hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="p-6">
          {recentOrder ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-lightbg rounded-xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-charcoal">Order #{recentOrder.id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{new Date(recentOrder.createdAt).toLocaleDateString()} • {recentOrder._count.items} Items</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="font-bold text-charcoal">₹{recentOrder.totalAmount.toLocaleString()}</p>
                  <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${
                    recentOrder.status === 'DELIVERED' ? 'text-green-600' : 'text-orange-500'
                  }`}>
                    {recentOrder.status}
                  </p>
                </div>
                <Link href={`/account/orders/${recentOrder.id}`}>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-bold text-gray-700 hover:bg-white transition-colors">
                    Details
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No recent orders found.</p>
              <Link href="/products">
                <button className="px-6 py-2 bg-charcoal text-white rounded-md font-bold hover:bg-black transition-colors">
                  Start Shopping
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
