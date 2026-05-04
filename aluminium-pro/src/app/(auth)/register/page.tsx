"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Hexagon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  businessName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Must be a 10-digit mobile number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  gstNumber: z.string().optional().refine(val => !val || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val.toUpperCase()), "Invalid GST format"),
  terms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [emailForOtp, setEmailForOtp] = useState("")
  const [otp, setOtp] = useState("")

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const formData = watch()

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/register', data)
      if (res.data.success) {
        if (res.data.requiresOtp) {
          // Production: email OTP sent
          setEmailForOtp(data.email)
          setShowOtp(true)
          toast.success(res.data.message)
        } else {
          // Dev: auto-verified, go straight to login
          toast.success(res.data.message)
          router.push('/login')
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP")
      return
    }
    
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/verify-email', { email: emailForOtp, otp })
      if (res.data.success) {
        toast.success("Email verified successfully!")
        
        // Auto-login after verification
        const loginRes = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        })

        if (!loginRes?.error) {
          const callbackUrl = searchParams?.get("callbackUrl") || "/account/dashboard"
          router.push(callbackUrl)
          router.refresh()
        } else {
          toast.error("Auto-login failed. Please log in manually.")
          router.push('/login')
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-lightbg justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <Hexagon className="w-10 h-10 text-gold" fill="currentColor" />
            <h1 className="text-3xl font-heading font-bold text-charcoal">AluminiumPro</h1>
          </div>
        </div>

        {showOtp ? (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold text-charcoal">Verify your email</h2>
            <p className="text-gray-600">We've sent a 6-digit code to {emailForOtp}</p>
            
            <div className="flex justify-center">
              <Input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="text-center text-3xl letter-spacing-widest h-16 w-48 font-bold"
              />
            </div>
            
            <Button onClick={handleVerifyOtp} className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-bold text-charcoal mb-2">Create Wholesale Account</h2>
              <p className="text-gray-500">Join 50,000+ businesses across India.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input {...register("name")} placeholder="John Doe" />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input {...register("businessName")} placeholder="ABC Traders" />
                </div>

                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" {...register("email")} placeholder="john@company.com" />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Phone (+91) *</Label>
                  <Input {...register("phone")} placeholder="9876543210" maxLength={10} />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Password *</Label>
                  <Input type="password" {...register("password")} placeholder="••••••••" />
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password *</Label>
                  <Input type="password" {...register("confirmPassword")} placeholder="••••••••" />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>GST Number (Optional)</Label>
                  <Input {...register("gstNumber")} placeholder="22AAAAA0000A1Z5" className="uppercase" />
                  {errors.gstNumber && <p className="text-sm text-red-500">{errors.gstNumber.message}</p>}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  {...register("terms")}
                  className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the <a href="#" className="text-gold hover:underline">Terms of Service</a> and Privacy Policy
                </label>
              </div>
              {errors.terms && <p className="text-sm text-red-500 block">{errors.terms.message}</p>}

              <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12"
              onClick={() => signIn("google", { callbackUrl: "/account/dashboard" })}
            >
              Sign up with Google
            </Button>

            <p className="text-center mt-6 text-sm text-gray-600">
              Already have an account?{" "}
              <Link href={`/login${searchParams?.get("callbackUrl") ? `?callbackUrl=${searchParams.get("callbackUrl")}` : ""}`} className="font-semibold text-gold hover:underline">
                Log in here
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
