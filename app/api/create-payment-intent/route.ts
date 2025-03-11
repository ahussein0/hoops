import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
})

export async function POST(request: Request) {
  try {
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
    return NextResponse.json({ error: "Error creating PaymentIntent" }, { status: 500 })
  }
}

