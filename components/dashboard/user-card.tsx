"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/context/auth";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface UserCardProps {
  planType?: "Free" | "Pro" | "Enterprise";
  onCreateStory?: () => void;
}

export function UserCard({
  planType = "Free",
  onCreateStory = () => console.log("Create story clicked"),
}: UserCardProps) {
  const { user, credits } = useAuth();
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    if (user) {
      // Use the user's name if available, otherwise use email prefix
      const name = user.email?.split("@")[0] || "";
      setDisplayName(name);
    }
  }, [user]);

  if (!user) return null;

  return (
    <Card className="w-full bg-transparent border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-2">
        <div className="flex flex-col justify-between">
          <div>
            <span className="font-medium text-lg dark:text-white text-gray-900">
              {displayName}
            </span>
            <div className="flex items-center mt-1 text-sm dark:text-gray-300 text-gray-600">
              <Sparkles className="h-4 w-4 text-purple-500 mr-1" />
              {credits} credits
            </div>
          </div>
          <Link href="/dashboard/settings#credits-pay" className="ml-auto">
            <Button variant="outline" size="sm" className="text-xs px-3 py-1">
              Buy More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
