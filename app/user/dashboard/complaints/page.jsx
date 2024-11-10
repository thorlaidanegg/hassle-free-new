'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for complaints
const complaints = [
  {
    id: 1,
    title: "Leaking faucet in kitchen",
    description: "The kitchen sink faucet has been leaking for the past two days",
    category: "plumbing",
    priority: "medium",
    status: "pending",
    location: "Apartment 301, Building A"
  },
  {
    id: 2,
    title: "Flickering lights in hallway",
    description: "The lights in the 2nd floor hallway of Building B are flickering",
    category: "electrical",
    priority: "high",
    status: "in-progress",
    location: "2nd Floor Hallway, Building B"
  },
  // Add more mock complaints as needed
]

export default function ComplaintsPage() {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Complaints</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>File New Complaint</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>File a New Complaint</DialogTitle>
              <DialogDescription>
                Please provide details about your complaint. We'll address it as soon as possible.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="housekeeping">housekeeping</SelectItem>
                    <SelectItem value="security">security</SelectItem>
                    <SelectItem value="parking">parking</SelectItem>
                    <SelectItem value="noise">noise</SelectItem>
                    <SelectItem value="lift">lift</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea id="description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input id="location" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Submit Complaint</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6">
            {complaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        </TabsContent>
        {/* Add content for other tabs */}
      </Tabs>
    </div>
  )
}

function ComplaintCard({ complaint }) {
  const priorityColors = {
    low: "bg-blue-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    emergency: "bg-red-500"
  }

  const statusColors = {
    pending: "bg-yellow-500",
    "in-progress": "bg-blue-500",
    resolved: "bg-green-500",
    closed: "bg-gray-500"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{complaint.title}</CardTitle>
          <div className="flex space-x-2">
            <Badge className={priorityColors[complaint.priority]}>{complaint.priority}</Badge>
            <Badge className={statusColors[complaint.status]}>{complaint.status}</Badge>
          </div>
        </div>
        <CardDescription>{complaint.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{complaint.description}</p>
        <p className="mt-2 text-sm text-gray-500">Location: {complaint.location}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  )
}