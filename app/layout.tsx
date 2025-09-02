import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CarRental",
  description: "Rent cars effortlessly",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark antialiased">
      <body className="font-sans bg-gray-950 text-gray-100">{children}</body>
    </html>
  )
}
