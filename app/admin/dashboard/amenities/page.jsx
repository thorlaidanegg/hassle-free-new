"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Plus, Users, Trash2 } from 'lucide-react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

export default function AmenitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [amenities, setAmenities] = useState()
  const socId = Cookies.get('SocietyId')
  const accessToken = Cookies.get('AdminAccessToken')
  const router = useRouter()

  const fetchAmenities = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/amenities?societyId=${socId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      setAmenities(res.data)
      console.log(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const deleteAmenity = async (amenityId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_SITE_URL}/api/amenities?id=${amenityId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      setAmenities(amenities.filter(amenity => amenity._id !== amenityId))
      toast({
        title: "Amenity deleted",
        description: "The amenity has been successfully deleted.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to delete the amenity. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchAmenities();
  }, [])

  const filteredAmenities = amenities?.filter(amenity =>
    amenity.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Amenities</h1>
      <div className="mb-6 flex justify-between">
        <Input
          type="text"
          placeholder="Search amenities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={() => router.push('/admin/dashboard/amenities/add')}><Plus /> add Amenity</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAmenities?.map((amenity) => (
          <AmenityCard key={amenity._id} amenity={amenity} onDelete={deleteAmenity} />
        ))}
      </div>
    </div>
  )
}

function AmenityCard({ amenity, onDelete }) {
  return (
    <Card className="overflow-hidden flex flex-col relative">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="icon" className="absolute top-2 right-2 z-10">
            <Trash2 className="h-4 w-4 text-red-700" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this amenity?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the amenity.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(amenity._id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
        <Link href={`/user/dashboard/amenities/${amenity._id}`} passHref>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

