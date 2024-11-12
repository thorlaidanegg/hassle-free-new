"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { AlertCircle, AlertTriangle, Bell, Info, Megaphone, Paperclip } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import axios from "axios"
import Cookies from "js-cookie"
import announcement from "@/models/announcement"

// Mock data for demonstration
// const mockAnnouncements = [
//   {
//     _id: "1",
//     title: "System Maintenance",
//     description: "Our systems will be undergoing maintenance on Saturday night. Please save your work.",
//     priority: "high",
//     attachments: ["maintenance_schedule.pdf"],
//     notifyUsers: true,
//     audience: "all",
//     createdAt: new Date("2023-06-15T10:00:00"),
//   },
//   {
//     _id: "2",
//     title: "New Feature Release",
//     description: "We're excited to announce the release of our new messaging feature!",
//     priority: "medium",
//     attachments: [],
//     notifyUsers: true,
//     audience: "all",
//     createdAt: new Date("2023-06-14T14:30:00"),
//   },
//   {
//     _id: "3",
//     title: "Office Closure",
//     description: "The office will be closed on Monday for a public holiday.",
//     priority: "low",
//     attachments: ["holiday_schedule.pdf"],
//     notifyUsers: false,
//     audience: "specific_blocks",
//     createdAt: new Date("2023-06-13T09:15:00"),
//   },
//   {
//     _id: "4",
//     title: "Emergency Evacuation Drill",
//     description: "An emergency evacuation drill will be conducted next week. Please review the procedures.",
//     priority: "urgent",
//     attachments: ["evacuation_procedures.pdf"],
//     notifyUsers: true,
//     audience: "all",
//     createdAt: new Date("2023-06-12T16:45:00"),
//   },
// ]

const priorityConfig = {
  low: { icon: Info, color: "bg-blue-500" },
  medium: { icon: Bell, color: "bg-yellow-500" },
  high: { icon: AlertTriangle, color: "bg-orange-500" },
  urgent: { icon: AlertCircle, color: "bg-red-500" },
}

export default function AnnouncementViewer() {
  const [announcements, setAnnouncements] = useState()

  const getAnnouncements = async () => {

    try{

      const res = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/announcement`,
        { 
          headers: {
            Authorization: `Bearer ${Cookies.get('UserAccessToken')}`
          }
        }
      ); 
      console.log(res.data.announcements)
      setAnnouncements(res.data.announcements)
    }catch(error){
      console.error(error);
    }

  }

  useEffect(() => {
    getAnnouncements()
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Megaphone className="h-6 w-6" />
          Announcements
        </CardTitle>
        <CardDescription>Stay updated with the latest news and information</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {announcements ? 
          <div className="space-y-8">
            {announcements?.map((announcement, index) => {
              const PriorityIcon = priorityConfig[announcement.priority].icon
              return (
                <div key={announcement._id} className="relative">
                  <div
                    className={`absolute left-0 w-1 h-full ${
                      priorityConfig[announcement.priority].color
                    } rounded-full`}
                  />
                  <div className="ml-6">
                    <div className="flex items-center gap-2 mb-2">
                      <PriorityIcon className="h-5 w-5" />
                      <h3 className="text-lg font-semibold">{announcement.title}</h3>
                      <Badge variant="outline" className={`ml-auto ${
                      priorityConfig[announcement.priority].color
                    } text-white`}>

                        {announcement.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{announcement.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{format(announcement.createdAt, "PPp")}</span>
                      <span>Audience: {announcement.audience}</span>
                      {announcement.notifyUsers && <span className="text-green-500">Notifications sent</span>}
                    </div>
                    {announcement.attachments.length > 0 && (
                      <div className="mt-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Paperclip className="h-3 w-3 mr-1" />
                          {announcement.attachments.length} Attachment
                          {announcement.attachments.length > 1 ? "s" : ""}
                        </Button>
                      </div>
                    )}
                  </div>
                  {index < announcements.length - 1 && <Separator className="my-4" />}
                </div>
              )
            })}
          </div>
          :
          <div>
            No Announcemets
          </div>
          }
        </ScrollArea>
      </CardContent>
    </Card>
  )
}