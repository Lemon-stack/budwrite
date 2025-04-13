import { NextResponse } from "next/server";
import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.NEXT_POLAR_API_KEY!,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
  server: process.env.NEXT_ENV === "production" ? "production" : "sandbox",
});
