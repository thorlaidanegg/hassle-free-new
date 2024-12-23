'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'


const AddMemberForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter();
  const socId = Cookies.get('SocietyId')
  const token = Cookies.get('AdminAccessToken')

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/user?societyId=${socId}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      toast({
        title: "Success",
        description: "Email has been successfully sent to user",
      })
      router.push("/admin/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email', { required: 'Email is required' })} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" {...register('age', { required: 'Age is required', min: 18 })} />
            {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="houseNo">House No</Label>
              <Input id="houseNo" {...register('houseNo', { required: 'House No is required' })} />
              {errors.houseNo && <p className="text-red-500 text-sm">{errors.houseNo.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="flatNo">Flat No</Label>
              <Input id="flatNo" {...register('flatNo', { required: 'Flat No is required' })} />
              {errors.flatNo && <p className="text-red-500 text-sm">{errors.flatNo.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="photoUrl">Photo URL</Label>
            <Input id="photoUrl" {...register('photo.url', { required: 'Photo URL is required' })} />
            {errors.photo?.url && <p className="text-red-500 text-sm">{errors.photo.url.message}</p>}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" className="w-full">Add Member</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  An email will be sent to the user with their credentials.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit(onSubmit)}>Proceed</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddMemberForm

