import { NextResponse } from "next/server";
import { Checkout } from "@polar-sh/nextjs";

export const POST = Checkout({
  accessToken: process.env.POLAR_API_KEY!,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
  server: "sandbox",
});
