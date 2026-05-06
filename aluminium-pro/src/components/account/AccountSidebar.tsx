"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, UserCircle, LogOut, Heart, ShieldCheck } from "lucide-react"
import { signOut, useSession } from "next-auth/react"

export default function AccountSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = [
    { name: "Dashboard", href: "/account/dashboard", icon: LayoutDashboard },
    { name: "Order History", href: "/account/orders", icon: Package },
    { name: "My Wishlist", href: "/account/wishlist", icon: Heart },
    { name: "Profile & Address", href: "/account/profile", icon: UserCircle },
  ]

  return (
    <div className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
        
        {/* Mobile Tab Bar (Horizontal Scroll) */}
        <div className="flex lg:hidden overflow-x-auto divide-x divide-gray-100">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex-1 min-w-[120px] p-4 flex flex-col items-center justify-center gap-2 transition-colors ${
                  isActive ? 'bg-gold/10 text-gold' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-bold whitespace-nowrap">{item.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex flex-col p-4 gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/account/dashboard' && pathname.startsWith(item.href))
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-charcoal text-white font-bold' : 'text-gray-600 hover:bg-gray-50 font-medium'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-gold' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            )
          })}

          {(session?.user?.email === 'aluminiumhouse08@gmail.com' || session?.user?.role === 'ADMIN') && (
            <Link 
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gold/10 text-gold font-bold border border-gold/20 hover:bg-gold/20 transition-all mt-2"
            >
              <ShieldCheck className="w-5 h-5" />
              Order Management
            </Link>
          )}

          <div className="border-t border-gray-100 mt-4 pt-4">
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 font-medium w-full text-left transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
