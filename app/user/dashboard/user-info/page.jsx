'use client'
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Car, Mail, Home, User, Calendar, Verified, Edit } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock user data - replace with actual data in production
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  age: 30,
  houseNo: "42",
  flatNo: "B",
  photo: {
    url: "https://i.pravatar.cc/300",
    isVerified: true
  },
  noOfCars: 2,
  carNumbers: ["ABC123", "XYZ789"],
  createdAt: new Date("2023-01-01")
}

export default function UserInfoView() {
  const [user, setUser] = useState(userData)
  const router = useRouter();

  const handleEdit = () => {
    // Implement edit functionality here
    router.push('/user/dashboard/user-info/edit-details')
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-32 h-32">
            <AvatarImage src={user.photo?.url} alt={user.name} />
            <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          {user.photo?.isVerified && (
            <Badge variant="secondary" className="flex items-center">
              <Verified className="w-4 h-4 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <InfoItem icon={Mail} label="Email" value={user.email} />
          <InfoItem icon={User} label="Age" value={user.age?.toString() || "Not provided"} />
          <InfoItem icon={Home} label="Address" value={`House ${user.houseNo}, Flat ${user.flatNo}`} />
          <InfoItem icon={Car} label="Number of Cars" value={user.noOfCars.toString()} />
          <InfoItem
            icon={Calendar}
            label="Member Since"
            value={user.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">Car Numbers</h3>
          <div className="flex flex-wrap gap-2">
            {user.carNumbers.map((carNumber, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                {carNumber}
              </Badge>
            ))}
          </div>
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