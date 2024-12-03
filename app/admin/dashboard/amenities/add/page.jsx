"use client"

import { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Plus, Trash2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"

const amenityTypes = [
  'swimming_pool', 'gym', 'tennis_court', 'squash_court', 'football_field',
  'cricket_pitch', 'clubhouse', 'park', 'basketball_court', 'indoor_games',
  'yoga_room', 'party_hall', 'kids_play_area'
]

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  type: z.enum(amenityTypes),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  capacity: z.number().min(1, { message: "Capacity must be at least 1." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  status: z.enum(['operational', 'maintenance', 'closed']),
  photos: z.array(z.object({
    url: z.string().url({ message: "Please enter a valid URL." }),
    caption: z.string().optional(),
  })).optional(),
  timings: z.array(z.object({
    day: z.enum(daysOfWeek),
    isOpen: z.boolean(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
    maintenanceTime: z.string().optional(),
  })),
  rules: z.array(z.string()).optional(),
  maintenanceSchedule: z.array(z.object({
    date: z.date(),
    description: z.string(),
    duration: z.number().min(1, { message: "Duration must be at least 1 hour." }),
  })).optional(),
  pricing: z.object({
    isChargeable: z.boolean(),
    hourlyRate: z.number().optional(),
    monthlyRate: z.number().optional(),
    yearlyRate: z.number().optional(),
  }),
})

export default function AddAmenitiesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const socId = Cookies.get('SocietyId')
  const accessToken = Cookies.get('AdminAccessToken')

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photos: [],
      timings: daysOfWeek.map(day => ({ day, isOpen: true, openTime: '09:00', closeTime: '18:00' })),
      rules: [],
      maintenanceSchedule: [],
      pricing: { isChargeable: false },
    },
  })

  const { fields: photoFields, append: appendPhoto, remove: removePhoto } = useFieldArray({
    control: form.control,
    name: "photos",
  })

  const { fields: ruleFields, append: appendRule, remove: removeRule } = useFieldArray({
    control: form.control,
    name: "rules",
  })

  const { fields: maintenanceFields, append: appendMaintenance, remove: removeMaintenance } = useFieldArray({
    control: form.control,
    name: "maintenanceSchedule",
  })

  const addAmenity = async (values) => {
    setIsSubmitting(true)
    try {
      // Filter out closed days
      const filteredTimings = values.timings.filter(timing => timing.isOpen)
      const amenityData = {
        ...values,
        timings: filteredTimings,
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/amenities?societyId=${socId}`,
        amenityData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      toast({
        title: "Success",
        description: "Amenity added successfully",
      })
      form.reset()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to add amenity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Amenity</CardTitle>
        <CardDescription>Fill in the details to add a new amenity to your society.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(addAmenity)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Amenity name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select amenity type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amenityTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the amenity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Amenity location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Photos (Optional)</FormLabel>
              {photoFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end mb-4">
                  <FormField
                    control={form.control}
                    name={`photos.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input placeholder="Photo URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`photos.${index}.caption`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input placeholder="Caption (Optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removePhoto(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => appendPhoto({ url: '', caption: '' })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Photo
              </Button>
            </div>
            <div>
              <FormLabel>Timings</FormLabel>
              {daysOfWeek.map((day, index) => (
                <div key={day} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4">
                  <FormField
                    control={form.control}
                    name={`timings.${index}.isOpen`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`timings.${index}.openTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            disabled={!form.watch(`timings.${index}.isOpen`)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`timings.${index}.closeTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            disabled={!form.watch(`timings.${index}.isOpen`)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`timings.${index}.maintenanceTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            disabled={!form.watch(`timings.${index}.isOpen`)}
                            placeholder="Maintenance Time (Optional)"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
            <div>
              <FormLabel>Rules (Optional)</FormLabel>
              {ruleFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end mb-4">
                  <FormField
                    control={form.control}
                    name={`rules.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input placeholder="Rule" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeRule(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => appendRule('')}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Rule
              </Button>
            </div>
            <div>
              <FormLabel>Maintenance Schedule (Optional)</FormLabel>
              {maintenanceFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4">
                  <FormField
                    control={form.control}
                    name={`maintenanceSchedule.${index}.date`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`maintenanceSchedule.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`maintenanceSchedule.${index}.duration`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="Duration (hours)" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeMaintenance(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => appendMaintenance({ date: new Date(), description: '', duration: 1 })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Maintenance Schedule
              </Button>
            </div>
            <div>
              <FormLabel>Pricing</FormLabel>
              <FormField
                control={form.control}
                name="pricing.isChargeable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Chargeable
                      </FormLabel>
                      <FormDescription>
                        Is this amenity chargeable?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch('pricing.isChargeable') && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="pricing.hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pricing.monthlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Rate</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pricing.yearlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yearly Rate</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Amenity
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

