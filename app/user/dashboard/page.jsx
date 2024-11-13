'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Calendar, MapPin } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Cookies from 'js-cookie'


export default function SocietyPage() {
  const [societyDetails, setSocietyDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const socId = Cookies.get('SocietyId')
  const accessToken = Cookies.get('UserAccessToken')

  useEffect(() => {
    const getSocietyDetails = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/society?societyId=${socId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        setSocietyDetails(res.data)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setError('Failed to fetch society details')
        setLoading(false)
      }
    }

    getSocietyDetails()
  }, [])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!societyDetails) {
    return <ErrorState />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <Card className=" mx-auto overflow-hidden shadow-lg">
        <div className="relative h-64 sm:h-80 lg:h-96">
          {societyDetails.photo ? (
            <img
              src={societyDetails.photo}
              alt={societyDetails.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="p-4 sm:p-6 lg:p-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">{societyDetails.name}</h1>
              <Badge variant="secondary" className="text-sm">Residential Society</Badge>
            </div>
          </div>
        </div>
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="grid gap-4 sm:gap-6">
            <div className="flex items-center space-x-2 text-sm sm:text-base">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className="dark:text-gray-300">{societyDetails.address}, {societyDetails.pincode}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm sm:text-base">
              <Calendar className="w-5 h-5 text-green-500" />
              <span className="dark:text-gray-300">Established: {new Date(societyDetails.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <Card className="mx-auto overflow-hidden shadow-lg">
        <Skeleton className="h-64 sm:h-80 lg:h-96 w-full" />
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ErrorState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-semibold mb-2 dark:text-white">Oops Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-300">We cant fetch the society details. Please try again later.</p>
        </CardContent>
      </Card>
    </div>
  )
}