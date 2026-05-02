"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  PackageSearch, 
  ShoppingCart, 
  Users,
  Tag,
  ChevronLeft,
  LogOut
} from "lucide-react"
import { signOut } from "next-auth/react"

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Overview",  href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products",  href: "/admin/products",  icon: PackageSearch },
    { name: "Orders",    href: "/admin/orders",    icon: ShoppingCart },
    { name: "Users",     href: "/admin/users",     icon: Users },
    { name: "Coupons",   href: "/admin/coupons",   icon: Tag },
  ]

  return (
    <div className="w-64 bg-charcoal min-h-screen text-white flex flex-col shrink-0 border-r border-gray-800 hidden lg:flex fixed left-0 top-0 bottom-0 z-40">
      
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-gray-800">
        <Link href="/" className="font-heading font-extrabold text-2xl text-white tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
            <span className="text-charcoal text-xl font-black">A</span>
          </div>
          Pro <span className="text-gold text-xs font-bold uppercase ml-1 px-1.5 py-0.5 border border-gold rounded">Admin</span>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <p className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Management</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-gold/10 text-gold font-bold border border-gold/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white font-medium'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-gold' : 'text-gray-500'}`} />
              {item.name}
            </Link>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 space-y-1">
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white font-medium w-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500 shrink-0" />
          Back to Store
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 font-medium w-full text-left transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-500/70 shrink-0" />
          Sign Out
        </button>
      </div>

    </div>
  )
}
