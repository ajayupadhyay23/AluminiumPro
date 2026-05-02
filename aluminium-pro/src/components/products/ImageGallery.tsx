"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ImageGalleryProps {
  images: any[]
  selectedFinish: string
}

export default function ImageGallery({ images, selectedFinish }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // When finish changes, try to find an image matching that finish
  useEffect(() => {
    if (images && images.length > 0) {
      const finishIndex = images.findIndex(img => 
        img.alt?.toLowerCase().includes(selectedFinish.toLowerCase()) ||
        img.url.toLowerCase().includes(selectedFinish.toLowerCase())
      )
      
      if (finishIndex !== -1) {
        setCurrentIndex(finishIndex)
      } else {
        // Fallback to primary image if finish not found
        const primaryIndex = images.findIndex(img => img.isPrimary)
        setCurrentIndex(primaryIndex !== -1 ? primaryIndex : 0)
      }
    }
  }, [selectedFinish, images])

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-lightbg rounded-2xl overflow-hidden border border-gray-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex].url}
            alt={images[currentIndex].alt || "Product image"}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-contain p-4"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === idx ? "border-gold" : "border-transparent hover:border-gold/50"
              }`}
            >
              <img 
                src={img.url} 
                alt={img.alt || "Thumbnail"} 
                className="w-full h-full object-cover bg-lightbg"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
