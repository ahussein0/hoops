"use client"

import type React from "react"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-confirmation`,
      },
    })

    if (error) {
      toast({
        title: "Payment failed",
        description: error.message || "An error occurred during payment.",
        variant: "destructive",
      })
    }

    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" disabled={isProcessing || !stripe || !elements} className="w-full mt-4">
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  )
}

