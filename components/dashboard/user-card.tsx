"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserCardProps {
  userName?: string;
  email?: string;
  planType?: "Free" | "Pro" | "Enterprise";
  onCreateStory?: () => void;
}

export function UserCard({
  userName,
  email = "user@example.com",
  planType = "Free",
  onCreateStory = () => console.log("Create story clicked"),
}: UserCardProps) {
  const [displayName, setDisplayName] = useState<string>(userName || "");

  useEffect(() => {
    if (!userName && email) {
      // Generate name from email if userName is not provided
      const generatedName = generateNameFromEmail(email);
      setDisplayName(generatedName);
    } else {
      setDisplayName(userName || "");
    }
  }, [userName, email]);

  // Function to generate a name from email
  const generateNameFromEmail = (email: string): string => {
    // Extract the part before @ and remove special characters
    const namePart = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ");

    // Capitalize each word
    return namePart
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Get color based on plan type
  const getPlanColor = (): string => {
    switch (planType) {
      case "Pro":
        return "bg-blue-100 text-blue-800";
      case "Enterprise":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full max-w-sm border-0 bg-transparent shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-12 w-12 border border-slate-700">
            <AvatarImage src={`https://avatar.vercel.sh/${email}`} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-lg tracking-tight text-white">
              {displayName}
            </span>
            <Badge
              variant="outline"
              className={`text-xs px-2 py-0.5 mt-1 font-medium ${getPlanColor()}`}
            >
              {planType} Plan
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
