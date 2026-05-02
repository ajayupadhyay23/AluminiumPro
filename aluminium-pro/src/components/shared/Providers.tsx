"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#2B2B2B',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#D4A853',
              secondary: '#2B2B2B',
            },
          },
        }}
      />
    </SessionProvider>
  )
}
