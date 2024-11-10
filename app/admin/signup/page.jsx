'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon, BuildingIcon, MapPinIcon } from 'lucide-react'
import { useToast } from "/hooks/use-toast"
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function AdminSignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    societyName: '',
    societyAddress: '',
    latitude: '',
    longitude: '',
    pincode: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (Object.values(formData).some(value => value.trim() === '')) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/signup`, formData)

      if (res.data.status === 'success') {
        toast({
          title: "Account Created",
          description: "Your admin account has been successfully created.",
        })
        router.push('/admin/login')
      } else {
        throw new Error(res.data.message || "Signup failed.")
      }
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.response?.data?.message || "An error occurred during signup. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Signup Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Create Admin Account</CardTitle>
            <CardDescription>Sign up to manage your residential society with HassleFree</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name and Email Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <Input id="name" type="text" placeholder="John Doe" required className="pl-10" onChange={handleChange} />
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input id="email" type="email" placeholder="admin@example.com" required className="pl-10" onChange={handleChange} />
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-10 pr-10"
                    onChange={handleChange}
                  />
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Other Fields */}
              {/* Society Name, Address, Latitude, Longitude, Pincode */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="societyName">Society Name</Label>
                  <div className="relative">
                    <Input id="societyName" type="text" placeholder="Sunset Residences" required className="pl-10" onChange={handleChange} />
                    <BuildingIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="societyAddress">Society Address</Label>
                  <div className="relative">
                    <Input id="societyAddress" type="text" placeholder="123 Main St" required className="pl-10" onChange={handleChange} />
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input id="latitude" type="number" step="any" placeholder="40.7128" required onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input id="longitude" type="number" step="any" placeholder="-74.0060" required onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" type="text" placeholder="100001" required onChange={handleChange} />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create Admin Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex items-center justify-center w-full">
              <span className="text-sm text-gray-500">Already have an account?</span>
              <Link href="/admin/login" className="text-sm text-primary hover:underline ml-1">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Signup Graphic Section */}
      <div className="flex-1 bg-gradient-to-br from-primary to-purple-600 hidden md:flex items-center justify-center p-8">
        <div className="max-w-md text-white">
          <h2 className="text-4xl font-bold mb-6">Empower Your Community Management</h2>
          <p className="text-xl mb-8">
            Join HassleFree as an admin and unlock powerful tools to streamline your residential society management. 
            Our platform is designed to make your administrative tasks easier and more efficient.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <svg className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Easy Setup</span>
            </div>
            <div className="flex items-center">
              <svg className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Customizable</span>
            </div>
            <div className="flex items-center">
              <svg className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Resident Management</span>
            </div>
            <div className="flex items-center">
              <svg className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Insightful Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}