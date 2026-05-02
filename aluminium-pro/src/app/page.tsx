"use client"

import { useState } from "react"
import HeroSection from "@/components/home/HeroSection"
import StatsStrip from "@/components/home/StatsStrip"
import CategoryGrid from "@/components/home/CategoryGrid"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import WhyUs from "@/components/home/WhyUs"
import BulkEnquiryForm from "@/components/home/BulkEnquiryForm"
import Testimonials from "@/components/home/Testimonials"

export default function Home() {
  const [selectedFinish, setSelectedFinish] = useState("colour")

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection 
        selectedFinish={selectedFinish} 
        setSelectedFinish={setSelectedFinish} 
      />
      
      <StatsStrip />
      
      <CategoryGrid />
      
      <FeaturedProducts 
        selectedFinish={selectedFinish} 
      />
      
      <WhyUs />
      
      <BulkEnquiryForm />
      
      <Testimonials />
    </div>
  )
}
