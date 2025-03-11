"use client"

import { useEffect } from "react"
import { initializeApplePay } from "@/lib/apple-pay"

export default function ApplePayClient() {
  useEffect(() => {
    initializeApplePay()
  }, [])

  return null
}

