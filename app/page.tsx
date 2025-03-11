"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { saveChoice } from "@/lib/actions"
import ParticipantsListClient from "./components/participants-list-client"

export default function Home() {
  const [choice, setChoice] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!choice) {
      alert("Please select whether you're in or out.")
      return
    }

    await saveChoice(choice)

    if (choice === "in") {
      router.push("/payment")
    } else {
      router.push("/see-you-next-time")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-md space-y-8">
        <Card className="w-full shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Ramadan Runs 2025</CardTitle>
            <CardDescription>Let us know if you're coming to hoop!</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-center">Are you in or out?</h3>
                  <RadioGroup
                    value={choice || ""}
                    onValueChange={(value) => setChoice(value)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="in" id="in" />
                      <Label htmlFor="in" className="text-lg cursor-pointer">
                        I'm in! 🎉
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="out" id="out" />
                      <Label htmlFor="out" className="text-lg cursor-pointer">
                        I'm out 😢
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={!choice}>
                Continue
              </Button>
            </CardFooter>
          </form>
        </Card>

        <ParticipantsListClient />
      </div>
    </main>
  )
}

