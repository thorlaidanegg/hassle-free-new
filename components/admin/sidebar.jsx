'use client'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Cookies from "js-cookie"
import { 
  Home, Bell, UserPlus, Briefcase, Users, 
  MessageSquare, Calendar, FileText, Settings, 
  LogOut as LogoutIcon 
} from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Sidebar({ isMobile = false, onClose }) {
  const router = useRouter();

  const LogOut = () => {
    Cookies.remove('UserAccessToken'); // Remove the access token
    Cookies.remove('SocietyId');
    router.push('/'); // Redirect to the homepage
  }

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Bell, label: 'Announcements', href: '/admin/dashboard/announcements' },
    { icon: UserPlus, label: 'Members', href: '/admin/dashboard/members' },
    { icon: Briefcase, label: 'Amenities', href: '/admin/dashboard/amenities' },
    { icon: Users, label: 'form', href: '/admin/dashboard/user-info' },
    { icon: MessageSquare, label: 'Complaints', href: '/admin/dashboard/complaints' },
    { icon: Calendar, label: 'vehicles', href: '/admin/dashboard/vehicles' },
  ]

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">HassleFree</h1>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start"
              onClick={isMobile ? onClose : undefined}
            >
              <Link href={item.href} className="flex items-center">
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button 
          onClick={LogOut} 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
        >
          <LogoutIcon className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
