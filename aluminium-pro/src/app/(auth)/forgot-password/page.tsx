"use client"

import { useState } from "react"
import Link from "next/link"
import { Hexagon, Mail } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await axios.post("/api/auth/forgot-password", { email })
      if (res.data.success) {
        setSuccess(true)
        toast.success(res.data.message)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send reset link")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-lightbg items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="flex justify-center mb-6">
          <Hexagon className="w-12 h-12 text-gold" fill="currentColor" />
        </div>
        
        <h2 className="text-2xl font-heading font-bold text-charcoal mb-2">
          Forgot Password
        </h2>
        
        {success ? (
          <div className="space-y-6 mt-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600">
              Check your email. If an account exists with {email}, we've sent a link to reset your password.
            </p>
            <Link href="/login" className="block text-gold hover:underline font-medium">
              Back to log in
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-8 text-sm">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full h-12" disabled={loading}>
                {loading ? "Sending link..." : "Send reset link"}
              </Button>
            </form>
            
            <p className="mt-8 text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/login" className="font-semibold text-gold hover:underline">
                Log in here
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
