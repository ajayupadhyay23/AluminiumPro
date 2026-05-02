"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { Loader2, PackageSearch, Eye, FileText } from "lucide-react"

export default function OrdersPage() {
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
        console.error("Failed to fetch orders", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'PAID': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PROCESSING': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'SHIPPED': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200'
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-gray-100">
        <h2 className="text-2xl font-heading font-bold text-charcoal">Order History</h2>
        <p className="text-silver mt-1">View and track all your wholesale purchases.</p>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <PackageSearch className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-charcoal mb-2">No Orders Yet</h3>
          <p className="text-silver mb-6 max-w-sm">You haven't placed any wholesale orders yet. Start exploring our premium aluminium profiles.</p>
          <Link href="/products">
            <button className="px-6 py-3 bg-charcoal text-white rounded-md font-bold hover:bg-black transition-colors">
              Browse Catalogue
            </button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6 sm:pl-8">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4 pr-6 sm:pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-charcoal font-medium">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6 sm:pl-8">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {order._count.items}
                  </td>
                  <td className="p-4 font-bold">
                    ₹{order.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 pr-6 sm:pr-8 text-right flex items-center justify-end gap-2">
                    {/* Invoice Button placeholder - will implement real PDF generation later if requested */}
                    <button 
                      className="p-2 text-gray-400 hover:text-gold hover:bg-gold/10 rounded transition-colors"
                      title="Download Invoice"
                      disabled={order.status === 'PENDING' || order.status === 'CANCELLED'}
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                    
                    <Link href={`/account/orders/${order.id}`}>
                      <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-sm hover:border-gold hover:text-gold transition-colors">
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
