"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, MoreHorizontal } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

// Sample data - in a real app, this would come from your API
const recentStories = [
  {
    id: "ST-1234",
    title: "The Mountain Journey",
    user: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    genre: "Adventure",
    status: "published",
    date: "2 hours ago",
    wordCount: 842
  },
  {
    id: "ST-1235",
    title: "Whispers in the Forest",
    user: {
      name: "Michael Chen",
      email: "michael@example.com",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    genre: "Mystery",
    status: "published",
    date: "4 hours ago",
    wordCount: 1024
  },
  {
    id: "ST-1236",
    title: "The Lost City",
    user: {
      name: "Alex Rodriguez",
      email: "alex@example.com",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    genre: "Fantasy",
    status: "published",
    date: "6 hours ago",
    wordCount: 756
  },
  {
    id: "ST-1237",
    title: "Starlight Dreams",
    user: {
      name: "Emily Wilson",
      email: "emily@example.com",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    genre: "Sci-Fi",
    status: "flagged",
    date: "8 hours ago",
    wordCount: 932
  },
  {
    id: "ST-1238",
    title: "Sunset Memories",
    user: {
      name: "David Kim",
      email: "david@example.com",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    genre: "Romance",
    status: "published",
    date: "10 hours ago",
    wordCount: 678
  }
]

export function RecentStoriesTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Story</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Words</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentStories.map((story) => (
            <TableRow key={story.id}>
              <TableCell className="font-medium">{story.title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={story.user.avatar} alt={story.user.name} />
                    <AvatarFallback>{story.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{story.user.name}</span>
                </div>
              </TableCell>
              <TableCell>{story.genre}</TableCell>
              <TableCell>
                <Badge variant={story.status === "published" ? "outline" : "destructive"}>
                  {story.status}
                </Badge>
              </TableCell>
              <TableCell>{story.date}</TableCell>
              <TableCell>{story.wordCount}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit story</DropdownMenuItem>
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
