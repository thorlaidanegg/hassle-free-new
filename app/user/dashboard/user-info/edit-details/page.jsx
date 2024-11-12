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

export default function UserEditForm() {
  const [user, setUser] = useState(null)
  const [originalUser, setOriginalUser] = useState(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    getUserData()
  }, [])

  useEffect(() => {
    if (user && user.carNumbers) {
      const newCarNumbers = [...user.carNumbers]
      if (newCarNumbers.length < user.noOfCars) {
        while (newCarNumbers.length < user.noOfCars) {
          newCarNumbers.push("")
        }
      } else if (newCarNumbers.length > user.noOfCars) {
        newCarNumbers.splice(user.noOfCars)
      }
      setUser(prev => ({ ...prev, carNumbers: newCarNumbers }))
    }
  }, [user?.noOfCars])

  const getUserData = async () => {
    try {
      const token = Cookies.get('UserAccessToken')
      if (!token) {
        throw new Error("Unauthorized: No token found");
      }

      const res = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      setUser(res.data);
      setOriginalUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error.response?.data?.error || error.message);
      toast({
        title: "Error",
        description: "Failed to fetch user data. Please try again.",
        variant: "destructive",
      })
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: name === "noOfCars" ? parseInt(value) : value }))
  }

  const handlePhotoChange = (e) => {
    setUser(prev => ({
      ...prev,
      photo: { ...prev.photo, url: e.target.value }
    }))
  }

  const handleCarNumberChange = (index, value) => {
    const updatedCarNumbers = [...user.carNumbers]
    updatedCarNumbers[index] = value
    setUser(prev => ({ ...prev, carNumbers: updatedCarNumbers }))
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
          Authorization: `Bearer ${Cookies.get('UserAccessToken')}`
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
            <div className="space-y-2">
              <Label htmlFor="noOfCars">Number of Cars</Label>
              <Input
                id="noOfCars"
                name="noOfCars"
                type="number"
                value={user.noOfCars || 0}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label>Car Numbers</Label>
            <div className="space-y-2 mt-2">
              {user.carNumbers?.map((carNumber, index) => (
                <Input
                  key={index}
                  value={carNumber}
                  onChange={e => handleCarNumberChange(index, e.target.value)}
                  placeholder={`Car ${index + 1} Number`}
                />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Save Changes</Button>
        </CardFooter>
      </form>
    </Card>
  )
}