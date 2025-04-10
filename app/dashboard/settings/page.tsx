"use client";

import { useAuth } from "@/context/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserType } from "@/types/user";

export default function SettingsPage() {
  const { user } = useAuth();

  if (!user) return null;

  const getPlanColor = (type: UserType) => {
    switch (type) {
      case "free":
        return "bg-gray-500";
      case "pro":
        return "bg-purple-500";
      case "enterprise":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="text-lg font-medium">{user.userName}</p>
            </div>
            <Button variant="outline">Change</Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
            <Button variant="outline">Change</Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Plan</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium capitalize">
                  {user.userType}
                </p>
                <Badge className={getPlanColor(user.userType)}>
                  {user.userType === "free"
                    ? "Free Plan"
                    : user.userType === "pro"
                      ? "Pro Plan"
                      : "Enterprise Plan"}
                </Badge>
              </div>
            </div>
            {user.userType !== "enterprise" && <Button>Upgrade Plan</Button>}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="text-lg font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
