import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Must be a 10-digit mobile number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters"),
  type: z.enum(["GENERAL", "BULK_QUOTE", "CALLBACK"]).default("GENERAL"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = enquirySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors[0].message }, { status: 400 })
    }

    const data = result.data

    await prisma.enquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        message: data.message,
        type: data.type,
        status: "NEW",
      }
    })

    // Optionally: trigger email to admin

    return NextResponse.json({ success: true, message: "Enquiry submitted successfully. We'll contact you soon!" })
  } catch (error) {
    console.error("Enquiry API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
