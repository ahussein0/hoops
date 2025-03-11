import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SeeYouNextTimePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">See You Next Time!</CardTitle>
          <CardDescription>We'll miss you at Ramadan Runs 2025</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">We hope to see you at our next week. Stay active and keep hooping!</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}

