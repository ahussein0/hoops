import { NextResponse } from "next/server"
import { getParticipants } from "@/lib/actions"

export async function GET() {
  try {
    const participants = await getParticipants()
    return NextResponse.json(participants)
  } catch (error) {
    console.error("Error fetching participants:", error)
    return NextResponse.json({ error: "Error fetching participants" }, { status: 500 })
  }
} 