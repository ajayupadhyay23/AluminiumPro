import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
          <Loader2 className="w-16 h-16 text-gold animate-spin absolute inset-0" />
        </div>
        <p className="text-sm font-bold text-charcoal uppercase tracking-widest animate-pulse">
          Loading AluminiumPro
        </p>
      </div>
    </div>
  )
}
