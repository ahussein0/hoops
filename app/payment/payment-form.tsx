"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"

interface PaymentFormProps {
  amount?: number;
}

export default function PaymentForm({ amount = 2500 }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { toast } = useToast()

  // Format amount for display ($25.00)
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the PaymentIntent client_secret from the URL
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    // If we have a client_secret in the URL, it means we're returning from a payment attempt
    if (clientSecret) {
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (!paymentIntent) return;
        
        switch (paymentIntent.status) {
          case "succeeded":
            toast({
              title: "Payment successful!",
              description: "Thank you for your payment.",
              variant: "default",
            });
            // Redirect to confirmation page with payment intent ID
            window.location.href = `/payment-confirmation?payment_intent=${paymentIntent.id}&payment_intent_client_secret=${clientSecret}`;
            if (paymentIntent.id) {
              processPayment(paymentIntent.id);
            }
            break;
          case "processing":
            toast({
              title: "Payment processing",
              description: "Your payment is processing.",
              variant: "default",
            });
            // Redirect to confirmation page with payment intent ID
            window.location.href = `/payment-confirmation?payment_intent=${paymentIntent.id}&payment_intent_client_secret=${clientSecret}`;
            break;
          case "requires_payment_method":
            toast({
              title: "Payment failed",
              description: "Please try another payment method.",
              variant: "destructive",
            });
            setErrorMessage("Your payment was not successful. Please try again with a different payment method.");
            break;
          default:
            toast({
              title: "Something went wrong",
              description: "Please try again later.",
              variant: "destructive",
            });
            setErrorMessage("An unexpected error occurred. Please try again later.");
            break;
        }
      });
    }
  }, [stripe, toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setErrorMessage("Stripe is still loading. Please wait a moment and try again.");
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    // Log that we're about to confirm payment
    console.log("Confirming payment...");

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Make sure to include the return_url
          return_url: `${window.location.origin}/payment-confirmation`,
        },
        // Always redirect for better UX
        redirect: "always",
      });

      // This point will only be reached if redirect: "always" is not honored
      // or if there's an immediate error
      if (error) {
        console.error("Payment confirmation error:", error);
        setErrorMessage(error.message || "An unexpected error occurred.");
        toast({
          title: "Payment failed",
          description: error.message || "An error occurred during payment.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error("Exception during payment confirmation:", e);
      setErrorMessage(e instanceof Error ? e.message : "An unexpected error occurred.");
      toast({
        title: "Payment error",
        description: "There was a problem processing your payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center">
        <p className="text-sm text-blue-700 mb-1">Payment Amount</p>
        <p className="text-2xl font-bold text-blue-900">{formattedAmount}</p>
      </div>
      
      <PaymentElement />
      
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {errorMessage}
        </div>
      )}
      
      <Button type="submit" disabled={isProcessing || !stripe || !elements} className="w-full mt-6">
        {isProcessing ? "Processing..." : `Pay ${formattedAmount}`}
      </Button>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        You will be redirected to a confirmation page after successful payment.
      </p>
    </form>
  )
}

