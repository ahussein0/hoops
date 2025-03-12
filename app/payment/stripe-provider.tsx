"use client"

import { ReactNode, useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

interface StripeProviderProps {
  children: ReactNode
  clientSecret: string
}

export default function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const [stripePromise, setStripePromise] = useState(null)

  useEffect(() => {
    // Load the publishable key from an environment variable
    // This ensures the key is loaded on the client side
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    
    if (key) {
      console.log("Stripe key found, initializing Stripe...")
      setStripePromise(loadStripe(key))
    } else {
      console.error("Stripe publishable key not found!")
    }
  }, [])

  if (!stripePromise) {
    return <div>Loading payment system...</div>
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {children}
    </Elements>
  )
} 