import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Double lock: Check session AND role
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - fixed on left */}
      <AdminSidebar />
      
      {/* Main Content Area - offset by sidebar width on large screens */}
      <div className="flex-1 lg:ml-64 w-full">
        {/* Mobile Header fallback */}
        <div className="lg:hidden h-16 bg-charcoal text-white flex items-center px-4 font-heading font-bold sticky top-0 z-30">
          Admin Panel
        </div>
        
        <main className="p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
