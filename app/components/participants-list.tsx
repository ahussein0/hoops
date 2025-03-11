import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getParticipants } from "@/lib/actions"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, Clock } from "lucide-react"

export default async function ParticipantsList() {
  const participants = await getParticipants()

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Participants</CardTitle>
        <CardDescription>{participants.length} people have registered for the event</CardDescription>
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
                  {participant.paymentStatus === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-6">
              <p className="text-slate-500">No participants yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

