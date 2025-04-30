"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { Badge } from "../ui/badge";

export function CreditsSection({ user }: { user: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const { credits } = useAuth();

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
    <Card className="w-full max-w-2xl mx-auto shadow-md">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Credits</CardTitle>
            <CardDescription>Purchase credits to use</CardDescription>
          </div>
          <div className="bg-primary/10 px-4 py-2 mr-auto md:mr-0 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">
              Current Balance
            </p>
            <p className="text-lg font-bold text-primary">{credits}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PricingCard
              title="Starter"
              credits={36}
              price={2}
              description="Quick try or casual users"
              onClick={() =>
                handleBuyCredits(
                  process.env.NEXT_PUBLIC_POLAR_PRODUCT_36_CREDITS!,
                  2
                )
              }
              isLoading={isLoading}
            />

            <PricingCard
              title="Creator"
              credits={50}
              price={3}
              description="Great storytellers"
              onClick={() =>
                handleBuyCredits(
                  process.env.NEXT_PUBLIC_POLAR_PRODUCT_50_CREDITS!,
                  50
                )
              }
              isLoading={isLoading}
            />

            <PricingCard
              title="Pro"
              credits={120}
              price={7}
              description="Obsessed storytellers"
              onClick={() =>
                handleBuyCredits(
                  process.env.NEXT_PUBLIC_POLAR_PRODUCT_120_CREDITS!,
                  120
                )
              }
              isLoading={isLoading}
              popular
            />

            <PricingCard
              title="Studio"
              credits={260}
              price={12}
              description="Epic creators"
              onClick={() =>
                handleBuyCredits(
                  process.env.NEXT_PUBLIC_POLAR_PRODUCT_260_CREDITS!,
                  260
                )
              }
              isLoading={isLoading}
              bestValue
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface PricingCardProps {
  title: string;
  credits: number;
  price: number;
  description: string;
  onClick: () => void;
  isLoading: boolean;
  popular?: boolean;
  bestValue?: boolean;
}

function PricingCard({
  title,
  credits,
  price,
  description,
  onClick,
  isLoading,
  popular,
  bestValue,
}: PricingCardProps) {
  return (
    <div
      className={`relative border rounded-xl p-5 transition-all hover:border-primary/50 hover:shadow-md ${popular ? "border-primary/70 bg-primary/5" : ""} ${bestValue ? "border-primary/70 bg-primary/5" : ""}`}
    >
      {popular && (
        <Badge className="absolute -top-2 right-3 bg-primary">Popular</Badge>
      )}
      {bestValue && (
        <Badge className="absolute -top-2 right-3 bg-primary">Best Value</Badge>
      )}

      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold">{credits}</span>
            <span className="text-muted-foreground">credits</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="text-lg font-semibold">${price}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        <div className="mt-auto">
          <Button
            className="w-full"
            onClick={onClick}
            disabled={isLoading}
            variant={popular || bestValue ? "default" : "outline"}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
