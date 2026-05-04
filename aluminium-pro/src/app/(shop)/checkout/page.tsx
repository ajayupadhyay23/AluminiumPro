"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"
import toast from "react-hot-toast"
import { Loader2, ShieldCheck, CreditCard } from "lucide-react"

import { useCartStore } from "@/store/cartStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Must be a valid 10-digit phone number"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Must be a 6-digit valid pincode"),
  gstNumber: z.string().optional().refine(val => !val || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val.toUpperCase()), "Invalid GST format"),
})

type AddressForm = z.infer<typeof addressSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items, getSubtotal, clearCart } = useCartStore()

  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sameAsShipping, setSameAsShipping] = useState(true)

  const { register, handleSubmit, watch, setValue, clearErrors, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema)
  })

  const pincodeWatch = watch("pincode")

  useEffect(() => {
    if (pincodeWatch?.length === 6) {
      axios.get(`https://api.postalpincode.in/pincode/${pincodeWatch}`)
        .then(res => {
          const data = res.data[0]
          if (data.Status === "Success" && data.PostOffice && data.PostOffice.length > 0) {
            const postOffice = data.PostOffice[0]
            setValue("city", postOffice.District || postOffice.Region || "")
            setValue("state", postOffice.State || "")
            clearErrors(["city", "state"])
          } else {
            toast.error("Invalid pincode or details not found")
          }
        })
        .catch(err => {
          console.error("Failed to fetch pincode details", err)
        })
    }
  }, [pincodeWatch, setValue, clearErrors])

  // Redirect if empty cart or unauthenticated
  useEffect(() => {
    setMounted(true)
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout")
    }
  }, [status, router])

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-gold" />
      </div>
    )
  }

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  const subtotal = getSubtotal()
  const gst = subtotal * 0.18
  const total = subtotal + gst

// Razorpay SDK loader removed

  const processCheckout = async (data: AddressForm) => {
    setLoading(true)
    try {
      const orderRes = await axios.post("/api/checkout", {
        items,
        shippingAddress: {
          name: data.name,
          phone: data.phone,
          street: data.street,
          city: data.city,
          state: data.state,
          pincode: data.pincode
        },
        billingAddress: {
          name: data.name,
          phone: data.phone,
          street: data.street,
          city: data.city,
          state: data.state,
          pincode: data.pincode
        }, // Assuming same as shipping for simplicity
        gstNumber: data.gstNumber
      })

      if (orderRes.data.success) {
        clearCart()
        toast.success("Order Placed Successfully!")
        router.push(`/checkout/success?orderId=${orderRes.data.orderId}`)
      } else {
        toast.error(orderRes.data.error || "Failed to create order")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-lightbg min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl lg:text-4xl font-heading font-extrabold text-charcoal mb-8">
          Secure Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Forms */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-heading font-bold text-charcoal mb-6 border-b pb-4">Shipping Details</h2>
              
              <form id="checkout-form" onSubmit={handleSubmit(processCheckout)} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" {...register("name")} placeholder="John Doe" />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" {...register("phone")} placeholder="9876543210" maxLength={10} />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input id="street" {...register("street")} placeholder="Plot No. 45, Phase 2 Industrial Area..." />
                  {errors.street && <p className="text-sm text-red-500">{errors.street.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" {...register("city")} placeholder="City Name" />
                    {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" {...register("state")} placeholder="Punjab" />
                    {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input id="pincode" {...register("pincode")} placeholder="141003" maxLength={6} />
                    {errors.pincode && <p className="text-sm text-red-500">{errors.pincode.message}</p>}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <Label htmlFor="gstNumber">GST Number (Optional) - For ITC Claim</Label>
                  <Input id="gstNumber" {...register("gstNumber")} placeholder="22AAAAA0000A1Z5" className="uppercase" />
                  {errors.gstNumber && <p className="text-sm text-red-500">{errors.gstNumber.message}</p>}
                </div>

              </form>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-heading font-bold text-charcoal mb-6 border-b pb-4">Order Summary</h2>
              
              <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-bold text-sm text-charcoal line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} {item.unit}</p>
                    </div>
                    <span className="font-bold text-sm text-charcoal">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6 border-t pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal">₹{subtotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-medium text-charcoal">₹{gst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free (Bulk Order)</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-charcoal">Amount to Pay</span>
                  <div className="text-right">
                    <span className="block text-3xl font-heading font-extrabold text-charcoal">
                      ₹{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form"
                disabled={loading}
                className="w-full h-14 text-lg bg-[#0C1A30] hover:bg-black text-white transition-colors flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                Place Order (Pay via UPI)
              </Button>

              <div className="mt-6 flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-gray-500 shrink-0" />
                <p className="text-xs text-gray-500 font-medium">
                  Your payment details are encrypted. We support Netbanking, UPI, Credit and Debit cards.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
