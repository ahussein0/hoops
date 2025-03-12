"use client"

import type React from "react"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"

interface PaymentFormProps {
  amount?: number;
}

export default function PaymentForm({ amount = 2500 }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  // Format amount for display ($25.00)
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100);

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
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center">
        <p className="text-sm text-blue-700 mb-1">Payment Amount</p>
        <p className="text-2xl font-bold text-blue-900">{formattedAmount}</p>
      </div>
      
      <PaymentElement />
      
      <Button type="submit" disabled={isProcessing || !stripe || !elements} className="w-full mt-6">
        {isProcessing ? "Processing..." : `Pay ${formattedAmount}`}
      </Button>
    </form>
  )
}

