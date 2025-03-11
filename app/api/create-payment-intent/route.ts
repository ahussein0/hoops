import { NextResponse } from "next/server"
import Stripe from "stripe"

// Check if the STRIPE_SECRET_KEY is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("Missing STRIPE_SECRET_KEY environment variable");
}

// Initialize Stripe with proper error handling
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15",
    })
  : null;

export async function POST(request: Request) {
  try {
    // Check if Stripe is properly initialized
    if (!stripe) {
      throw new Error("Stripe is not properly initialized. Please check your environment variables.");
    }

    const { amount, name, phone } = await request.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        event: "Ramadan Runs 2025",
        name,
        phone,
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Error creating PaymentIntent:", error)
    return NextResponse.json({ 
      error: "Error creating PaymentIntent", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}

