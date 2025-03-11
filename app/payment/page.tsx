"use client"

import type React from "react"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import PaymentForm from "./payment-form"
import { useToast } from "@/hooks/use-toast"
import { recordParticipant } from "@/lib/actions"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const name = formData.get("name") as string
    const phone = formData.get("phone") as string

    if (!name || !phone) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    if (!phoneRegex.test(phone)) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 2500, name, phone }),
      })
      const data = await response.json()

      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
        await recordParticipant(name, phone, "stripe", "pending")
      } else {
        throw new Error(data.error || "Failed to initialize payment")
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Payment</CardTitle>
          <CardDescription>Lock in your spot for Ramadan Runs 2025</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!clientSecret ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" required />
              </div>

              <Button type="submit" className="w-full mt-4">
                Proceed to Payment
              </Button>
            </form>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm />
            </Elements>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

