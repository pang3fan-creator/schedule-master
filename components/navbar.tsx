"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"
import { AuthModal } from "@/components/auth-modal"

const navLinks = [
  { href: "/", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
]

export function Navbar() {
  const pathname = usePathname()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in")

  const openAuthModal = (mode: "sign-in" | "sign-up") => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-6">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Database className="size-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">Schedule Builder</span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600 pb-0.5"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: Auth Buttons */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <Button
              variant="ghost"
              className="text-gray-700"
              onClick={() => openAuthModal("sign-in")}
            >
              Sign In
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => openAuthModal("sign-up")}
            >
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                },
              }}
            />
          </SignedIn>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultMode={authMode}
      />
    </>
  )
}
