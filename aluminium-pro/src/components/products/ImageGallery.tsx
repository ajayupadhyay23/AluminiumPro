"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ImageGalleryProps {
  images: any[]
  selectedFinish: string
}

export default function ImageGallery({ images, selectedFinish }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', transformOrigin: '0% 0%', transform: 'scale(1)' })
  const containerRef = useRef<HTMLDivElement>(null)

  // When finish changes, find the image that matches that finish
  useEffect(() => {
    if (images && images.length > 0) {
      const finishIndex = images.findIndex(img =>
        img.finish?.toUpperCase() === selectedFinish?.toUpperCase()
      )

      if (finishIndex !== -1) {
        setCurrentIndex(finishIndex)
      } else {
        const textIndex = images.findIndex(img =>
          img.alt?.toLowerCase().includes(selectedFinish.toLowerCase()) ||
          img.url.toLowerCase().includes(selectedFinish.toLowerCase())
        )
        if (textIndex !== -1) {
          setCurrentIndex(textIndex)
        } else {
          const primaryIndex = images.findIndex(img => img.isPrimary)
          setCurrentIndex(primaryIndex !== -1 ? primaryIndex : 0)
        }
      }
    }
  }, [selectedFinish, images])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    const x = ((e.pageX - left - window.scrollX) / width) * 100
    const y = ((e.pageY - top - window.scrollY) / height) * 100
    
    setZoomStyle({
      display: 'block',
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)'
    })
  }

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', transformOrigin: '50% 50%', transform: 'scale(1)' })
  }

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-square bg-lightbg rounded-2xl overflow-hidden border border-gray-100 cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].alt || "Product image"}
              className="w-full h-full object-contain p-4 transition-transform duration-200 ease-out"
              style={{
                transformOrigin: zoomStyle.transformOrigin,
                transform: zoomStyle.transform
              }}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Zoom Hint Icon */}
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full text-charcoal/50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={`${img.url}-${idx}`}
              onClick={() => setCurrentIndex(idx)}
              onMouseEnter={() => setCurrentIndex(idx)}
              className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                currentIndex === idx 
                  ? "border-gold ring-2 ring-gold/20 scale-95 shadow-inner" 
                  : "border-transparent hover:border-gold/30 hover:scale-105"
              }`}
            >
              <img 
                src={img.url} 
                alt={img.alt || `Thumbnail ${idx + 1}`} 
                className={`w-full h-full object-cover bg-white transition-opacity ${currentIndex === idx ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
              />
              {currentIndex === idx && (
                <div className="absolute inset-0 bg-gold/5" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
