import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { Suspense } from "react"
import { DM_Sans, Space_Grotesk } from "next/font/google"
import { AuthProvider } from "@/context/AuthProvider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "100xContest",
  description: "Developer contests platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased font-sans ${dmSans.variable} ${spaceGrotesk.variable}`}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <SiteHeader />
            <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
          </Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
