"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { ProfileSection } from "@/components/dashboard/profile-section";
import { CreditsSection } from "@/components/dashboard/credits-section";

export default function SettingsPage() {
  const { user } = useAuth();
  // console.log("user", user);
  const router = useRouter();

  // useEffect(() => {
  //   if (!user) {
  //     router.push("/signin");
  //   }
  // }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <ProfileSection user={user} />
        <CreditsSection user={user} />
      </div>
    </div>
  );
}
