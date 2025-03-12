import { NextResponse } from "next/server"
import { getParticipants } from "@/lib/actions"
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

export async function GET() {
  try {
    // We don't actually use Stripe in this endpoint, but we initialize it
    // to ensure the build process doesn't fail due to missing environment variables
    
    const participants = await getParticipants()
    return NextResponse.json(participants)
  } catch (error) {
    console.error("Error fetching participants:", error)
    return NextResponse.json({ 
      error: "Error fetching participants",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 