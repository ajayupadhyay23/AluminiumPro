import Link from "next/link"
import { Hexagon, Globe, Camera, Briefcase, Video, MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"
import { BUSINESS_CONFIG } from "@/config/business"

export default function Footer() {
  return (
    <footer className="bg-charcoal text-silver pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 text-gold">
              <Hexagon className="w-8 h-8" fill="currentColor" />
              <span className="text-xl font-heading font-bold text-white tracking-tight">AluminiumPro</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Family-owned since 1999. Trusted by 50,000+ businesses across India for premium quality aluminium profiles and accessories.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-colors">
                <Camera className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-colors">
                <Briefcase className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-charcoal transition-colors">
                <Video className="w-5 h-5" />
              </a>
            </div>
            <div className="pt-2">
              <span className="text-xs text-gray-500 font-mono bg-black/20 px-3 py-1 rounded">GST: {BUSINESS_CONFIG.gstNumber}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-heading font-bold mb-6 text-lg tracking-wide">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="hover:text-gold transition-colors text-sm">Home</Link></li>
              <li><Link href="/acp-sheet-sizes" className="hover:text-gold transition-colors text-sm">ACP Sheet Sizes</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors text-sm">Contact</Link></li>
              <li><Link href="/track-order" className="hover:text-gold transition-colors text-sm">Track Order</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="text-white font-heading font-bold mb-6 text-lg tracking-wide">Categories</h4>
            <ul className="space-y-4">
              <li><Link href="/category/sheets" className="hover:text-gold transition-colors text-sm">Sheets</Link></li>
              <li><Link href="/category/material" className="hover:text-gold transition-colors text-sm">Material</Link></li>
              <li><Link href="/category/grills" className="hover:text-gold transition-colors text-sm">Grills</Link></li>
              <li><Link href="/category/accessories" className="hover:text-gold transition-colors text-sm">Hardware Accessories</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white font-heading font-bold mb-6 text-lg tracking-wide">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span>F-19 Industrial Area,<br />Khalilabad, Sant Kabir Nagar, UP</span>
              </li>
              <li className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gold shrink-0" />
                  <span>+91 {BUSINESS_CONFIG.phone}</span>
                </div>
                <a href={`https://wa.me/91${BUSINESS_CONFIG.phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors px-4 py-2 mt-2 rounded-lg font-bold w-max">
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <span>{BUSINESS_CONFIG.email}</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span>Mon–Sat: 9:00 AM – 7:00 PM IST<br />Sunday: Closed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} AluminiumPro. v2.1.0-Strict
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>

          {/* Payment Logos (Mockup text representation or simple icons) */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 mr-2 uppercase tracking-widest font-semibold">Secure Payments</span>
            <div className="h-8 w-12 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold text-white border border-white/5">UPI</div>
            <div className="h-8 w-12 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold text-white border border-white/5">VISA</div>
            <div className="h-8 w-12 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold text-white border border-white/5">MC</div>
            <div className="h-8 w-12 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold text-white border border-white/5">RZP</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
