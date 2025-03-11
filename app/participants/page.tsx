import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getParticipants } from "@/lib/actions"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function ParticipantsPage() {
  const participants = await getParticipants()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Participants</CardTitle>
          <CardDescription>{participants.length} people have signed up to hoop event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {participants.length > 0 ? (
              <ul className="space-y-3">
                {participants.map((participant, index) => (
                  <li key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {participant.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-slate-500">{participant.phone}</p>
                      </div>
                    </div>
                    <Badge variant={participant.paymentStatus === "completed" ? "success" : "secondary"}>
                      {participant.paymentStatus === "completed" ? "Paid" : "Pending"}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center p-6">
                <p className="text-slate-500">No participants yet</p>
              </div>
            )}

            <div className="pt-4">
              <Link href="/" className="w-full block">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

