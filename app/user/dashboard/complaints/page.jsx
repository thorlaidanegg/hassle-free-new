'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { StarIcon, AlertCircle, CheckCircle2, Clock, HardHat } from "lucide-react"
import axios from 'axios'
import Cookies from 'js-cookie'

const categories = [
  'electrical', 'plumbing', 'carpentry', 'housekeeping', 'security', 'lift',
  'parking', 'noise', 'pest_control', 'common_area', 'garden', 'gymnasium',
  'swimming_pool', 'other'
]

const priorities = ['low', 'medium', 'high', 'emergency']

const statusIcons = {
  pending: <Clock className="w-4 h-4" />,
  assigned: <AlertCircle className="w-4 h-4" />,
  'in-progress': <HardHat className="w-4 h-4" />,
  material_needed: <AlertCircle className="w-4 h-4" />,
  resolved: <CheckCircle2 className="w-4 h-4" />,
  closed: <CheckCircle2 className="w-4 h-4" />
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([])
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    category: '',
    subCategory: '',
    description: '',
    location: '',
    priority: 'medium',
    estimatedCost: ''
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all') // Added state for active tab

  const getComplaints = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/complaints`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('UserAccessToken')}`
        }
      })
      setComplaints(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const updateComplaint = async (complaintId, updateData) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_SITE_URL}/api/complaints?id=${complaintId}`, updateData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('UserAccessToken')}`
        }
      })
      console.log(res.data)
      getComplaints()
    } catch (err) {
      console.error(err)
    }
  }

  const handleNewComplaintSubmit = async (e) => {
    e.preventDefault()
    await fileComplaint()
    setIsDialogOpen(false)
    getComplaints()
    // Reset the form after submission
    setNewComplaint({
      title: '',
      category: '',
      subCategory: '',
      description: '',
      location: '',
      priority: 'medium',
      estimatedCost: ''
    })
  }

  const fileComplaint = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/complaints`, newComplaint, {
        headers: {
          Authorization: `Bearer ${Cookies.get('UserAccessToken')}`
        }
      })
      // Add the new complaint to the list
      setComplaints([...complaints, res.data])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getComplaints()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Complaints</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>   
            <Button onClick={() => setIsDialogOpen(true)}>File New Complaint</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>File a New Complaint</DialogTitle>
              <DialogDescription>
                Please provide details about your complaint. We'll address it as soon as possible.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewComplaintSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input 
                    key="title"
                    id="title" 
                    className="col-span-3" 
                    value={newComplaint.title}
                    onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select 
                    id="category"
                    onValueChange={(value) => setNewComplaint({...newComplaint, category: value})}
                    required
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} id={`category-${category}`} value={category}>
                          {category.replace('_', ' ').charAt(0).toUpperCase() + category.replace('_', ' ').slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subCategory" className="text-right">
                    Sub-Category
                  </Label>
                  <Input 
                    key="subCategory"
                    id="subCategory" 
                    className="col-span-3" 
                    value={newComplaint.subCategory}
                    onChange={(e) => setNewComplaint({...newComplaint, subCategory: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea 
                    key="description"
                    id="description" 
                    className="col-span-3" 
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input 
                    key="location"
                    id="location" 
                    className="col-span-3" 
                    value={newComplaint.location}
                    onChange={(e) => setNewComplaint({...newComplaint, location: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priority
                  </Label>
                  <Select 
                    id="priority"
                    onValueChange={(value) => setNewComplaint({...newComplaint, priority: value})}
                    defaultValue="medium"
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority} id={`priority-${priority}`} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="estimatedCost" className="text-right">
                    Estimated Cost
                  </Label>
                  <Input 
                    key="estimatedCost"
                    id="estimatedCost" 
                    type="number"
                    className="col-span-3" 
                    value={newComplaint.estimatedCost}
                    onChange={(e) => setNewComplaint({...newComplaint, estimatedCost: e.target.value})}
                  />
                </div>

              </div>
              <DialogFooter>
                <Button type="submit">Submit Complaint</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Tabs with Filtering */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        
        {/* Define TabsContent for each tab */}
        <TabsContent value="all" className="mt-6">
          <ComplaintsList complaints={complaints} updateComplaint={updateComplaint} />
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <ComplaintsList complaints={complaints.filter(c => c.status === 'pending')} updateComplaint={updateComplaint} />
        </TabsContent>
        <TabsContent value="in-progress" className="mt-6">
          <ComplaintsList complaints={complaints.filter(c => c.status === 'in-progress')} updateComplaint={updateComplaint} />
        </TabsContent>
        <TabsContent value="resolved" className="mt-6">
          <ComplaintsList complaints={complaints.filter(c => c.status === 'resolved')} updateComplaint={updateComplaint} />
        </TabsContent>
        <TabsContent value="closed" className="mt-6">
          <ComplaintsList complaints={complaints.filter(c => c.status === 'closed')} updateComplaint={updateComplaint} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ComplaintsList({ complaints, updateComplaint }) {
  if (complaints.length === 0) {
    return <p className="text-center text-gray-500">No complaints found.</p>
  }

  return (
    <div className="grid gap-6">
      {complaints.map((complaint) => (
        <ComplaintCard key={complaint._id} complaint={complaint} updateComplaint={updateComplaint} />
      ))}
    </div>
  )
}

function ComplaintCard({ complaint, updateComplaint }) {
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' })

  const priorityColors = {
    low: "bg-blue-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    emergency: "bg-red-500"
  }

  const statusColors = {
    pending: "bg-yellow-500",
    assigned: "bg-blue-500",
    'in-progress': "bg-purple-500",
    material_needed: "bg-orange-500",
    resolved: "bg-green-500",
    closed: "bg-gray-500"
  }

  const handleFeedbackSubmit = () => {
    if (feedback.rating === 0) {
      alert("Please provide a rating.")
      return
    }
    updateComplaint(complaint._id, { feedback })
  }

  const handleResolutionSubmit = (resolution) => {
    updateComplaint(complaint._id, { resolution })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{complaint.title}</CardTitle>
          <div className="flex space-x-2">
            <Badge className={priorityColors[complaint.priority]}>{complaint.priority}</Badge>
            <Badge className={priorityColors[complaint.priority]}>{complaint.priority}</Badge>
            <Badge className={statusColors[complaint.status]}>
              <span className="mr-1">{statusIcons[complaint.status]}</span>
              {complaint.status}
            </Badge>
          </div>
        </div>
        <CardDescription>
          {complaint.category} {complaint.subCategory && `- ${complaint.subCategory}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{complaint.description}</p>
        <p className="text-sm text-gray-500">Location: {complaint.location}</p>
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="details">
            <AccordionTrigger>View Details</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p><strong>Created:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
                <p><strong>Updated:</strong> {new Date(complaint.updatedAt).toLocaleString()}</p>
                {complaint.estimatedCost && <p><strong>Estimated Cost:</strong> ${complaint.estimatedCost}</p>}
                {complaint.actualCost && <p><strong>Actual Cost:</strong> ${complaint.actualCost}</p>}
                {complaint.assignedWorker && <p><strong>Assigned Worker:</strong> {complaint.assignedWorker}</p>}
                {complaint.photos && complaint.photos.length > 0 && (
                  <div>
                    <strong>Photos:</strong>
                    <div className="flex space-x-2 mt-2">
                      {complaint.photos.map((photo) => (
                        <img key={photo} src={photo} alt={`Complaint photo`} className="w-20 h-20 object-cover rounded" />
                      ))}
                    </div>
                  </div>
                )}
                {complaint.resolution && (
                  <div>
                    <strong>Resolution:</strong>
                    <p>{complaint.resolution}</p>
                  </div>
                )}
                {complaint.feedback && (
                  <div>
                    <strong>Feedback:</strong>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={`feedback-star-${i}`} className={`w-5 h-5 ${i < complaint.feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-2">{complaint.feedback.rating}/5</span>
                    </div>
                    <p>{complaint.feedback.comment}</p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!complaint.feedback && (complaint.status === 'resolved' || complaint.status === 'closed') && (
          <div className="space-y-2 w-full">
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon 
                  key={`rating-star-${i}`} 
                  className={`w-6 h-6 cursor-pointer ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => setFeedback({ ...feedback, rating: i + 1 })}
                />
              ))}
            </div>
            <Textarea 
              placeholder="Leave a comment..." 
              value={feedback.comment}
              onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
            />
            <Button onClick={handleFeedbackSubmit} className="w-full">Submit Feedback</Button>
          </div>
        )}
        {!complaint.resolution && complaint.status !== 'resolved' && complaint.status !== 'closed' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Add Resolution</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Resolution</DialogTitle>
                <DialogDescription>
                  Provide details about how the complaint was resolved.
                </DialogDescription>
              </DialogHeader>
              <Textarea id={`resolution-${complaint._id}`} placeholder="Enter resolution details..." />
              <DialogFooter>
                <Button onClick={() => {
                  const resolutionText = document.getElementById(`resolution-${complaint._id}`).value
                  if (!resolutionText.trim()) {
                    alert("Resolution cannot be empty.")
                    return
                  }
                  handleResolutionSubmit(resolutionText)
                }}>
                  Submit Resolution
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  )
}
