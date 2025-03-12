"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PaymentConfirmationPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"success" | "processing" | "failed" | "unknown">("unknown")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for payment_intent and payment_intent_client_secret in URL
    const paymentIntent = searchParams.get("payment_intent")
    const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret")
    
    if (paymentIntent && paymentIntentClientSecret) {
      // If we have both, we can check the status
      const checkStatus = async () => {
        try {
          // We can check the status from Stripe directly
          const response = await fetch(`/api/check-payment-status?payment_intent=${paymentIntent}`)
          
          if (response.ok) {
            const data = await response.json()
            
            if (data.status === "succeeded") {
              setStatus("success")
            } else if (data.status === "processing") {
              setStatus("processing")
            } else {
              setStatus("failed")
            }
          } else {
            setStatus("unknown")
          }
        } catch (error) {
          console.error("Error checking payment status:", error)
          setStatus("unknown")
        } finally {
          setIsLoading(false)
        }
      }
      
      checkStatus()
    } else {
      // If we don't have payment_intent in URL, assume success
      // This is a fallback for when the redirect happens correctly
      setStatus("success")
      setIsLoading(false)
    }
  }, [searchParams])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Payment {getStatusText(status)}</CardTitle>
          <CardDescription>
            {isLoading ? "Checking payment status..." : getStatusDescription(status)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="flex justify-center py-6">
            {isLoading ? (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            ) : (
              getStatusIcon(status)
            )}
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">
              {getStatusMessage(status)}
            </p>
            
            <div className="pt-4">
              <Link href="/" passHref>
                <Button className="w-full">Return to Home</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

function getStatusText(status: string): string {
  switch (status) {
    case "success":
      return "Successful"
    case "processing":
      return "Processing"
    case "failed":
      return "Failed"
    default:
      return "Confirmation"
  }
}

function getStatusDescription(status: string): string {
  switch (status) {
    case "success":
      return "Your payment has been successfully processed"
    case "processing":
      return "Your payment is being processed"
    case "failed":
      return "There was an issue with your payment"
    default:
      return "We're checking the status of your payment"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "success":
      return <CheckCircle className="h-16 w-16 text-green-500" />
    case "processing":
      return <Clock className="h-16 w-16 text-yellow-500" />
    case "failed":
      return <XCircle className="h-16 w-16 text-red-500" />
    default:
      return <Clock className="h-16 w-16 text-blue-500" />
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case "success":
      return "Thank you for your payment! Your spot for Ramadan Runs 2025 has been secured."
    case "processing":
      return "Your payment is being processed. We'll update you once it's complete."
    case "failed":
      return "We couldn't process your payment. Please try again or contact support."
    default:
      return "We're checking the status of your payment. Please wait a moment."
  }
}

