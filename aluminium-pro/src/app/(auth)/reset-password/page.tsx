"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Hexagon, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const token = searchParams?.get("token")
  const email = searchParams?.get("email")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setLoading(true)
    
    try {
      const res = await axios.post("/api/auth/reset-password", { 
        email, 
        token, 
        newPassword 
      })
      
      if (res.data.success) {
        setSuccess(true)
        toast.success(res.data.message)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  if (!token || !email) {
    return (
      <div className="flex min-h-screen bg-lightbg items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-4">This password reset link is invalid or missing required parameters.</p>
          <Link href="/forgot-password">
            <Button>Request New Link</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-lightbg items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="flex justify-center mb-6">
          <Hexagon className="w-12 h-12 text-gold" fill="currentColor" />
        </div>
        
        <h2 className="text-2xl font-heading font-bold text-charcoal mb-2">
          Create New Password
        </h2>
        
        {success ? (
          <div className="space-y-6 mt-6 text-center">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <p className="text-gray-600">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <Button onClick={() => router.push('/login')} className="w-full">
              Go to Login
            </Button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-8 text-sm">
              Please enter your new password below.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full h-12" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
