import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import AccountSidebar from "@/components/account/AccountSidebar"

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Middleware should catch this, but double checking here for safety
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="bg-lightbg min-h-screen py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl lg:text-4xl font-heading font-extrabold text-charcoal mb-8">
          My Account
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar />
          
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
