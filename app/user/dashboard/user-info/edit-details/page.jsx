"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import Cookies from "js-cookie"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UserEditForm() {
  const [user, setUser] = useState(null)
  const [originalUser, setOriginalUser] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [newVehicle, setNewVehicle] = useState({ number: "", name: "", type: "" })
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const token = Cookies.get('UserAccessToken')
  const socId = Cookies.get('SocietyId')

  useEffect(() => {
    getUserData()
    getVehicles()
  }, [])

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
      setOriginalUser(res.data)
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
    } catch (e) {
      console.error(e)
      toast({
        title: "Error",
        description: "Failed to fetch vehicles. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e) => {
    setUser(prev => ({
      ...prev,
      photo: { ...prev.photo, url: e.target.value }
    }))
  }

  const handleNewVehicleChange = (e) => {
    const { name, value } = e.target
    setNewVehicle(prev => ({ ...prev, [name]: value }))
  }

  const addVehicle = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/vehicle?societyId=${socId}`, newVehicle, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Vehicle added successfully.",
        })
        setIsAddVehicleOpen(false)
        setNewVehicle({ number: "", name: "", type: "" })
        getVehicles()
      }
    } catch (e) {
      console.error(e)
      toast({
        title: "Error",
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getChangedData = () => {
    const changedData = {}
    Object.keys(user).forEach(key => {
      if (JSON.stringify(user[key]) !== JSON.stringify(originalUser[key])) {
        changedData[key] = user[key]
      }
    })
    return changedData
  }

  const updateUser = async (changedData) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user`, changedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
      router.push("/user/dashboard/user-info")
    } catch (err) {
      console.error(err)
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const changedData = getChangedData()
    if (Object.keys(changedData).length > 0) {
      updateUser(changedData)
    } else {
      toast({
        title: "No Changes",
        description: "No changes were made to your profile.",
      })
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit User Profile</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={user.photo?.url} alt={user.name} />
              <AvatarFallback>{user.name?.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="space-y-2 w-full">
              <Label htmlFor="photoUrl">Photo URL</Label>
              <Input
                id="photoUrl"
                value={user.photo?.url || ""}
                onChange={handlePhotoChange}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={user.name || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={user.email || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={user.age || ""}
                onChange={handleChange}
                min="0"
                max="120"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="houseNo">House Number</Label>
              <Input id="houseNo" name="houseNo" value={user.houseNo || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flatNo">Flat Number</Label>
              <Input id="flatNo" name="flatNo" value={user.flatNo || ""} onChange={handleChange} required />
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Vehicles</Label>
              <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
                <DialogTrigger asChild>
                  <Button>Add Vehicle</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Vehicle</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="number">Vehicle Number</Label>
                      <Input id="number" name="number" value={newVehicle.number} onChange={handleNewVehicleChange} required />
                    </div>
                    <div>
                      <Label htmlFor="name">Vehicle Name</Label>
                      <Input id="name" name="name" value={newVehicle.name} onChange={handleNewVehicleChange} required />
                    </div>
                    <div>
                      <Label htmlFor="type">Vehicle Type</Label>
                      <Input id="type" name="type" value={newVehicle.type} onChange={handleNewVehicleChange} required />
                    </div>
                    <Button onClick={addVehicle}>Add Vehicle</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Save Changes</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

