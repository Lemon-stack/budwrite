"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ProfileSection({ user }: { user: any }) {
  const { supabase } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(
    user.name || user.email?.split("@")[0] || ""
  );
  const [email, setEmail] = useState(user.email || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleUpdateProfile = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // Check if there are any changes
    if (name === user.email?.split("@")[0]) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name },
      });

      if (error) throw error;

      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
            placeholder="Enter your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={email}
            disabled
            placeholder="Enter your email"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUpdateProfile} disabled={isUpdating}>
            {isEditing
              ? isUpdating
                ? "Updating..."
                : "Update Profile"
              : "Edit Profile"}
          </Button>
          {isEditing && (
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setName(user.name || user.email?.split("@")[0] || "");
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
