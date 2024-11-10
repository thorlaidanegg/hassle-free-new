'use client'

import { useState } from 'react'
import { Sidebar } from "@/components/user/sidebar"
import { Navbar } from "@/components/user/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Users, Briefcase, Calendar, MessageSquare } from 'lucide-react'

// Mock data for announcements
const announcements = [
  {
    id: 1,
    title: "Community Picnic Next Weekend",
    description: "Join us for a fun-filled community picnic at Central Park. Bring your favorite dishes!",
    priority: "medium",
    createdAt: "2023-06-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Urgent: Water Outage Notice",
    description: "There will be a planned water outage on Monday from 10 AM to 2 PM due to maintenance work.",
    priority: "urgent",
    createdAt: "2023-06-16T14:30:00Z"
  },
  {
    id: 3,
    title: "New Gym Equipment Arrived",
    description: "We've added new treadmills and weight machines to our community gym. Come check them out!",
    priority: "low",
    createdAt: "2023-06-17T09:15:00Z"
  }
]

export default function UserDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const priorityColors = {
    low: "bg-blue-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    urgent: "bg-red-500"
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Welcome back, John!</CardTitle>
                <CardDescription>Here's what's happening in your community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="bg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">245</div>
                      <p className="text-xs text-muted-foreground">+5 this month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Amenities</CardTitle>
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8</div>
                      <p className="text-xs text-muted-foreground">2 under maintenance</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">Next: Community Picnic</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">5</div>
                      <p className="text-xs text-muted-foreground">2 resolved this week</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
                <CardDescription>Stay updated with the latest community news</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{announcement.title}</h3>
                        <Badge className={priorityColors[announcement.priority]}>
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{announcement.description}</p>
                      <p className="text-xs text-gray-400">
                        Posted on: {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                      <Separator className="my-4" />
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </main>
    </div>
  )
}