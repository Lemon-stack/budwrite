"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  Users,
  ImageIcon,
  BarChart3,
  Clock,
  DollarSign,
  Calendar,
  Filter,
  Download,
  ChevronDown,
  Search,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { MetricCard } from "@/components/admin/metric-card"
import { OverviewChart } from "@/components/admin/overview-chart"
import { ConversionRateChart } from "@/components/admin/conversion-rate-chart"
import { UserActivityChart } from "@/components/admin/user-activity-chart"
import { TopGenresChart } from "@/components/admin/top-genres-chart"
import { RecentStoriesTable } from "@/components/admin/recent-stories-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Logo from "@/components/logo"

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState("7d")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-100 dark:bg-gray-900">
        <Sidebar variant="inset" className="border-r border-gray-200 dark:border-gray-800">
          <SidebarHeader className="px-3 py-2">
            <Link href="/" className="flex items-center gap-2 px-2">
              <Logo/>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <Link href="/admin/dashboard">
                        <BarChart3 className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin/users">
                        <Users className="h-4 w-4" />
                        <span>Users</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin/content">
                        <ImageIcon className="h-4 w-4" />
                        <span>Content</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin/analytics">
                        <BarChart3 className="h-4 w-4" />
                        <span>Analytics</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin/settings">
                        <Users className="h-4 w-4" />
                        <span>Account</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin/settings/billing">
                        <DollarSign className="h-4 w-4" />
                        <span>Billing</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@storyvision.com</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2 md:w-80">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="h-9 md:w-[300px] lg:w-[400px]" />
              </div>
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[300px]">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-[300px] overflow-auto">
                      <DropdownMenuItem className="cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium">New user registered</p>
                          <p className="text-xs text-gray-500">2 minutes ago</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium">Content flagged for review</p>
                          <p className="text-xs text-gray-500">1 hour ago</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium">System update completed</p>
                          <p className="text-xs text-gray-500">Yesterday</p>
                        </div>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-flex">Admin</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {dateRange === "7d" ? "Last 7 days" : dateRange === "30d" ? "Last 30 days" : "Last 90 days"}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setDateRange("7d")}>Last 7 days</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDateRange("30d")}>Last 30 days</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDateRange("90d")}>Last 90 days</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline-flex">Export</span>
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Total Users"
                  value="12,486"
                  change="+14.6%"
                  trend="up"
                  description="vs. previous period"
                  icon={<Users className="h-4 w-4" />}
                />
                <MetricCard
                  title="Stories Generated"
                  value="48,924"
                  change="+32.1%"
                  trend="up"
                  description="vs. previous period"
                  icon={<BookOpen className="h-4 w-4" />}
                />
                <MetricCard
                  title="Images Uploaded"
                  value="67,239"
                  change="+18.3%"
                  trend="up"
                  description="vs. previous period"
                  icon={<ImageIcon className="h-4 w-4" />}
                />
                <MetricCard
                  title="Avg. Processing Time"
                  value="3.2s"
                  change="-0.8s"
                  trend="down"
                  description="vs. previous period"
                  icon={<Clock className="h-4 w-4" />}
                />
              </div>

              <Tabs defaultValue="analytics" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="analytics" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Analytics</CardTitle>
                      <CardDescription>Comprehensive metrics and performance data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Subscription Metrics</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg border p-3">
                              <div className="text-xs text-muted-foreground">Free Users</div>
                              <div className="text-xl font-bold">8,942</div>
                            </div>
                            <div className="rounded-lg border p-3">
                              <div className="text-xs text-muted-foreground">Premium Users</div>
                              <div className="text-xl font-bold">3,544</div>
                            </div>
                            <div className="rounded-lg border p-3">
                              <div className="text-xs text-muted-foreground">Conversion Rate</div>
                              <div className="text-xl font-bold">28.4%</div>
                            </div>
                            <div className="rounded-lg border p-3">
                              <div className="text-xs text-muted-foreground">MRR</div>
                              <div className="text-xl font-bold">$42.8K</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">User Engagement</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg border p-3">
                              <div className="text-xs text-muted-foreground">Avg. Session</div>
                              <div className="text-xl font-bold">8m 24s</div>
                            </div>
                            <div className="rounded-lg border p-3">
                              <div className="text-xs text-muted-foreground">Retention</div>
                              <div className="text-xl font-bold">76.2%</div>
                            </div>
                            <div className="rounded-lg border p-3">
                              <div className="text-xs text-muted-foreground">Stories/User</div>
                              <div className="text-xl font-bold">3.92</div>
                            </div>
                            <div className="rounded-lg border p-3">
                              <div className="text-xs text-muted-foreground">Daily Active</div>
                              <div className="text-xl font-bold">4,218</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">System Performance</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg border p-3">
                              <div className="text-xs text-muted-foreground">API Calls</div>
                              <div className="text-xl font-bold">1.24M</div>
                            </div>
                            <div className="rounded-lg border p-3">
                              <div className="text-xs text-muted-foreground">Error Rate</div>
                              <div className="text-xl font-bold">0.42%</div>
                            </div>
                            <div className="rounded-lg border p-3">
                              <div className="text-xs text-muted-foreground">Avg. Response</div>
                              <div className="text-xl font-bold">1.8s</div>
                            </div>
                            <div className="rounded-lg border p-3">
                              <div className="text-xs text-muted-foreground">Uptime</div>
                              <div className="text-xl font-bold">99.98%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Recent Stories</CardTitle>
                        <CardDescription>Latest stories generated on the platform</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <Filter className="h-3.5 w-3.5" />
                          <span>Filter</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <RecentStoriesTable />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
