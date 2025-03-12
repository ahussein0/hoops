"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import PaymentForm from "./payment-form"
import StripeProvider from "./stripe-provider"
import { useToast } from "@/hooks/use-toast"
import { recordParticipant } from "@/lib/actions"

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState("")
  const [amount, setAmount] = useState(2500) // Default amount in cents ($25.00)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    
    try {
      const form = event.currentTarget
      const formData = new FormData(form)
      const name = formData.get("name") as string
      const phone = formData.get("phone") as string
      const amountInput = formData.get("amount") as string
      
      // Convert amount to cents (e.g., $25.00 -> 2500)
      const amountInCents = Math.round(parseFloat(amountInput) * 100)
      
      if (!name || !phone || !amountInput || isNaN(amountInCents) || amountInCents <= 0) {
        toast({
          title: "Error",
          description: "Please fill in all fields with valid values.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Ensure minimum amount is at least $5.00 (500 cents)
      if (amountInCents < 500) {
        toast({
          title: "Error",
          description: "Minimum payment amount is $5.00.",
          variant: "destructive",
        })
        setIsLoading(false)
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
        setIsLoading(false)
        return
      }

      // Store the amount for the payment form
      setAmount(amountInCents)

      console.log(`Creating payment intent for $${(amountInCents/100).toFixed(2)}...`);
      
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInCents, name, phone }),
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.details || "Failed to initialize payment");
      }
      
      const data = await response.json()

      if (data.clientSecret) {
        console.log("Client secret received, initializing payment form...");
        setClientSecret(data.clientSecret)
        await recordParticipant(name, phone, "stripe", "pending")
      } else {
        throw new Error(data.error || "Failed to initialize payment")
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Format amount for display in the input field
  const formattedAmount = (amount / 100).toFixed(2)

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

              <div className="space-y-3 mt-4">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" required />
              </div>

              <div className="space-y-3 mt-4">
                <Label htmlFor="amount">Amount ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input 
                    id="amount" 
                    name="amount" 
                    type="number" 
                    min="5.00" 
                    step="0.01" 
                    defaultValue="25.00"
                    className="pl-7" 
                    required 
                  />
                </div>
                <p className="text-sm text-gray-500">Enter the amount you'd like to pay (minimum $5.00)</p>
              </div>

              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </form>
          ) : (
            <StripeProvider clientSecret={clientSecret}>
              <PaymentForm amount={amount} />
            </StripeProvider>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

