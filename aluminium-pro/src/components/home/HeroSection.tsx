"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, ArrowRight, CheckCircle2 } from "lucide-react"

interface HeroSectionProps {
  selectedFinish: string
  setSelectedFinish: (finish: string) => void
}

export default function HeroSection({ selectedFinish, setSelectedFinish }: HeroSectionProps) {
  const finishes = [
    { id: "colour", label: "Colour-coated" },
    { id: "silver", label: "Silver Anodized" },
    { id: "wooden", label: "Wooden Grain" },
  ]

  return (
    <section className="relative w-full min-h-[70vh] lg:min-h-[90vh] bg-charcoal bg-aluminium-texture flex flex-col pt-12 overflow-hidden">
      {/* Animated Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-transparent z-0" />
      <div className="absolute inset-0 shimmer-metallic opacity-20 z-0 pointer-events-none" />

      <div className="container mx-auto px-4 flex-1 flex flex-col justify-center relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Left Content */}
          <motion.div 
            className="w-full lg:w-3/5 space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 border border-gold/30 text-gold text-sm font-bold tracking-wide uppercase">
              <span className="text-xl">🏆</span> India's #1 Wholesale Aluminium Supplier
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-extrabold text-white leading-[1.1]">
              India's <span className="relative inline-block">
                Trusted
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-gold" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,10 Q50,20 100,10" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </span><br />
              Aluminium Wholesale<br />
              Supplier
            </h1>

            <p className="text-lg sm:text-xl text-silver max-w-2xl leading-relaxed">
              Premium aluminium profiles in Colour, Silver & Wooden finishes. Bulk pricing, fast dispatch, delivered pan-India from Khalilabad.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href="/products" className="w-full sm:w-auto px-8 py-4 bg-gold text-charcoal rounded-md font-heading font-bold text-lg hover:bg-white transition-colors flex items-center justify-center gap-2 group">
                Shop Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/20 text-white rounded-md font-heading font-bold text-lg hover:border-white transition-colors flex items-center justify-center">
                Get a Bulk Quote
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 pt-4 text-sm font-medium text-silver">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-gold" /> GST Invoice Included</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-gold" /> MOQ from 1 piece</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-gold" /> Shipped in 48 hrs</div>
            </div>
          </motion.div>

          {/* Right Content - Floating Cards */}
          <div className="w-full lg:w-2/5 hidden lg:flex relative h-[500px] items-center justify-center">
            {/* Card 1 - Silver */}
            <motion.div 
              className="absolute top-[10%] right-[20%] w-64 h-80 rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl z-10"
              animate={{ y: [0, -15, 0], rotate: [-2, 0, -2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src="https://picsum.photos/400/600?random=101" alt="Silver Profile" className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <span className="text-white font-bold tracking-wider">Silver Anodized</span>
              </div>
            </motion.div>

            {/* Card 2 - Wooden */}
            <motion.div 
              className="absolute top-[30%] -right-[5%] w-56 h-72 rounded-xl overflow-hidden border-2 border-gold/30 shadow-2xl z-20"
              animate={{ y: [0, 20, 0], rotate: [5, 3, 5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <img src="https://picsum.photos/400/600?random=102" alt="Wooden Profile" className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <span className="text-gold font-bold tracking-wider">Wooden Grain</span>
              </div>
            </motion.div>

            {/* Card 3 - Colour */}
            <motion.div 
              className="absolute bottom-[5%] right-[30%] w-60 h-64 rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl z-30"
              animate={{ y: [0, -10, 0], rotate: [-5, -2, -5] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <img src="https://picsum.photos/400/600?random=103" alt="Colour Profile" className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <span className="text-orange-400 font-bold tracking-wider">Colour-coated</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Finish Selector Tabs at Bottom */}
      <div className="relative z-20 bg-charcoal/50 backdrop-blur-md border-t border-white/10 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            <span className="text-silver font-medium mr-4 whitespace-nowrap hidden sm:block">Explore Finishes:</span>
            {finishes.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFinish(f.id)}
                className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  selectedFinish === f.id
                    ? "bg-gold text-charcoal shadow-[0_0_15px_rgba(212,168,83,0.4)]"
                    : "bg-white/5 text-silver hover:bg-white/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
