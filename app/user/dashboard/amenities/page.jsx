'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Clock, Users } from "lucide-react"

// Mock data for amenities
const amenities = [
  {
    id: 1,
    name: "Swimming Pool",
    type: "swimming_pool",
    description: "Olympic-sized swimming pool with separate kids area",
    photos: [
      { url: "https://example.com/pool1.jpg", caption: "Main pool area" },
      { url: "https://example.com/pool2.jpg", caption: "Kids pool" }
    ],
    capacity: 50,
    status: "operational",
    location: "Ground Floor, Building A"
  },
  {
    id: 2,
    name: "Gym",
    type: "gym",
    description: "Fully equipped gym with cardio and strength training areas",
    photos: [
      { url: "https://example.com/gym1.jpg", caption: "Cardio area" },
      { url: "https://example.com/gym2.jpg", caption: "Weight training area" }
    ],
    capacity: 30,
    status: "operational",
    location: "2nd Floor, Building B"
  },
  // Add more mock amenities as needed
]

export default function AmenitiesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Amenities</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((amenity) => (
              <AmenityCard
                key={amenity.id}
                amenity={amenity}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            ))}
          </div>
    </div>
  );
}

function AmenityCard({ amenity, selectedDate, setSelectedDate }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <img
          src={amenity.photos[0].url}
          alt={amenity.photos[0].caption}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle>{amenity.name}</CardTitle>
        <CardDescription>{amenity.description}</CardDescription>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <Users className="mr-1 h-4 w-4" />
          Capacity: {amenity.capacity}
        </div>
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <Clock className="mr-1 h-4 w-4" />
          Status: {amenity.status}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Book Now</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book {amenity.name}</DialogTitle>
              <DialogDescription>
                Make a reservation for the {amenity.name}. Please fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <div className="col-span-3">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="guests" className="text-right">
                  Guests
                </Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max={amenity.capacity}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Confirm Booking</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
