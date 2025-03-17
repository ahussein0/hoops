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

    // Validate the amount
    if (!amount || isNaN(amount) || amount < 500) {
      return NextResponse.json({ 
        error: "Invalid amount", 
        details: "Amount must be at least $5.00 (500 cents)" 
      }, { status: 400 })
    }

    // Create a payment intent with the specified amount
    console.log(`Creating payment intent for ${name} with amount ${amount} cents`);
    
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
      // Set a description for the payment
      description: `Ramadan Runs 2025 - ${name}`,
    })

    console.log(`Payment intent created with ID: ${paymentIntent.id}`);

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    })
  } catch (error) {
    console.error("Error creating PaymentIntent:", error)
    return NextResponse.json({ 
      error: "Error creating PaymentIntent", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}

