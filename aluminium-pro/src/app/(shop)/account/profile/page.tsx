"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"
import toast from "react-hot-toast"
import { Loader2, UserCircle, Save, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional().refine(val => !val || /^[0-9]{10}$/.test(val), "Must be a 10-digit number"),
  businessName: z.string().optional(),
  gstNumber: z.string().optional().refine(val => !val || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val), "Invalid GST format"),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema)
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/user/profile")
        if (res.data.success) {
          const user = res.data.user
          setUserEmail(user.email)
          reset({
            name: user.name || "",
            phone: user.phone || "",
            businessName: user.businessName || "",
            gstNumber: user.gstNumber || ""
          })
        }
      } catch (error) {
        console.error("Failed to load profile", error)
        toast.error("Failed to load profile details")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [reset])

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true)
    try {
      const res = await axios.put("/api/user/profile", data)
      if (res.data.success) {
        toast.success("Profile updated successfully")
        reset(data) // reset to new pristine state
      } else {
        toast.error(res.data.error || "Update failed")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
          <div className="w-16 h-16 bg-gold/20 text-gold rounded-full flex items-center justify-center">
            <UserCircle className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-charcoal">Account Settings</h2>
            <p className="text-silver mt-1">{userEmail}</p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Personal Details */}
            <div>
              <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-gold" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" {...register("name")} placeholder="Your Name" />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (10-digits)</Label>
                  <Input id="phone" {...register("phone")} placeholder="9876543210" maxLength={10} />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Business Details */}
            <div>
              <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gold" /> Business Information (B2B)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Company / Firm Name</Label>
                  <Input id="businessName" {...register("businessName")} placeholder="M/s Sharma Fabricators" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number (For ITC)</Label>
                  <Input id="gstNumber" {...register("gstNumber")} placeholder="22AAAAA0000A1Z5" className="uppercase" />
                  {errors.gstNumber && <p className="text-sm text-red-500">{errors.gstNumber.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <Button 
                type="submit" 
                disabled={!isDirty || saving}
                className="bg-charcoal hover:bg-black text-white px-8 h-12"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                )}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
