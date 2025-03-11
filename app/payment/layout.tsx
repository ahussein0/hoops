import type React from "react"
import ApplePayClient from "./apple-pay-client"

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <ApplePayClient />
    </>
  )
}

