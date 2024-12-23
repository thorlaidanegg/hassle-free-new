'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Car, Mail, Home, User, Calendar, Verified, Edit } from 'lucide-react'
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import axios from "axios"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

export default function UserInfoView() {
  const [user, setUser] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const router = useRouter()
  const { toast } = useToast()
  const token = Cookies.get('UserAccessToken')
  const socId = Cookies.get('SocietyId')

  const getUserData = async () => {
    try {
      if (!token) {
        throw new Error("Unauthorized: No token found")
      }

      const res = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.status !== 200) {
        throw new Error(res.statusText)
      }

      setUser(res.data)
    } catch (error) {
      console.error("Failed to fetch user data:", error.response?.data?.error || error.message)
      toast({
        title: "Error",
        description: "Failed to fetch user data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getVehicles = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/vehicle?societyId=${socId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setVehicles(res.data.userVehicle)
    } catch (error) {
      console.error("Failed to fetch vehicles:", error.response?.data?.error || error.message)
      toast({
        title: "Error",
        description: "Failed to fetch vehicles. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    getUserData()
    getVehicles()
  }, [])

  const handleEdit = () => {
    router.push('/user/dashboard/user-info/edit-details')
  }

  if (!user) {
    return <p className="text-center mt-6">Loading user information...</p>
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-32 h-32">
            <AvatarImage src={user.photo?.url} alt={user.name || "User"} />
            <AvatarFallback>
              {user.name?.split(" ").map(n => n[0]).join("") || "NA"}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{user.name || "Unknown User"}</h2>
          {user.photo?.isVerified && (
            <Badge variant="secondary" className="flex items-center">
              <Verified className="w-4 h-4 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <InfoItem icon={Mail} label="Email" value={user.email || "Not provided"} />
          <InfoItem icon={User} label="Age" value={user.age?.toString() || "Not provided"} />
          <InfoItem icon={Home} label="Address" value={`House ${user.houseNo || "NA"}, Flat ${user.flatNo || "NA"}`} />
          <InfoItem icon={Car} label="Number of Cars" value={vehicles.length.toString()} />
          <InfoItem
            icon={Calendar}
            label="Member Since"
            value={new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }) || "Unknown"}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">Vehicles</h3>
          {vehicles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle._id}>
                    <TableCell>{vehicle.number}</TableCell>
                    <TableCell>{vehicle.name}</TableCell>
                    <TableCell>{vehicle.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No vehicles registered.</p>
          )}
        </div>

        <Button onClick={handleEdit} className="w-full">
          <Edit className="w-4 h-4 mr-2" />
          Edit Details
        </Button>
      </CardContent>
    </Card>
  )
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center space-x-2 p-2 rounded-md bg-gray-50 dark:bg-gray-800">
      <Icon className="w-5 h-5 text-blue-500" />
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  )
}

