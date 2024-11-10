'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

export default function AddGuestPage() {
  const [date, setDate] = useState(new Date())

  const handleSubmit = (event) => {
    event.preventDefault()
    // Handle form submission
    console.log('Guest added')
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add a Guest</CardTitle>
          <CardDescription>Enter the details of your guest for easy check-in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Guest Name</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="noOfPeople">Number of People</Label>
                <Input id="noOfPeople" type="number" min="1" required />
              </div>
              <div className="grid gap-2">
                <Label>Visit Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="carNo">Car Number (Optional)</Label>
                <Input id="carNo" placeholder="ABC 1234" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purpose">Purpose of Visit</Label>
                <Textarea id="purpose" placeholder="Brief description of the visit" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit}>Add Guest</Button>
        </CardFooter>
      </Card>
    </div>
  )
}