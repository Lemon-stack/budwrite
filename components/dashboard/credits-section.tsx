"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";

export function CreditsSection({ user }: { user: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);

  const handleBuyCredits = async (productId: string, amount: number) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Create query parameters for Polar checkout
      const params = new URLSearchParams({
        productId,
        customerEmail: user.email,
        customerName: user.user_metadata?.name || "",
        customerExternalId: user.id,
        metadata: JSON.stringify({
          userId: user.id,
          amount: amount,
        }),
      });

      // Redirect to Polar checkout
      window.location.href = `/api/polar/create-checkout?${params.toString()}`;
    } catch (error) {
      toast.error("Failed to initiate purchase");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Credits</p>
              <p className="text-2xl font-bold">{credits}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() =>
                handleBuyCredits(
                  process.env.NEXT_PUBLIC_POLAR_PRODUCT_5_CREDITS!,
                  5
                )
              }
              disabled={isLoading}
            >
              Buy 5 Credits ($5)
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                handleBuyCredits(
                  process.env.NEXT_PUBLIC_POLAR_PRODUCT_10_CREDITS!,
                  10
                )
              }
              disabled={isLoading}
            >
              Buy 10 Credits ($10)
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                handleBuyCredits(
                  process.env.NEXT_PUBLIC_POLAR_PRODUCT_20_CREDITS!,
                  20
                )
              }
              disabled={isLoading}
            >
              Buy 20 Credits ($20)
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                handleBuyCredits(
                  process.env.NEXT_PUBLIC_POLAR_PRODUCT_50_CREDITS!,
                  50
                )
              }
              disabled={isLoading}
            >
              Buy 50 Credits ($50)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
