"use client";

import {
  BookOpen,
  ChevronRight,
  Home,
  PenSquare,
  Settings,
  Star,
  User,
  Wand2,
  Github,
  Twitter,
  Linkedin,
  Mail,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { useAuth } from "@/context/auth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Navigation items for the sidebar
const navItems = [
  {
    title: "Home",
    icon: Home,
    href: "/",
  },
  // {
  //   title: "Favorites",
  //   icon: Star,
  //   href: "/dashboard/favorites",
  // },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

// Social links for the accordion
const socialLinks = [
  {
    title: "Twitter",
    icon: Twitter,
    href: "https://twitter.com/lemonconfidence",
  },
  {
    title: "LinkedIn",
    icon: Linkedin,
    href: "https://linkedin.com/in/lemonconfidence",
  },
  {
    title: "Email",
    icon: Mail,
    href: "mailto:lemonconfidence101@gmail.com",
  },
];

export default function DasboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Sidebar className="mt-16">
      <SidebarContent className={"flex flex-col"}>
        {/* Fixed Navigation Links */}
        <div className="flex-none">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="z-20">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title} className="z-20">
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              {/* socials */}
              <Accordion type="single" collapsible className="w-full py-0">
                <AccordionItem
                  value="social-links"
                  className="border-none py-0 px-2"
                >
                  <AccordionTrigger className="pb-2 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      <span>Quick support</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <SidebarMenu>
                      {socialLinks.map((link) => (
                        <SidebarMenuItem key={link.title}>
                          <SidebarMenuButton asChild>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <link.icon className="h-4 w-4" />
                              <span>{link.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />
        </div>

        {/* Fixed Story History Label */}
        <div className="flex-none">
          <SidebarGroup className="py-0">
            <SidebarGroupLabel className="flex py-0 justify-between items-center">
              <span>Story History</span>
            </SidebarGroupLabel>
          </SidebarGroup>
        </div>

        {/* Scrollable Story History Content */}
        <div className="flex-1 overflow-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <StoryHistory />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {/* User Card */}
        <UserCard />
        <SidebarRail />
      </SidebarFooter>
    </Sidebar>
  );
}
