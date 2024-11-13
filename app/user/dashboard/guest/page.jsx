"use client"

import { useEffect, useState } from "react"
import { PlusCircle, QrCode, Share2 } from 'lucide-react'
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
import axios from "axios"
import Cookies from "js-cookie"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  "checked-in": "bg-blue-100 text-blue-800",
  "checked-out": "bg-gray-100 text-gray-800",
}

export default function GuestList() {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [qrCode, setQrCode] = useState("")
  const [selectedGuest, setSelectedGuest] = useState(null)
  const router = useRouter()
  const accessToken = Cookies.get('UserAccessToken')
  const { toast } = useToast()

  const fetchGuests = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/guests`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setGuests(response.data.guests)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch guests. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const addNewGuest = () => {
    router.push('/user/dashboard/guest/add-guest')
  }

  const generateQRCode = async (guest) => {
    setSelectedGuest(guest)
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/guests/generateQr`, 
        { guestId: guest._id },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )
      setQrCode(res.data.qrCode)
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/guest/${selectedGuest._id}`
    navigator.clipboard.writeText(shareLink)
    toast({
      title: "Success",
      description: "Share link copied to clipboard!",
    })
  }

  if (loading) {
    return <GuestListSkeleton />
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
                          <TableCell>{format(new Date(guest.date), "PP")}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[guest.status]}>
                              {guest.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{guest.carNo}</TableCell>
                          <TableCell>{guest.purpose}</TableCell>
                          <TableCell>{format(new Date(guest.validUntil), "PP")}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => generateQRCode(guest)}
                                >
                                  <QrCode className="mr-2 h-4 w-4" /> Generate QR
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Guest QR Code</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col items-center justify-center space-y-4 w-full">
                                  <div className="text-xs text-muted-foreground">share this QR Code with your guest for them to scan at entry</div>
                                  {qrCode ? (
                                    <Image
                                      src={qrCode}
                                      alt="Guest QR Code"
                                      width={200}
                                      height={200}
                                    />
                                  ) : (
                                    <Skeleton className="w-[200px] h-[200px]" />
                                  )}
                                  <Button onClick={copyShareLink}>
                                    <Share2 className="mr-2 h-4 w-4" /> Copy Share Link
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
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

function GuestListSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <Skeleton className="h-10 w-40" />
        </div>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}