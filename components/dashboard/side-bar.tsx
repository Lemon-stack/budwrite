"use client";

import {
  Settings,
  Twitter,
  Linkedin,
  HelpCircle,
  LayoutDashboard,
  FolderOpen,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
import { UserCard } from "./user-card";
import { useAuth } from "@/context/auth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Logo from "../logo";
import { WritingHistory } from "./writing-history";

// Navigation items for the sidebar
const navItems = [
  {
    title: "Home",
    icon: LayoutDashboard,
    href: "/home",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/homee/settings",
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
];

export default function DasboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Sidebar className="">
      <SidebarHeader className="flex justify-center items-start">
        <Logo />
      </SidebarHeader>
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
                      className={
                        pathname === item.href
                          ? "bg-gradient-to-r from-green-600/50 via-green-500/50 via-30% to-sidebar-accent/50 to-95% text-sidebar-accent-foreground"
                          : ""
                      }
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
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />
        </div>

        {/* Fixed Story History Label */}
        <div className="flex-none">
          <SidebarGroup className="py-0">
            <SidebarGroupLabel className="flex py-0 justify-start gap-2 items-center">
              <FolderOpen className="size-4" />
              <span>My Writings</span>
            </SidebarGroupLabel>
          </SidebarGroup>
        </div>

        {/* Scrollable Story History Content */}
        <div className="flex-1 overflow-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <WritingHistory />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <SidebarFooter className="border-t border-sidebar-border">
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
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
