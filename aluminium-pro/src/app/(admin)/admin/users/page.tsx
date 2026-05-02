"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { Loader2, Search, UserCheck, UserX, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const ROLE_CONFIG: Record<string, { label: string; cls: string }> = {
  CUSTOMER: { label: 'Customer', cls: 'bg-gray-100 text-gray-700' },
  MANAGER:  { label: 'Manager',  cls: 'bg-blue-100 text-blue-800' },
  ADMIN:    { label: 'Admin',    cls: 'bg-gold/20 text-charcoal font-extrabold' },
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const LIMIT = 25

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT), role: roleFilter })
      if (searchTerm) params.set('search', searchTerm)
      const res = await axios.get(`/api/admin/users?${params}`)
      if (res.data.success) {
        setUsers(res.data.users)
        setTotal(res.data.total)
      }
    } catch (err) {
      console.error("Failed to fetch users", err)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [page, roleFilter, searchTerm])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const toggleActive = async (userId: string, currentlyActive: boolean) => {
    try {
      await axios.patch(`/api/admin/users/${userId}`, { isActive: !currentlyActive })
      toast.success(`User ${currentlyActive ? 'deactivated' : 'activated'}`)
      fetchUsers()
    } catch {
      toast.error("Failed to update user status")
    }
  }

  const changeRole = async (userId: string, newRole: string) => {
    try {
      await axios.patch(`/api/admin/users/${userId}`, { role: newRole })
      toast.success(`Role updated to ${newRole}`)
      fetchUsers()
    } catch {
      toast.error("Failed to update role")
    }
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-charcoal">User Management</h1>
        <p className="text-gray-500">Manage customer accounts, roles, and access.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name, email, or business..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1) }}
              className="pl-10 bg-white"
            />
          </div>
          <select
            className="border border-gray-300 rounded-md text-sm px-3 py-2 bg-white outline-none focus:border-gold"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
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
                  <th className="p-4 pl-6">User</th>
                  <th className="p-4">Business</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Orders</th>
                  <th className="p-4">Verified</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-charcoal">
                {users.length > 0 ? users.map((user) => {
                  const rc = ROLE_CONFIG[user.role] || ROLE_CONFIG.CUSTOMER
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 pl-6">
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        {user.phone && <p className="text-xs text-gray-400">{user.phone}</p>}
                      </td>
                      <td className="p-4 text-gray-600">{user.businessName || <span className="text-gray-300">—</span>}</td>
                      <td className="p-4">
                        <select
                          className={`text-xs font-bold rounded px-2 py-1 border-0 outline-none cursor-pointer ${rc.cls}`}
                          value={user.role}
                          onChange={(e) => changeRole(user.id, e.target.value)}
                        >
                          <option value="CUSTOMER">Customer</option>
                          <option value="MANAGER">Manager</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="p-4 text-gray-500">{user._count?.orders ?? 0}</td>
                      <td className="p-4">
                        {user.emailVerified ? (
                          <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                            <UserCheck className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">Unverified</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => toggleActive(user.id, user.isActive)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold border transition-colors ml-auto ${
                            user.isActive
                              ? 'border-red-200 text-red-600 hover:bg-red-50'
                              : 'border-green-200 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {user.isActive ? <><UserX className="w-3.5 h-3.5" /> Deactivate</> : <><ShieldCheck className="w-3.5 h-3.5" /> Activate</>}
                        </button>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-500">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded text-sm font-medium disabled:opacity-40 hover:border-gold transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded text-sm font-medium disabled:opacity-40 hover:border-gold transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
