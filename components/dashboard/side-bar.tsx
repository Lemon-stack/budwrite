import { BookOpen, ChevronRight, Home, PenSquare, Settings, Star, User, Wand2 } from 'lucide-react'
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import Logo from '../logo'

// Navigation items for the sidebar
const navItems = [
  {
    title: "Home",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Favorites",
    icon: Star,
    href: "/dashboard/favorites",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
]

// Mock recent stories data
const recentStories = [
  {
    id: "story-1",
    title: "The Mountain Adventure",
    timestamp: "2 hours ago",
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "story-2",
    title: "Ocean Mysteries",
    timestamp: "Yesterday",
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "story-3",
    title: "City Lights",
    timestamp: "3 days ago",
    thumbnail: "/placeholder.svg?height=40&width=40",
  },
]

export default function DasboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border flex items-start px-4">
        <Logo/>
      </SidebarHeader>
      <SidebarContent>
        {/* Navigation Links */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Recent Stories History */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center">
            <span>Story History</span>
          
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentStories.map((story) => (
                <SidebarMenuItem key={story.id}>
                  <SidebarMenuButton asChild>
                    <Link href={`story/${story.id}`} className="py-2">
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-muted mr-2 flex-shrink-0">
                        <img 
                          src={story.thumbnail || "/placeholder.svg"} 
                          alt={story.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-medium">{story.title}</span>
                        <span className="text-xs text-muted-foreground">{story.timestamp}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border">
        {/* User Card */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">User Name</span>
              <span className="text-xs text-muted-foreground">Free Plan</span>
            </div>
          </div>
          <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700">
            <PenSquare className="h-4 w-4" />
            <span>Create New Story</span>
          </Button>
        </div>
        <SidebarRail />
      </SidebarFooter>
    </Sidebar>
  )
}
