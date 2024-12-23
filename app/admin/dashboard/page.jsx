'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Building2, Car, FileText, Plus, MapPin } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [societyDetails, setSocietyDetails] = useState(null);
  
  const stats = {
    users: 120,          // Hardcoded value
    amenities: 15,       // Hardcoded value
    vehicles: 45,        // Hardcoded value
    complaints: 8        // Hardcoded value
  };

  const socId = Cookies.get('SocietyId');
  const accessToken = Cookies.get('AdminAccessToken');

  const getSocietyDetails = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/society?societyId=${socId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setSocietyDetails(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch society details');
      setLoading(false);
    }
  };

  useEffect(() => {
    getSocietyDetails();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="h-8 w-8" />} title="Users" value={stats.users} />
        <StatCard icon={<Building2 className="h-8 w-8" />} title="Amenities" value={stats.amenities} />
        <StatCard icon={<Car className="h-8 w-8" />} title="Vehicles" value={stats.vehicles} />
        <StatCard icon={<FileText className="h-8 w-8" />} title="Complaints" value={stats.complaints} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Society Details</CardTitle>
          </CardHeader>
          <CardContent>
            {societyDetails ? (
              <div className="space-y-2">
                <p><strong>Name:</strong> {societyDetails.name}</p>
                <p><strong>Address:</strong> {societyDetails.address}</p>
                <p><strong>Pincode:</strong> {societyDetails.pincode}</p>
                <div className="flex items-center mt-4">
                  <MapPin className="mr-2" />
                  <span>{societyDetails.location.latitude}, {societyDetails.location.longitude}</span>
                </div>
              </div>
            ) : (
              <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">No Image Available</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Skeleton className="h-10 w-3/4 max-w-sm" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[120px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-[200px]" />
        </CardContent>
      </Card>
    </div>
  );
}
