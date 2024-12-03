"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { AlertCircle, AlertTriangle, Bell, Info, Megaphone, Paperclip, Plus } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import axios from "axios"
import Cookies from "js-cookie"

const priorityConfig = {
  low: { icon: Info, color: "bg-blue-500" },
  medium: { icon: Bell, color: "bg-yellow-500" },
  high: { icon: AlertTriangle, color: "bg-orange-500" },
  urgent: { icon: AlertCircle, color: "bg-red-500" },
}

export default function AnnouncementViewer() {
  const [announcements, setAnnouncements] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
    priority: "medium",
    attachments: [],
    notifyUsers: false,
    audience: "all",
    targetedUsers: [],
  })
  
  const socId = Cookies.get('SocietyId')
  const accessToken = Cookies.get('AdminAccessToken')

  const getAnnouncements = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/announcement?societyId=${socId}`, { 
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      setAnnouncements(res.data.announcements)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to fetch announcements",
        variant: "destructive",
      })
    }
  }

  const addAnnouncement = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/announcement`,
        { ...newAnnouncement, societyId: socId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      setAnnouncements([res.data.announcement, ...announcements])
      setIsOpen(false)
      setNewAnnouncement({
        title: "",
        description: "",
        priority: "medium",
        attachments: [],
        notifyUsers: false,
        audience: "all",
        targetedUsers: [],
      })
      toast({
        title: "Success",
        description: "Announcement created successfully",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    getAnnouncements()
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="h-6 w-6" />
            Announcements
          </CardTitle>
          <CardDescription>Stay updated with the latest news and information</CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>
                Fill in the details for your new announcement.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={addAnnouncement} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAnnouncement.description}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newAnnouncement.priority}
                  onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Audience</Label>
                <Select
                  value={newAnnouncement.audience}
                  onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, audience: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="specific_blocks">Specific Blocks</SelectItem>
                    <SelectItem value="specific_users">Specific Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="notify-users"
                  checked={newAnnouncement.notifyUsers}
                  onCheckedChange={(checked) => setNewAnnouncement({ ...newAnnouncement, notifyUsers: checked })}
                />
                <Label htmlFor="notify-users">Notify Users</Label>
              </div>
              <Button type="submit" className="w-full">Create Announcement</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {announcements.length > 0 ? (
            <div className="space-y-8">
              {announcements.map((announcement, index) => {
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
                        <Badge variant="outline" className={`ml-auto ${priorityConfig[announcement.priority].color} text-white`}>
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{announcement.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{format(new Date(announcement.createdAt), "PPp")}</span>
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
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No Announcements
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

