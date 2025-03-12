import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with proper error handling
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15",
    })
  : null;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentIntentId = searchParams.get('payment_intent')

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Missing payment_intent parameter" }, { status: 400 })
    }

    if (!stripe) {
      return NextResponse.json({ error: "Stripe is not properly initialized" }, { status: 500 })
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    return NextResponse.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    })
  } catch (error) {
    console.error("Error checking payment status:", error)
    return NextResponse.json({ 
      error: "Error checking payment status", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
} 