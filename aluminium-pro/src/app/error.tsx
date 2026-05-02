"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Application Error:", error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-lightbg px-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-xl">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-heading font-extrabold text-charcoal mb-3">
          Something went wrong!
        </h1>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          We apologize for the inconvenience. A critical error occurred while loading this page. Our technical team has been notified.
        </p>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => reset()} 
            className="w-full h-12 bg-charcoal hover:bg-black text-white font-bold flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </Button>
          
          <Link href="/">
            <Button variant="outline" className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
