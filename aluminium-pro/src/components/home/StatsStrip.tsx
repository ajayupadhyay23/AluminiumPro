"use client"

import { useEffect, useState, useRef } from "react"
import { PackageSearch, Truck, Map, ShieldCheck } from "lucide-react"

export default function StatsStrip() {
  const [isVisible, setIsVisible] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (stripRef.current) {
      observer.observe(stripRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const stats = [
    { label: "Products", target: 1000, suffix: "+", icon: PackageSearch },
    { label: "Orders Delivered", target: 50000, suffix: "+", icon: Truck },
    { label: "Cities Served", target: 200, suffix: "+", icon: Map },
    { label: "Years of Trust", target: 10, suffix: "+", icon: ShieldCheck },
  ]

  return (
    <div ref={stripRef} className="w-full bg-gold py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center justify-center text-charcoal text-center ${
                idx !== stats.length - 1 ? 'lg:border-r border-charcoal/20' : ''
              }`}
            >
              <stat.icon className="w-8 h-8 lg:w-10 lg:h-10 mb-4 opacity-80" />
              <div className="flex items-baseline gap-1">
                <Counter target={stat.target} isVisible={isVisible} />
                <span className="text-3xl lg:text-5xl font-heading font-extrabold">{stat.suffix}</span>
              </div>
              <p className="font-semibold tracking-wide uppercase text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Counter({ target, isVisible }: { target: number, isVisible: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let start = 0
    // Adjust duration based on target size
    const duration = 2000 
    const incrementTime = 20
    const steps = duration / incrementTime
    const incrementAmount = target / steps

    const timer = setInterval(() => {
      start += incrementAmount
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.ceil(start))
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [target, isVisible])

  return (
    <span className="text-4xl lg:text-5xl font-heading font-extrabold tabular-nums">
      {count.toLocaleString()}
    </span>
  )
}
