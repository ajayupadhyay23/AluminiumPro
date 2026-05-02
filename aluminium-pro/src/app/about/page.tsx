"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Package, 
  ArrowRight, 
  Quote
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold font-semibold text-sm mb-6">
            <Building2 className="w-4 h-4" />
            <span>Welcome to Aluminium House</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Crafting Quality, <br className="hidden md:block" />
            <span className="text-gold">Building Trust.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
            We are a premier supplier of high-grade aluminium products, sliding systems, and premium hardware fittings. 
            Proudly based in Khalilabad, delivering excellence across India.
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
            <MapPin className="w-5 h-5 text-gold" />
            <span>Khalilabad, Sant Kabir Nagar, UP</span>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <motion.div 
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
        >
          {[
            { label: "Products", value: "500+", icon: <Package className="w-6 h-6" /> },
            { label: "Happy Customers", value: "200+", icon: <Users className="w-6 h-6" /> },
            { label: "Years Experience", value: "5+", icon: <TrendingUp className="w-6 h-6" /> },
            { label: "Quality Check", value: "100%", icon: <ShieldCheck className="w-6 h-6" /> },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              variants={fadeIn}
              className="bg-white rounded-3xl p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-12 h-12 mx-auto bg-gold/10 text-gold rounded-2xl flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* What We Do */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-4">What We Do</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Providing a comprehensive range of structural and architectural aluminium solutions.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Sliding Systems",
              desc: "Premium 2-track, 3-track, and single track sliding systems designed for smooth operation and durability.",
              icon: <ArrowRight className="w-6 h-6" />
            },
            {
              title: "Hardware & Fittings",
              desc: "High-quality rollers, bearing systems, glass fittings, door hardware, and glazing accessories.",
              icon: <Wrench className="w-6 h-6" />
            },
            {
              title: "Accessories",
              desc: "Complete range of rubber gaskets, wool piles, track covers, and premium finishing touches.",
              icon: <Package className="w-6 h-6" />
            }
          ].map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group hover:border-gold/30 hover:shadow-gold/5 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-700 group-hover:bg-gold group-hover:text-white transition-colors duration-300 mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission & Why Choose Us */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                To revolutionize the aluminium hardware industry by providing top-tier, durable, and architecturally beautiful products. We believe in building long-term relationships through unmatched quality and honest pricing.
              </p>
              <h3 className="text-xl font-semibold mb-6 text-gold">Why Choose Us?</h3>
              <ul className="space-y-4">
                {[
                  "Premium Grade Materials",
                  "Competitive Wholesale Pricing",
                  "Fast & Reliable Supply Chain",
                  "Expert Technical Guidance"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Founder Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100"
          >
            <div className="flex flex-col h-full justify-center">
              <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-8">
                <Quote className="w-10 h-10 text-gold" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">A Vision for the Future</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8 italic">
                "We started Aluminium House with a simple goal: to make high-quality structural fittings accessible to fabricators and builders across the region. Our growth into the digital space is just the next step in making your sourcing experience completely seamless."
              </p>
              <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  S
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Shravan Upadhyay</h4>
                  <p className="text-gold font-medium">Founder, Aluminium House</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-gold rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Ready to start your next project?</h2>
            <p className="text-slate-800 text-lg max-w-2xl mx-auto mb-10 font-medium">
              Explore our complete catalogue of premium aluminium systems and accessories, or get in touch for bulk enquiries.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products">
                <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                  Explore Products
                </button>
              </Link>
              <Link href="/contact">
                <button className="w-full sm:w-auto px-8 py-4 bg-white/40 backdrop-blur text-slate-900 font-bold rounded-2xl hover:bg-white/60 transition-colors">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
