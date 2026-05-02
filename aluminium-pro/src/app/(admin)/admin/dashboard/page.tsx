"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Loader2, TrendingUp, Users, Package, ShoppingCart, AlertCircle } from "lucide-react"

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/api/admin/analytics")
        if (res.data.success) {
          setData(res.data.data)
        }
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-charcoal" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 flex items-center gap-3">
        <AlertCircle className="w-6 h-6" />
        <span className="font-bold">{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-charcoal">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">High-level metrics for AluminiumPro operations.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-bold text-charcoal mt-1">
                ₹{data.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-400">All time sales (excluding cancelled)</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-bold text-charcoal mt-1">{data.totalOrdersCount}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-orange-500 font-bold">{data.pendingOrdersCount} orders pending fulfillment</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">B2B Customers</p>
              <h3 className="text-2xl font-bold text-charcoal mt-1">{data.totalUsers}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-400">Registered accounts</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Products</p>
              <h3 className="text-2xl font-bold text-charcoal mt-1">{data.totalProducts}</h3>
            </div>
            <div className="p-3 bg-gold/10 text-gold rounded-lg">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-400">Total catalog items</p>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-charcoal">Recent Orders</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-charcoal font-medium">
              {data.recentOrders.length > 0 ? data.recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 pl-6">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="p-4">
                    <p className="font-bold">{order.user?.businessName || order.user?.name || "Unknown"}</p>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded font-bold ${
                      order.status === 'PENDING' || order.status === 'PAID' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6 font-bold">
                    ₹{order.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
