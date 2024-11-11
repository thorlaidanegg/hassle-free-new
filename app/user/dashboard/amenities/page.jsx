"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users } from "lucide-react"

// Mock data for amenities (replace with actual data in production)
const amenities = [
  {
    id: 1,
    name: "Swimming Pool",
    type: "swimming_pool",
    description: "Olympic-sized swimming pool with separate kids area",
    photos: [{ url: "https://example.com/pool1.jpg", caption: "Main pool area" }],
    capacity: 50,
    status: "operational",
    location: "Ground Floor, Building A"
  },
  {
    id: 2,
    name: "Gym",
    type: "gym",
    description: "Fully equipped gym with cardio and strength training areas",
    photos: [{ url: "https://example.com/gym1.jpg", caption: "Cardio area" }],
    capacity: 30,
    status: "operational",
    location: "2nd Floor, Building B"
  },
  // Add more mock amenities as needed
]

export default function AmenitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAmenities = amenities.filter(amenity =>
    amenity.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Amenities</h1>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search amenities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAmenities.map((amenity) => (
          <AmenityCard key={amenity.id} amenity={amenity} />
        ))}
      </div>
    </div>
  )
}

function AmenityCard({ amenity }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-0">
        <img
          src={amenity.photos[0]?.url || "/placeholder.svg?height=200&width=400"}
          alt={amenity.photos[0]?.caption || amenity.name}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="flex items-center justify-between">
          {amenity.name}
          <Badge variant={amenity.status === 'operational' ? 'default' : 'destructive'}>
            {amenity.status}
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-500 mt-2">{amenity.description}</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="mr-2 h-4 w-4" />
            Capacity: {amenity.capacity}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="mr-2 h-4 w-4" />
            {amenity.location}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Link href={`/amenities/${amenity.id}`} passHref>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}