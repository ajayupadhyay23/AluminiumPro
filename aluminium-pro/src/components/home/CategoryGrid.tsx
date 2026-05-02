import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CategoryGrid() {
  const categories = [
    {
      title: "Sheets",
      slug: "sheets",
      count: 450,
      image: "https://picsum.photos/600/800?random=201",
      bgClass: "bg-charcoal"
    },
    {
      title: "Material",
      slug: "material",
      count: 320,
      image: "https://picsum.photos/600/800?random=202",
      bgClass: "bg-silver"
    },
    {
      title: "Grills",
      slug: "grills",
      count: 280,
      image: "https://picsum.photos/600/800?random=203",
      bgClass: "bg-black"
    },
    {
      title: "Accessories",
      slug: "accessories",
      count: 950,
      image: "https://picsum.photos/600/800?random=204",
      bgClass: "bg-gold"
    }
  ]

  return (
    <section className="py-20 bg-lightbg">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-charcoal text-center mb-12">
          Browse by Category
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <Link 
              href={`/category/${cat.slug}`} 
              key={index}
              className="group relative h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 block"
            >
              {/* Background Base */}
              <div className={`absolute inset-0 ${cat.bgClass} opacity-20`} />
              
              {/* Image */}
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent opacity-90" />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-bold rounded-full mb-4 w-fit">
                  {cat.count}+ Products
                </span>
                
                <h3 className="text-2xl font-heading font-bold text-white mb-2 group-hover:text-gold transition-colors">
                  {cat.title}
                </h3>
                
                <div className="flex items-center text-gold font-bold text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  View Catalogue <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Hover Border Accent */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold rounded-2xl transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
