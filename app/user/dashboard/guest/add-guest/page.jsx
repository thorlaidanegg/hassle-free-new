'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'
import Cookies from 'js-cookie'

export default function AddGuestPage() {
  const [date, setDate] = useState(new Date())
  const [validUntil, setValidUntil] = useState(new Date())
  const [newGuest, setNewGuest] = useState({
    name: '',
    noOfPeople: 1,
    carNo: '',
    purpose: ''
  })
  const router = useRouter()
  const { toast } = useToast()

  const addGuest = async () => {
    try {
      if (!date || !validUntil) {
        throw new Error("Date and Valid Until are required")
      }

      const guestData = {
        ...newGuest,
        date: date.toISOString(),
        validUntil: validUntil.toISOString()
      }

      const res = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/guests`, guestData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('UserAccessToken')}`
        }
      })
      
      toast({
        title: "Success",
        description: "Guest added successfully",
      })
      
      router.push('/user/dashboard/guest')
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add guest",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setNewGuest(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    addGuest()
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
                <Input 
                  id="name" 
                  name="name"
                  value={newGuest.name}
                  onChange={handleInputChange}
                  placeholder="John Doe" 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="noOfPeople">Number of People</Label>
                <Input 
                  id="noOfPeople" 
                  name="noOfPeople"
                  value={newGuest.noOfPeople}
                  onChange={handleInputChange}
                  type="number" 
                  min="1" 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label>Visit Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>Valid Until</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !validUntil && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {validUntil ? format(validUntil, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={validUntil}
                      onSelect={setValidUntil}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="carNo">Car Number (Optional)</Label>
                <Input 
                  id="carNo" 
                  name="carNo"
                  value={newGuest.carNo}
                  onChange={handleInputChange}
                  placeholder="ABC 1234" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purpose">Purpose of Visit</Label>
                <Textarea 
                  id="purpose" 
                  name="purpose"
                  value={newGuest.purpose}
                  onChange={handleInputChange}
                  placeholder="Brief description of the visit" 
                  required
                />
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