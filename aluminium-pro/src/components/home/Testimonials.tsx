"use client"

import { useState, useEffect } from "react"
import { Star, Quote } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sanjay Gupta",
      company: "Gupta Fabrications, Delhi",
      rating: 5,
      text: "We switched to AluminiumPro last year and it's been the best decision. Their colour-coated profiles are flawless and dispatch is always on time."
    },
    {
      name: "Ramesh Patel",
      company: "Patel Interiors, Ahmedabad",
      rating: 5,
      text: "The wooden grain finish is indistinguishable from real wood. My clients love it, and the competitive wholesale pricing gives us great margins."
    },
    {
      name: "Vikram Singh",
      company: "Singh Glass & Aluminium, Mumbai",
      rating: 5,
      text: "Consistency is key in our business. AluminiumPro delivers the exact same shade of silver anodized profiles every single time we order."
    },
    {
      name: "Amit Sharma",
      company: "Sharma Traders, Chandigarh",
      rating: 4,
      text: "Excellent quality and packaging. Even during monsoon, the materials arrive without a single scratch. Highly recommended B2B partner."
    },
    {
      name: "Kiran Reddy",
      company: "Reddy Architects, Hyderabad",
      rating: 5,
      text: "The custom dies they developed for our massive commercial glazing project were precise. Their technical team really knows what they are doing."
    },
    {
      name: "Manoj Kumar",
      company: "Kumar Hardware, Chennai",
      rating: 5,
      text: "Ordering through their platform is so easy. The transparency with stock levels and the automated GST invoices save us hours of paperwork."
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-play
  useEffect(() => {
    if (isHovered) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isHovered, testimonials.length])

  // Mobile shows 1, Desktop shows 3
  const getVisibleTestimonials = () => {
    // Basic logic for sliding window of 3 items
    const visible = []
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length])
    }
    return visible
  }

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-charcoal mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-silver max-w-2xl mx-auto">
            Don't just take our word for it. Read what fabricators and contractors across India have to say about our quality and service.
          </p>
        </div>

        <div 
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Desktop/Tablet View (shows 3 or 2 depending on screen size via CSS) */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">
            {getVisibleTestimonials().map((t, idx) => (
              <div key={idx} className="bg-lightbg p-8 rounded-2xl relative">
                <Quote className="absolute top-6 right-6 w-12 h-12 text-gold/10" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < t.rating ? "text-gold fill-gold" : "text-gray-300"}`} />
                  ))}
                </div>
                <p className="text-charcoal italic mb-6 leading-relaxed relative z-10">"{t.text}"</p>
                <div>
                  <h4 className="font-bold text-charcoal">{t.name}</h4>
                  <p className="text-sm text-silver">{t.company}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View (shows 1) */}
          <div className="md:hidden">
            <div className="bg-lightbg p-8 rounded-2xl relative">
              <Quote className="absolute top-6 right-6 w-12 h-12 text-gold/10" />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? "text-gold fill-gold" : "text-gray-300"}`} />
                ))}
              </div>
              <p className="text-charcoal italic mb-6 leading-relaxed relative z-10">"{testimonials[currentIndex].text}"</p>
              <div>
                <h4 className="font-bold text-charcoal">{testimonials[currentIndex].name}</h4>
                <p className="text-sm text-silver">{testimonials[currentIndex].company}</p>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  idx === currentIndex ? "bg-gold" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
