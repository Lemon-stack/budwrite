import {
  BookOpen,
  ChevronRight,
  Home,
  PenSquare,
  Settings,
  Star,
  User,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Logo from "../logo";
import { StoryHistory } from "./story-history";
import { UserCard } from "./user-card";

// Navigation items for the sidebar
const navItems = [
  {
    title: "Home",
    icon: Home,
    href: "/dashboard",
  },
  // {
  //   title: "Favorites",
  //   icon: Star,
  //   href: "/dashboard/favorites",
  // },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export default function DasboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="h-16 z-20 justify-center border-b border-sidebar-border flex items-start px-4">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        {/* Navigation Links */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="z-20">
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
              <StoryHistory />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {/* User Card */}
        <UserCard />
        <SidebarRail />
      </SidebarFooter>
    </Sidebar>
  );
}
