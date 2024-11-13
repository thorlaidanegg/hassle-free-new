"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios'
import Cookies from 'js-cookie'

export default function AmenityDetails() {
  const [amenity, setAmenity] = useState(null)
  const [reviews, setReviews] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [startTime, setStartTime] = useState({ hour: "09", minute: "00", period: "AM" })
  const [endTime, setEndTime] = useState({ hour: "10", minute: "00", period: "AM" })
  const [guests, setGuests] = useState(1)
  const [newReview, setNewReview] = useState({
    rating: 0,
    cleanliness: 0,
    maintenance: 0,
    staff: 0,
    equipment: 0,
    review: "",
    photos: []
  })

  const pathname = usePathname()
  const id = pathname.split("/")[4]
  const accessToken = Cookies.get('UserAccessToken')

  const getAmenityById = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/amenities/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      console.log(res.data)
      setAmenity(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const getReviews = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/amenities/rating`, {
        params: { amenityId: id },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      console.log(res.data)
      setReviews(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const addReview = async () => {
    try {
      const reviewData = {
        ...newReview,
        amenityId: id
      }
      await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/amenities/rating`, reviewData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      getReviews()
      setNewReview({
        rating: 0,
        cleanliness: 0,
        maintenance: 0,
        staff: 0,
        equipment: 0,
        review: "",
        photos: []
      })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getAmenityById()
    getReviews()
  }, [id])

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

  if (!amenity) {
    return <div>Loading...</div>
  }

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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Open Time</TableHead>
                    <TableHead>Close Time</TableHead>
                    <TableHead>Maintenance Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amenity.timings.map((timing, index) => (
                    <TableRow key={index}>
                      <TableCell className="capitalize">{timing.day}</TableCell>
                      <TableCell>{timing.openTime}</TableCell>
                      <TableCell>{timing.closeTime}</TableCell>
                      <TableCell>{timing.maintenanceTime || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.map((review) => (
                <div key={review._id} className="mb-4">
                  <div className="flex items-center mb-2">
                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="font-semibold">{review.rating}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {format(new Date(review.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p>{review.review}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="mr-2">Cleanliness: {review.cleanliness}/5</span>
                    <span className="mr-2">Maintenance: {review.maintenance}/5</span>
                    <span className="mr-2">Staff: {review.staff}/5</span>
                    <span>Equipment: {review.equipment}/5</span>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Review</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a Review</DialogTitle>
                    <DialogDescription>Share your experience with this amenity.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="rating" className="text-right">Rating</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        value={newReview.rating}
                        onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cleanliness" className="text-right">Cleanliness</Label>
                      <Input
                        id="cleanliness"
                        type="number"
                        min="1"
                        max="5"
                        value={newReview.cleanliness}
                        onChange={(e) => setNewReview({...newReview, cleanliness: parseInt(e.target.value)})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="maintenance" className="text-right">Maintenance</Label>
                      <Input
                        id="maintenance"
                        type="number"
                        min="1"
                        max="5"
                        value={newReview.maintenance}
                        onChange={(e) => setNewReview({...newReview, maintenance: parseInt(e.target.value)})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="staff" className="text-right">Staff</Label>
                      <Input
                        id="staff"
                        type="number"
                        min="1"
                        max="5"
                        value={newReview.staff}
                        onChange={(e) => setNewReview({...newReview, staff: parseInt(e.target.value)})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="equipment" className="text-right">Equipment</Label>
                      <Input
                        id="equipment"
                        type="number"
                        min="1"
                        max="5"
                        value={newReview.equipment}
                        onChange={(e) => setNewReview({...newReview, equipment: parseInt(e.target.value)})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="review" className="text-right">Review</Label>
                      <Textarea
                        id="review"
                        value={newReview.review}
                        onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addReview}>Submit Review</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
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