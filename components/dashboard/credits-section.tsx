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
                  process.env.NEXT_PUBLIC_POLAR_PRODUCT_3_CREDITS!,
                  3
                )
              }
              disabled={isLoading}
            >
              <div className="text-left">
                <div className="font-semibold">Starter</div>
                <div className="text-xs text-muted-foreground">
                  3 credits • $1.00/credit
                </div>
                <div className="text-xs text-muted-foreground">
                  Quick try or casual users
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                handleBuyCredits(
                  process.env.NEXT_PUBLIC_POLAR_PRODUCT_9_CREDITS!,
                  9
                )
              }
              disabled={isLoading}
            >
              <div className="text-left">
                <div className="font-semibold">Creator</div>
                <div className="text-xs text-muted-foreground">
                  9 credits • $0.78/credit
                </div>
                <div className="text-xs text-muted-foreground">
                  Light storytellers
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                handleBuyCredits(
                  process.env.NEXT_PUBLIC_POLAR_PRODUCT_22_CREDITS!,
                  22
                )
              }
              disabled={isLoading}
            >
              <div className="text-left">
                <div className="font-semibold">Pro</div>
                <div className="text-xs text-muted-foreground">
                  22 credits • $0.68/credit
                </div>
                <div className="text-xs text-muted-foreground">
                  Frequent users
                </div>
              </div>
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
              <div className="text-left">
                <div className="font-semibold">Studio</div>
                <div className="text-xs text-muted-foreground">
                  50 credits • $0.60/credit
                </div>
                <div className="text-xs text-muted-foreground">
                  Power creators & teams
                </div>
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
