import { NextResponse } from "next/server"

export async function GET() {
  // Only return masked values for security
  return NextResponse.json({
    stripeSecretKeyExists: !!process.env.STRIPE_SECRET_KEY,
    stripePublishableKeyExists: !!process.env.STRIPE_PUBLISHABLE_KEY,
    nextPublicStripePublishableKeyExists: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    // Show first and last few characters of the keys for verification
    stripeSecretKeyMasked: maskString(process.env.STRIPE_SECRET_KEY || ""),
    stripePublishableKeyMasked: maskString(process.env.STRIPE_PUBLISHABLE_KEY || ""),
    nextPublicStripePublishableKeyMasked: maskString(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""),
  })
}

// Helper function to mask sensitive strings
function maskString(str: string): string {
  if (!str) return "";
  if (str.length <= 8) return "****";
  return `${str.substring(0, 4)}...${str.substring(str.length - 4)}`;
} 