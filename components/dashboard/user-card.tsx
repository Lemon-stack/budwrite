"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/context/auth";
import { Button } from "../ui/button";
import { Crown } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface UserCardProps {
  planType?: "free" | "pro";
  onCreateStory?: () => void;
}

export function UserCard({
  planType = "free",
  onCreateStory = () => console.log("Create story clicked"),
}: UserCardProps) {
  const { user } = useAuth();
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
            <div className="flex items-center mt-1">
              <Badge
                variant={planType === "pro" ? "default" : "secondary"}
                className="text-sm flex rounded-sm items-center justify-between"
              >
                <Crown className="h-4 w-4 text-yellow-500 mr-2" />
                {planType === "pro" ? "Pro Plan" : "Free Plan"}
              </Badge>
            </div>
          </div>
          {planType === "free" && (
            <Link href="/settings#subscription" className="w-full mt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-base w-full px-3 py-3 bg-purple-500 text-white"
              >
                Upgrade to Pro
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
