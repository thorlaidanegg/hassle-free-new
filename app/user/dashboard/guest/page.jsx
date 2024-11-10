"use client"

import { useState } from "react"
import { PlusCircle, QrCode } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation"

// Mock data for demonstration
const mockGuests = [
  {
    guestId: "G001",
    name: "John Doe",
    noOfPeople: 2,
    date: new Date("2023-06-15"),
    status: "pending",
    carNo: "ABC123",
    purpose: "Meeting",
    validUntil: new Date("2023-06-16"),
  },
  {
    guestId: "G002",
    name: "Jane Smith",
    noOfPeople: 1,
    date: new Date("2023-06-16"),
    status: "approved",
    carNo: "XYZ789",
    purpose: "Interview",
    validUntil: new Date("2023-06-17"),
  },
  {
    guestId: "G003",
    name: "Alice Johnson",
    noOfPeople: 3,
    date: new Date("2023-06-17"),
    status: "checked-in",
    carNo: "DEF456",
    purpose: "Conference",
    validUntil: new Date("2023-06-18"),
  },
  {
    guestId: "G004",
    name: "Bob Williams",
    noOfPeople: 2,
    date: new Date("2023-06-18"),
    status: "checked-out",
    carNo: "GHI789",
    purpose: "Tour",
    validUntil: new Date("2023-06-19"),
  },
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  "checked-in": "bg-blue-100 text-blue-800",
  "checked-out": "bg-gray-100 text-gray-800",
}

export default function GuestList() {
  const [guests, setGuests] = useState(mockGuests)
  const router = useRouter()

  const addNewGuest = () => {
    router.push('/user/dashboard/guest/add-guest')
  }

  const generateQRCode = (guestId) => {
    // Implement QR code generation
    console.log(`Generate QR code for guest ${guestId}`)
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
            <CardHeader>
            <CardTitle className="text-2xl font-bold">Guest Management</CardTitle>
            </CardHeader>
            <Button onClick={addNewGuest} className="mr-2 md:mr-5">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Guest
            </Button>
        </div>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="checked-in">Checked In</TabsTrigger>
              <TabsTrigger value="checked-out">Checked Out</TabsTrigger>
            </TabsList>
            {["all", "pending", "approved", "checked-in", "checked-out"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>No. of People</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Car No.</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests
                      .filter((guest) => tab === "all" || guest.status === tab)
                      .map((guest) => (
                        <TableRow key={guest.guestId}>
                          <TableCell>{guest.guestId}</TableCell>
                          <TableCell>{guest.name}</TableCell>
                          <TableCell>{guest.noOfPeople}</TableCell>
                          <TableCell>{format(guest.date, "PP")}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[guest.status]}>
                              {guest.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{guest.carNo}</TableCell>
                          <TableCell>{guest.purpose}</TableCell>
                          <TableCell>{format(guest.validUntil, "PP")}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generateQRCode(guest.guestId)}
                            >
                              <QrCode className="mr-2 h-4 w-4" /> Generate QR
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}