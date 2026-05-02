import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { Adapter } from "next-auth/adapters"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || profile.email,
          email: profile.email,
          image: profile.picture,
          role: "CUSTOMER", // default role
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials")
        }

        if (!user.isActive) {
          throw new Error("Account is disabled")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)

        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        // Return user without password
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          businessName: user.businessName,
          emailVerified: user.emailVerified,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.businessName = user.businessName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.businessName = token.businessName as string | null
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false
        
        // Auto-verify email for Google auth
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        })
        
        if (existingUser && !existingUser.emailVerified) {
          await prisma.user.update({
            where: { email: user.email },
            data: { emailVerified: new Date() }
          })
        }
      }
      return true
    }
  },
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },
}
