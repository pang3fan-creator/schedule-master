import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"
import Link from "next/link"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"

export function Navbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-6">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
        <Database className="size-6 text-blue-600" />
        <span className="text-lg font-semibold text-gray-900">Schedule Builder</span>
      </Link>

      {/* Center: Navigation Links */}
      <nav className="flex items-center gap-8">
        <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          Product
        </a>
        <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          Pricing
        </a>
        <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          Blog
        </a>
      </nav>

      {/* Right: Auth Buttons */}
      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="ghost" className="text-gray-700">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
          </SignUpButton>
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
  )
}
