import Link from "next/link"
import { SearchX, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-lightbg px-4 text-center">
      <div className="relative mb-8">
        <h1 className="text-9xl font-heading font-extrabold text-gray-200">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-charcoal rounded-full flex items-center justify-center shadow-2xl">
            <SearchX className="w-10 h-10 text-gold" />
          </div>
        </div>
      </div>
      
      <h2 className="text-3xl font-heading font-bold text-charcoal mb-4">
        Page Not Found
      </h2>
      
      <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
        The profile or page you are looking for does not exist, has been removed, or is temporarily unavailable. 
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button className="w-full sm:w-auto h-12 px-8 bg-charcoal hover:bg-black text-white font-bold">
            Back to Home
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" className="w-full sm:w-auto h-12 px-8 border-gold text-gold hover:bg-gold hover:text-white font-bold group">
            Browse Catalogue <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
