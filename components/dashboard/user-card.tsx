"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/context/auth";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

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
  const isLowCredits = credits !== null && credits < 2;

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
            <div className="flex items-center mt-1">
              <Badge
                variant={isLowCredits ? "destructive" : "default"}
                className="text-sm flex rounded-sm items-center justify-between"
              >
                <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
                {credits} credits
              </Badge>
              {isLowCredits && (
                <span className="ml-2 text-sm text-red-500">Low credits</span>
              )}
            </div>
          </div>
          <Link href="/settings#credits-pay" className="w-full mt-4">
            <Button
              variant={isLowCredits ? "destructive" : "outline"}
              size="sm"
              className="text-base w-full px-3 py-3 bg-purple-500 text-white"
            >
              Get More Credits
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
