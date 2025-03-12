"use client"

import { ReactNode, useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

interface StripeProviderProps {
  children: ReactNode
  clientSecret: string
}

// Make sure to use the environment variable for the publishable key
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : loadStripe("pk_test_51R1FY2RdAYNrQFsOBzsuLemKmbvWRYZXyHtl5ohM7Kxj78hiJKazKHDJox4oQ9Hg2vTbrMlxlpL6chPXxxdquXiz007qStbwd4");

export default function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {children}
    </Elements>
  )
} 