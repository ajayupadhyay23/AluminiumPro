"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Search, ShoppingCart, Heart, User, Menu, X, Hexagon, ChevronDown, Package, LayoutGrid, Wrench, Box } from "lucide-react"
import { cn } from "@/lib/utils"
import SearchOverlay from "./SearchOverlay"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"

const CATEGORIES = [
  { name: "Sheets", href: "/category/sheets", icon: Package },
  { name: "Material", href: "/category/material", icon: LayoutGrid },
  { name: "Grills", href: "/category/grills", icon: Box },
  { name: "Accessories", href: "/category/accessories", icon: Wrench },
]

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const getTotalItems = useCartStore(state => state.getTotalItems)
  const cartItemCount = getTotalItems()
  
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

  // Wait until mounted to show correct auth state (prevent hydration mismatch)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const isActive = (path: string) => pathname === path

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300 border-b",
          isScrolled 
            ? "bg-white/90 backdrop-blur-md shadow-sm border-gray-200 h-[60px] lg:h-[72px]" 
            : "bg-white border-transparent h-[60px] lg:h-[80px]"
        )}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Hexagon className="w-8 h-8 text-gold group-hover:scale-110 transition-transform" fill="currentColor" />
              <div>
                <span className="text-xl lg:text-2xl font-heading font-bold text-charcoal tracking-tight">AluminiumPro</span>
                <p className="text-[10px] lg:text-xs text-silver font-medium tracking-widest uppercase">Khalilabad, UP</p>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className={cn("text-sm font-semibold transition-colors hover:text-gold", isActive("/") ? "text-gold underline underline-offset-4" : "text-charcoal")}>
              Home
            </Link>
            
            <div 
              className="relative group h-full flex items-center"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <button className={cn("flex items-center gap-1 text-sm font-semibold transition-colors hover:text-gold", pathname.startsWith("/category") ? "text-gold underline underline-offset-4" : "text-charcoal")}>
                Categories <ChevronDown className="w-4 h-4" />
              </button>
              
              {/* Dropdown */}
              <div className={cn("absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white border border-gray-100 shadow-xl rounded-xl p-6 transition-all duration-200 grid grid-cols-2 gap-4", isCategoriesOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2")}>
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <Link key={cat.href} href={cat.href} className="flex items-start gap-4 p-4 rounded-lg hover:bg-lightbg transition-colors group/item">
                      <div className="bg-gold/10 p-2 rounded text-gold group-hover/item:bg-gold group-hover/item:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-charcoal group-hover/item:text-gold transition-colors">{cat.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">Explore profiles</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            <Link href="/about" className={cn("text-sm font-semibold transition-colors hover:text-gold", isActive("/about") ? "text-gold underline underline-offset-4" : "text-charcoal")}>
              About
            </Link>
            <Link href="/contact" className={cn("text-sm font-semibold transition-colors hover:text-gold", isActive("/contact") ? "text-gold underline underline-offset-4" : "text-charcoal")}>
              Contact
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button onClick={() => setIsSearchOpen(true)} className="text-charcoal hover:text-gold transition-colors">
              <Search className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
            <Link href="/account/wishlist" className="text-charcoal hover:text-gold transition-colors relative hidden sm:block">
              <Heart className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
            <Link href="/cart" className="text-charcoal hover:text-gold transition-colors relative">
              <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <div className="hidden lg:block">
              {mounted ? (
                session ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-full px-4 py-1.5 transition-all duration-200">
                      <div className="w-7 h-7 rounded-full bg-gold text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                      </div>
                      <span className="text-sm font-semibold text-charcoal">
                        Welcome, <span className="text-gold">{session.user.name?.split(" ")[0]}!</span>
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-charcoal/60" />
                    </button>

                    {/* Dropdown */}
                    <div className="absolute top-full right-0 w-52 bg-white border border-gray-100 shadow-xl rounded-xl py-2 mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right scale-95 group-hover:scale-100">
                      <div className="px-4 py-3 border-b border-gray-100 mb-1">
                        <p className="text-sm font-bold text-charcoal truncate">{session.user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                      </div>
                      <Link href="/account/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-charcoal hover:bg-lightbg hover:text-gold transition-colors">
                        <User className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link href="/account/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-charcoal hover:bg-lightbg hover:text-gold transition-colors">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white font-bold">
                      Login / Register
                    </Button>
                  </Link>
                )
              ) : (
                <div className="w-40 h-9 bg-gray-100 animate-pulse rounded-full" />
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden text-charcoal" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="p-4 flex items-center justify-between border-b">
            <Link href="/" className="flex items-center gap-2 text-gold">
              <Hexagon className="w-8 h-8" fill="currentColor" />
              <span className="text-xl font-heading font-bold text-charcoal">AluminiumPro</span>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-8 h-8 text-charcoal" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            <Link href="/" className="text-2xl font-heading font-bold text-charcoal">Home</Link>
            
            <div className="space-y-4">
              <p className="text-sm font-bold text-silver uppercase tracking-widest">Categories</p>
              <div className="flex flex-col gap-4 pl-4 border-l-2 border-gold/30">
                {CATEGORIES.map((cat) => (
                  <Link key={cat.href} href={cat.href} className="text-lg font-medium text-gray-600">{cat.name}</Link>
                ))}
              </div>
            </div>

            <Link href="/about" className="text-2xl font-heading font-bold text-charcoal">About</Link>
            <Link href="/contact" className="text-2xl font-heading font-bold text-charcoal">Contact</Link>
          </div>

          <div className="p-6 border-t bg-lightbg">
            {mounted && session ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gold text-white flex items-center justify-center text-lg font-bold">
                    {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Welcome!</p>
                    <p className="font-bold text-charcoal">{session.user.name}</p>
                    <p className="text-sm text-gray-400">{session.user.email}</p>
                  </div>
                </div>
                <Link href="/account/dashboard" className="block w-full text-center bg-gold text-charcoal font-bold py-3 rounded-md">
                  My Dashboard
                </Link>
                <Link href="/products" className="block w-full text-center bg-charcoal text-white font-bold py-3 rounded-md">
                  Shop Now
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full text-center bg-transparent border border-gray-300 text-charcoal font-bold py-3 rounded-md">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/login" className="block w-full text-center bg-gold text-charcoal font-bold py-4 rounded-md text-lg">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
