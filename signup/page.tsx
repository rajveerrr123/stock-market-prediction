"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { TrendingUp, ArrowLeft } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate signup process
    try {
      // In a real app, you would register the user with your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/prediction")
    } catch (err) {
      setError("Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div className="container flex flex-1 flex-col items-center justify-center py-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900">
              <TrendingUp className="h-6 w-6 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-gray-400">Enter your information to get started</p>
          </div>
          <div className="space-y-4">
            {error && <div className="rounded-md bg-red-900/20 p-3 text-sm text-red-500">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="John" required className="bg-gray-900 border-gray-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Doe" required className="bg-gray-900 border-gray-800" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-gray-900 border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required className="bg-gray-900 border-gray-800" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm leading-none">
                  I agree to the{" "}
                  <Link href="#" className="text-emerald-500 hover:text-emerald-400">
                    terms of service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-emerald-500 hover:text-emerald-400">
                    privacy policy
                  </Link>
                </Label>
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-500 hover:text-emerald-400">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </div>
  )
}
