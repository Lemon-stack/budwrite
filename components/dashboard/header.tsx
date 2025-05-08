"use client";

import { Bell, Search, Wifi } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeSwitcher } from "../theme-switcher";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import Logo from "../logo";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { NetworkStatusDialog } from "../network-status-dialog";
import { useState } from "react";

export function Header() {
  const { signOut, user } = useAuth();
  const networkStatus = useNetworkStatus();
  const [showNetworkDialog, setShowNetworkDialog] = useState(false);

  const getStatusColor = () => {
    if (!networkStatus.isOnline) return "text-red-500";
    switch (networkStatus.strength) {
      case "strong":
        return "text-green-500";
      case "good":
        return "text-yellow-500";
      case "weak":
        return "text-red-500";
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-primary-foreground px-4 md:px-6">
      <Logo />
      {user && (
        <>
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="h-6" />
        </>
      )}

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setShowNetworkDialog(true)}
        >
          <Wifi className={`h-5 w-5 ${getStatusColor()}`} />
          <span className="sr-only">Network Status</span>
        </Button>
        <ThemeSwitcher />
        <Button variant="ghost" size="icon" className="rounded-full hidden">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="/placeholder.svg?height=36&width=36"
                  alt="User"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <NetworkStatusDialog
        open={showNetworkDialog}
        onOpenChange={setShowNetworkDialog}
        status={networkStatus}
      />
    </header>
  );
}
