"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, MapPin, Users, DollarSign, Star } from "lucide-react"

// Mock data for a single amenity (replace with actual data fetching in production)
const amenity = {
  id: 1,
  name: "Swimming Pool",
  type: "swimming_pool",
  description: "Olympic-sized swimming pool with separate kids area",
  photos: [
    { url: "https://example.com/pool1.jpg", caption: "Main pool area" },
    { url: "https://example.com/pool2.jpg", caption: "Kids pool" }
  ],
  capacity: 50,
  timings: [
    { day: "monday", openTime: "06:00", closeTime: "22:00", maintenanceTime: "14:00-15:00" },
    { day: "tuesday", openTime: "06:00", closeTime: "22:00" },
    { day: "wednesday", openTime: "06:00", closeTime: "22:00" },
    { day: "thursday", openTime: "06:00", closeTime: "22:00" },
    { day: "friday", openTime: "06:00", closeTime: "22:00" },
    { day: "saturday", openTime: "08:00", closeTime: "20:00" },
    { day: "sunday", openTime: "08:00", closeTime: "20:00" }
  ],
  rules: [
    "No running around the pool area",
    "Children under 12 must be accompanied by an adult",
    "No food or drinks allowed in the pool",
    "Shower before entering the pool",
    "No diving in shallow areas"
  ],
  status: "operational",
  maintenanceSchedule: [
    { date: new Date("2023-07-15"), description: "Annual maintenance", duration: 8 }
  ],
  pricing: {
    isChargeable: true,
    hourlyRate: 5,
    monthlyRate: 50,
    yearlyRate: 500
  },
  location: "Ground Floor, Building A",
  amenityManager: "John Doe"
}

// Mock ratings data
const ratings = [
  { id: 1, userId: "user1", rating: 4, review: "Great facility! The pool is always clean and well-maintained.", createdAt: new Date("2023-06-01") },
  { id: 2, userId: "user2", rating: 5, review: "Excellent service and clean environment. The staff is very helpful.", createdAt: new Date("2023-06-15") },
  { id: 3, userId: "user3", rating: 3, review: "Good pool, but it can get crowded during peak hours.", createdAt: new Date("2023-06-22") }
]

export default function AmenityDetails() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [startTime, setStartTime] = useState({ hour: "09", minute: "00", period: "AM" })
  const [endTime, setEndTime] = useState({ hour: "10", minute: "00", period: "AM" })
  const [guests, setGuests] = useState(1)

  const router = useRouter()

  const handleBooking = () => {
    console.log("Booking:", { 
      selectedDate, 
      startTime: `${startTime.hour}:${startTime.minute} ${startTime.period}`,
      endTime: `${endTime.hour}:${endTime.minute} ${endTime.period}`,
      guests 
    })
    // Implement actual booking logic here
  }

  const TimeSelector = ({ label, value, onChange }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex space-x-2">
        <Select value={value.hour} onValueChange={(newHour) => onChange({ ...value, hour: newHour })}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
              <SelectItem key={hour} value={hour.toString().padStart(2, '0')}>
                {hour.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={value.minute} onValueChange={(newMinute) => onChange({ ...value, minute: newMinute })}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="Min" />
          </SelectTrigger>
          <SelectContent>
            {['00', '15', '30', '45'].map((minute) => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={value.period} onValueChange={(newPeriod) => onChange({ ...value, period: newPeriod })}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="AM/PM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{amenity.name}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <img
                src={amenity.photos[0]?.url || "/placeholder.svg?height=400&width=800"}
                alt={amenity.photos[0]?.caption || amenity.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </CardHeader>
            <CardContent>
              <Badge className="mb-4" variant={amenity.status === 'operational' ? 'default' : 'destructive'}>
                {amenity.status}
              </Badge>
              <p className="text-gray-600 mb-4">{amenity.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-gray-500" />
                  <span>Capacity: {amenity.capacity}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                  <span>{amenity.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-gray-500" />
                  <span>Open: {amenity.timings[0]?.openTime} - {amenity.timings[0]?.closeTime}</span>
                </div>
                {amenity.pricing.isChargeable && (
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-gray-500" />
                    <span>Hourly Rate: ${amenity.pricing.hourlyRate}</span>
                  </div>
                )}
              </div>
              <Separator className="my-4" />
              <h3 className="text-xl font-semibold mb-2">Rules</h3>
              <ul className="list-disc list-inside mb-4">
                {amenity.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
              <Separator className="my-4" />
              <h3 className="text-xl font-semibold mb-2">Timings</h3>
              <div className="grid grid-cols-2 gap-2">
                {amenity.timings.map((timing, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="capitalize">{timing.day}</span>
                    <span>{timing.openTime} - {timing.closeTime}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {ratings.map((rating) => (
                <div key={rating.id} className="mb-4">
                  <div className="flex items-center mb-2">
                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="font-semibold">{rating.rating}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {format(rating.createdAt, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p>{rating.review}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="shadow-lg">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-2xl">Book {amenity.name}</CardTitle>
              <CardDescription className="text-primary-foreground/80">Select your preferred date and time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <Label className="text-lg font-semibold">Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border mt-2"
                />
              </div>
              <TimeSelector label="Start Time" value={startTime} onChange={setStartTime} />
              <TimeSelector label="End Time" value={endTime} onChange={setEndTime} />
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-lg font-semibold">Number of Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max={amenity.capacity}
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="text-lg"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full text-lg py-6" onClick={handleBooking}>
                Book Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}