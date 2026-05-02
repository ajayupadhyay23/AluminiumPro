import { Award, Factory, Truck, Globe2 } from "lucide-react"

export default function WhyUs() {
  const features = [
    {
      title: "IS:733 Certified Quality",
      description: "All our profiles meet rigorous Indian standards for pure aluminium alloys.",
      icon: Award
    },
    {
      title: "Factory-Direct Wholesale Pricing",
      description: "Cut out the middleman and get the best margins for your fabrication business.",
      icon: Factory
    },
    {
      title: "48-Hour Dispatch Guarantee",
      description: "We maintain massive inventory to ensure your orders leave our warehouse in 48 hours.",
      icon: Truck
    },
    {
      title: "Pan-India Delivery Network",
      description: "From Kashmir to Kanyakumari, our logistics partners deliver safely and on time.",
      icon: Globe2
    }
  ]

  return (
    <section className="py-20 bg-lightbg border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-charcoal mb-4">
            Why Choose AluminiumPro
          </h2>
          <p className="text-silver max-w-2xl mx-auto">
            We are more than just suppliers; we are partners in your growth. Here is why 50,000+ fabricators choose us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-6 text-gold">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-charcoal mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
