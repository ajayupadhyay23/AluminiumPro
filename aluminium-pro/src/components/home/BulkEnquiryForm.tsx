"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"
import toast from "react-hot-toast"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit mobile number required"),
  email: z.string().email("Valid email required"),
  category: z.string().min(1, "Please select a category"),
  message: z.string().min(10, "Please provide more details about your requirement"),
})

type FormData = z.infer<typeof formSchema>

export default function BulkEnquiryForm() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await axios.post("/api/enquiries", {
        ...data,
        type: "BULK_QUOTE"
      })
      if (res.data.success) {
        toast.success(res.data.message)
        reset()
      }
    } catch (error) {
      toast.error("Failed to submit enquiry. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-charcoal text-white relative py-20">
      <div className="absolute inset-0 bg-aluminium-texture opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Text */}
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 text-gold text-sm font-bold tracking-wide uppercase">
              B2B Sales
            </div>
            <h2 className="text-4xl lg:text-5xl font-heading font-extrabold leading-tight">
              Need a Bulk Quote?<br />
              <span className="text-gold">We'll Respond in 2 Hours.</span>
            </h2>
            <p className="text-lg text-silver leading-relaxed">
              Whether you're working on a massive commercial glazing project or need continuous supply for your fabrication unit, we offer unbeatable wholesale pricing.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-lg">
                <CheckCircle2 className="w-6 h-6 text-gold" />
                <span>Dedicated account manager</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <CheckCircle2 className="w-6 h-6 text-gold" />
                <span>Custom dies and extrusions available</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <CheckCircle2 className="w-6 h-6 text-gold" />
                <span>Priority pan-India dispatch</span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <CheckCircle2 className="w-6 h-6 text-gold" />
                <span>Flexible payment terms for regular buyers</span>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl text-charcoal relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-[100px] -z-10" />
              
              <h3 className="text-2xl font-heading font-bold mb-6">Request Wholesale Pricing</h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" {...register("name")} placeholder="Your name" />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (+91) *</Label>
                    <Input id="phone" {...register("phone")} placeholder="9876543210" maxLength={10} />
                    {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="you@company.com" />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Product Category *</Label>
                    <select 
                      id="category"
                      {...register("category")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select a category</option>
                      <option value="Sheets">Sheets</option>
                      <option value="Material">Material</option>
                      <option value="Grills">Grills</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Mixed/Other">Mixed / Other</option>
                    </select>
                    {errors.category && <span className="text-red-500 text-sm">{errors.category.message}</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Requirement (Approx. quantity & specs) *</Label>
                  <textarea 
                    id="message"
                    {...register("message")}
                    placeholder="E.g., Looking for 500kg of 6063 T6 Sliding Window profiles in wooden finish..."
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  {errors.message && <span className="text-red-500 text-sm">{errors.message.message}</span>}
                </div>

                <Button type="submit" className="w-full h-14 text-lg" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Enquiry"}
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
