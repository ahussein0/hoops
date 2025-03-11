"use server"

import { revalidatePath } from "next/cache"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
})

type Participant = {
  name: string
  phone: string
  paymentStatus: "completed" | "pending"
  paymentMethod: string
  timestamp: number
}

// In-memory storage (replace with a database in a real application)
const participants: Participant[] = []

export async function processPayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === "succeeded") {
      const { name, phone } = paymentIntent.metadata
      await recordParticipant(name, phone, paymentIntent.payment_method_types[0], "completed")
      return { success: true }
    } else {
      return { success: false, error: "Payment not successful" }
    }
  } catch (error) {
    console.error("Payment processing error:", error)
    return { success: false, error: "Payment processing failed" }
  }
}

export async function recordParticipant(
  name: string,
  phone: string,
  paymentMethod: string,
  paymentStatus: "completed" | "pending" = "pending",
) {
  participants.push({
    name,
    phone,
    paymentStatus,
    paymentMethod,
    timestamp: Date.now(),
  })

  revalidatePath("/")
  revalidatePath("/participants")
}

export async function getParticipants(): Promise<Participant[]> {
  return participants.sort((a, b) => b.timestamp - a.timestamp)
}

export async function saveChoice(choice: string) {
  // You might want to store this choice somewhere if needed
  console.log("Saving choice:", choice)
  // For now, we'll just revalidate the paths
  revalidatePath("/")
  revalidatePath("/see-you-next-time")
}

