"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Loader2, Plus, Trash2, Tag, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface Coupon {
  id: string
  code: string
  type: 'PERCENTAGE' | 'FLAT'
  value: number
  minOrder: number
  maxUses: number | null
  usedCount: number
  isActive: boolean
  expiresAt: string | null
  createdAt: string
}

const emptyForm = {
  code: '', type: 'PERCENTAGE' as 'PERCENTAGE' | 'FLAT',
  value: '', minOrder: '', maxUses: '', expiresAt: '', isActive: true,
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/admin/coupons')
      if (res.data.success) setCoupons(res.data.coupons)
    } catch {
      toast.error('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCoupons() }, [])

  const openCreate = () => {
    setEditId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (c: Coupon) => {
    setEditId(c.id)
    setForm({
      code: c.code,
      type: c.type,
      value: String(c.value),
      minOrder: String(c.minOrder),
      maxUses: c.maxUses ? String(c.maxUses) : '',
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '',
      isActive: c.isActive,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editId) {
        await axios.patch(`/api/admin/coupons/${editId}`, form)
        toast.success('Coupon updated')
      } else {
        await axios.post('/api/admin/coupons', form)
        toast.success('Coupon created')
      }
      setShowModal(false)
      fetchCoupons()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save coupon')
    } finally {
      setSubmitting(false)
    }
  }

  const deleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"? This cannot be undone.`)) return
    try {
      await axios.delete(`/api/admin/coupons/${id}`)
      toast.success('Coupon deleted')
      fetchCoupons()
    } catch {
      toast.error('Failed to delete coupon')
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await axios.patch(`/api/admin/coupons/${id}`, { isActive: !isActive })
      toast.success(`Coupon ${isActive ? 'deactivated' : 'activated'}`)
      fetchCoupons()
    } catch {
      toast.error('Failed to update coupon')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-charcoal">Coupons</h1>
          <p className="text-gray-500">Create and manage discount codes for your customers.</p>
        </div>
        <Button onClick={openCreate} className="bg-gold text-charcoal hover:bg-charcoal hover:text-white shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Create Coupon
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-charcoal" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-16 text-center">
            <Tag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No coupons yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first discount code to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="p-4 pl-6">Code</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Value</th>
                  <th className="p-4">Min Order</th>
                  <th className="p-4">Usage</th>
                  <th className="p-4">Expires</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-charcoal">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 pl-6">
                      <span className="font-mono font-extrabold text-charcoal tracking-wider bg-gray-100 px-2 py-1 rounded">
                        {c.code}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${c.type === 'PERCENTAGE' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {c.type === 'PERCENTAGE' ? '%' : '₹'} {c.type}
                      </span>
                    </td>
                    <td className="p-4 font-bold">
                      {c.type === 'PERCENTAGE' ? `${c.value}%` : `₹${c.value}`}
                    </td>
                    <td className="p-4 text-gray-500">
                      {c.minOrder > 0 ? `₹${c.minOrder.toLocaleString('en-IN')}` : <span className="text-gray-300">None</span>}
                    </td>
                    <td className="p-4 text-gray-500">
                      {c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ''} uses
                    </td>
                    <td className="p-4 text-gray-500">
                      {c.expiresAt
                        ? new Date(c.expiresAt) < new Date()
                          ? <span className="text-red-500 font-bold">Expired</span>
                          : new Date(c.expiresAt).toLocaleDateString('en-IN')
                        : <span className="text-gray-300">Never</span>
                      }
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleActive(c.id, c.isActive)}
                        className={`px-2 py-1 rounded text-xs font-bold transition-colors ${c.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                      >
                        {c.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCoupon(c.id, c.code)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-charcoal">
                {editId ? 'Edit Coupon' : 'Create Coupon'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-charcoal mb-1">Coupon Code *</label>
                <Input
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. BULK20"
                  className="font-mono tracking-widest"
                  required
                  disabled={!!editId}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-charcoal mb-1">Type *</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-gold"
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}
                    required
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-charcoal mb-1">
                    Value * {form.type === 'PERCENTAGE' ? '(%)' : '(₹)'}
                  </label>
                  <Input
                    type="number"
                    value={form.value}
                    onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                    placeholder={form.type === 'PERCENTAGE' ? '0–100' : 'Amount'}
                    min={1}
                    max={form.type === 'PERCENTAGE' ? 100 : undefined}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-charcoal mb-1">Min Order (₹)</label>
                  <Input
                    type="number"
                    value={form.minOrder}
                    onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))}
                    placeholder="0 = no minimum"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-charcoal mb-1">Max Uses</label>
                  <Input
                    type="number"
                    value={form.maxUses}
                    onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))}
                    placeholder="Leave blank = unlimited"
                    min={1}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-charcoal mb-1">Expiry Date</label>
                <Input
                  type="date"
                  value={form.expiresAt}
                  onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-gold"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-charcoal">Active (immediately usable)</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-gold text-charcoal rounded-lg text-sm font-extrabold hover:bg-charcoal hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editId ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
