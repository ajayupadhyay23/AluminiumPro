"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { Loader2, Search, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  PLACED:     { label: 'Placed',     cls: 'bg-blue-100 text-blue-800' },
  CONFIRMED:  { label: 'Confirmed',  cls: 'bg-sky-100 text-sky-800' },
  PROCESSING: { label: 'Processing', cls: 'bg-purple-100 text-purple-800' },
  PACKED:     { label: 'Packed',     cls: 'bg-yellow-100 text-yellow-800' },
  DISPATCHED: { label: 'Dispatched', cls: 'bg-orange-100 text-orange-800' },
  IN_TRANSIT: { label: 'In Transit', cls: 'bg-amber-100 text-amber-800' },
  DELIVERED:  { label: 'Delivered',  cls: 'bg-green-100 text-green-800' },
  CANCELLED:  { label: 'Cancelled',  cls: 'bg-red-100 text-red-800' },
  REFUNDED:   { label: 'Refunded',   cls: 'bg-gray-100 text-gray-600' },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`/api/admin/orders?status=${statusFilter}`)
        if (res.data.success) setOrders(res.data.orders)
      } catch (error) {
        console.error("Failed to fetch admin orders", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [statusFilter])

  const filteredOrders = orders.filter(o =>
    (o.orderNumber || o.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-charcoal">Order Management</h1>
        <p className="text-gray-500">View, process, and update B2B wholesale orders.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by order # or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <select
            className="border border-gray-300 rounded-md text-sm px-3 py-2 bg-white outline-none focus:border-gold"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-charcoal" />
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="p-4 pl-6">Order #</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-charcoal">
                {filteredOrders.length > 0 ? filteredOrders.map((order) => {
                  const sc = STATUS_CONFIG[order.status] || { label: order.status, cls: 'bg-gray-100 text-gray-800' }
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 pl-6 font-mono font-bold text-xs">
                        #{order.orderNumber || order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-4">
                        <p className="font-bold">{order.user?.businessName || order.user?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-500">{order.user?.email || order.guestEmail}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${sc.cls}`}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{order._count?.items ?? '-'}</td>
                      <td className="p-4 font-bold">
                        ₹{Number(order.total).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 bg-white rounded text-sm font-medium hover:border-gold hover:text-gold transition-colors ml-auto">
                            <ExternalLink className="w-4 h-4" /> Manage
                          </button>
                        </Link>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-500">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
