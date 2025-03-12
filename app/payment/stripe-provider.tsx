"use client"

import { ReactNode, useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

interface StripeProviderProps {
  children: ReactNode
  clientSecret: string
}

// Initialize Stripe outside the component to avoid re-initialization
// This is a workaround for the environment variable issue
const stripePromise = loadStripe("pk_test_51R1FY2RdAYNrQFsOBzsuLemKmbvWRYZXyHtl5ohM7Kxj78hiJKazKHDJox4oQ9Hg2vTbrMlxlpL6chPXxxdquXiz007qStbwd4");

export default function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {children}
    </Elements>
  )
} 