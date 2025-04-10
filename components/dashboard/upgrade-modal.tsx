"use client";

import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface UpgradeModalProps {
  userType: "free" | "pro" | "enterprise";
  isVisible: boolean;
  onClose?: () => void;
}

export default function UpgradeModal({
  userType = "free",
  isVisible = false,
  onClose,
}: UpgradeModalProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md rounded-lg flex flex-col items-center justify-center z-30 p-8 space-y-4 border border-purple-500/20 shadow-xl">
      <Lock className="h-12 w-12 text-purple-400" />
      <h2 className="text-2xl font-bold text-white">
        Upgrade to {userType === "free" ? "Pro" : "Enterprise"}
      </h2>
      <p className="text-center text-gray-300 max-w-md">
        You've reached the limit of your current plan. Upgrade to continue
        reading the full story.
      </p>
      <Button
        variant="default"
        size="lg"
        className="bg-purple-500 hover:bg-purple-600 gap-2"
      >
        Upgrade Now
      </Button>

      {onClose && (
        <button
          onClick={onClose}
          className="mt-2 text-gray-400 hover:text-gray-300 text-sm"
        >
          Maybe Later
        </button>
      )}
    </div>
  );
}
