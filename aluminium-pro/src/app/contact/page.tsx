"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! We will get back to you soon.");
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold font-semibold text-sm mb-6">
            <Mail className="w-4 h-4" />
            <span>Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
            Contact <span className="text-gold">Us</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-8">
            Whether you have a question about our products, need a bulk quote, or require technical support, our team is ready to answer all your questions.
          </p>
        </motion.div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Left Side: Contact Cards */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Address */}
            <motion.div variants={fadeIn} className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex gap-5 group hover:border-gold/30 hover:shadow-gold/5 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full -mr-12 -mt-12 transition-all group-hover:bg-gold/10" />
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-700 group-hover:bg-gold group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900">Visit Us</h3>
                  <span className="text-[10px] font-bold bg-gold text-charcoal px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm animate-pulse">Pinned</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  ALUMINIUM HOUSE,<br />
                  F-19 Industrial Area, Khalilabad,<br />
                  Sant Kabir Nagar, Uttar Pradesh
                </p>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div variants={fadeIn} className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex gap-5 group hover:border-gold/30 hover:shadow-gold/5 transition-all">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-700 group-hover:bg-[#25D366] group-hover:text-white transition-colors shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Call Us</h3>
                <p className="text-slate-600 mb-1">+91 94154 22413</p>
                <p className="text-slate-600 mb-3">+91 94505 57148</p>
                <a href="https://wa.me/919415422413" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#25D366] hover:underline">
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Email & Hours */}
            <motion.div variants={fadeIn} className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center group hover:border-gold/30 transition-all">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Email</h3>
                <a href="mailto:shravanupadhyay54@gmail.com" className="text-xs text-gold hover:underline break-all">shravanupadhyay54@gmail.com</a>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center group hover:border-gold/30 transition-all">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Hours</h3>
                <p className="text-xs text-slate-600">Mon - Sat<br/>9AM - 7PM</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Form & Map */}
          <motion.div 
            className="lg:col-span-3 space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Form */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                Send a Message <ArrowRight className="w-5 h-5 text-gold" />
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name *</label>
                    <input required type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Phone Number *</label>
                    <input required type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Your Message *</label>
                  <textarea required rows={4} placeholder="How can we help you?" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all resize-none"></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Send Message <Send className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="bg-white rounded-3xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden relative bg-slate-100">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.885698717551!2d83.076899!3d26.7686524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399139366df6686f%3A0xe541c9b6e7f1a30c!2sALUMINIUM%20HOUSE%20(UPADHYAY%20ALUMINIUM)!5e0!3m2!1sen!2sin!4v1714811800000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  style={{ border: 0, position: 'absolute', inset: 0 }} 
                  allowFullScreen 
                  aria-hidden="false" 
                  tabIndex={0}
                ></iframe>
              </div>
              <div className="p-4 text-center">
                <a 
                  href="https://maps.app.goo.gl/YPMfAzoeAAaC3QdT9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gold font-bold text-sm hover:underline flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" /> View on Google Maps
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
