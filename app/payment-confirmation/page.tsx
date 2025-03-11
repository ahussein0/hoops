"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { processPayment } from "@/lib/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PaymentConfirmationPage() {
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
  const searchParams = useSearchParams()

  useEffect(() => {
    const paymentIntentId = searchParams.get("payment_intent")
    if (paymentIntentId) {
      processPayment(paymentIntentId)
        .then((result) => {
          if (result.success) {
            setStatus("success")
          } else {
            setStatus("error")
          }
        })
        .catch(() => {
          setStatus("error")
        })
    } else {
      setStatus("error")
    }
  }, [searchParams])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Payment {status === "success" ? "Successful" : status === "error" ? "Failed" : "Processing"}
          </CardTitle>
          <CardDescription>
            {status === "processing" && "We are confirming your payment..."}
            {status === "success" && "Thank you for registering for Ramadan Runs 2025!"}
            {status === "error" && "There was an issue processing your payment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "success" && (
            <Link href="/participants">
              <Button className="w-full">View Participants</Button>
            </Link>
          )}
          {status === "error" && (
            <Link href="/payment">
              <Button className="w-full">Try Again</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

