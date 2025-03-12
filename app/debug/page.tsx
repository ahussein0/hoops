"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [serverEnvVars, setServerEnvVars] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Client-side environment variables
  const clientEnvVars = {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "Not found",
  }

  useEffect(() => {
    async function fetchServerEnvVars() {
      try {
        const response = await fetch("/api/debug-env")
        if (!response.ok) {
          throw new Error("Failed to fetch server environment variables")
        }
        const data = await response.json()
        setServerEnvVars(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchServerEnvVars()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Environment Debug</CardTitle>
          <CardDescription>Check if environment variables are properly loaded</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Client-side Environment Variables</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(clientEnvVars, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Server-side Environment Variables</h2>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(serverEnvVars, null, 2)}
              </pre>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
} 