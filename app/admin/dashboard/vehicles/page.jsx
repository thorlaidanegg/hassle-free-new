'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Car, Video, History, CheckCircle2, XCircle } from 'lucide-react'

export default function DashboardControls() {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const router = useRouter()

  // Simulate camera status check
  useEffect(() => {
    const checkCameraStatus = () => {
      setIsCameraActive(Math.random() > 0.5)
    }
    
    const interval = setInterval(checkCameraStatus, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const handleAuthorizedVehicles = () => {
    router.push('/admin/dashboard/vehicles/authVehicles')
  }

  const handleRealtimeEntry = () => {
    if (isCameraActive) {
      router.push('/admin/dashboard/vehicles/realtime-entry')
    }
  }

  const handleHistory = () => {
    router.push('/entry-history')
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Dashboard Controls</h2>
      
      <Alert className={`mb-6 ${isCameraActive ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
        <AlertTitle className="flex items-center">
          {isCameraActive ? (
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
          )}
          Camera Status
        </AlertTitle>
        <AlertDescription>
          {isCameraActive ? 'Camera is online and active.' : 'Camera is offline. Realtime entry is disabled.'}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="dark:bg-gray-800">
          <CardContent className="p-6">
            <Button
              variant="outline"
              className="w-full h-24 text-xl font-semibold rounded-lg border-2 border-blue-500 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-white transition-colors"
              onClick={handleAuthorizedVehicles}
            >
              <Car className="w-8 h-8 mr-4" />
              Authorized Vehicles
            </Button>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800">
          <CardContent className="p-6">
            <Button
              variant="outline"
              className={`w-full h-24 text-xl font-semibold rounded-lg border-2 transition-colors ${
                isCameraActive
                  ? "border-green-500 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 dark:text-white"
                  : "border-gray-300 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
              onClick={handleRealtimeEntry}
              disabled={!isCameraActive}
            >
              <Video className="w-8 h-8 mr-4" />
              Realtime Entry
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 dark:bg-gray-800">
        <CardContent className="p-6">
          <Button
            variant="outline"
            className="w-full h-16 text-lg font-semibold rounded-lg border-2 border-purple-500 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 dark:text-white transition-colors"
            onClick={handleHistory}
          >
            <History className="w-6 h-6 mr-2" />
            View Entry History
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

