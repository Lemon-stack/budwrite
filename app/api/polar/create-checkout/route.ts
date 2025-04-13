import { NextResponse } from "next/server";
import { createClient } from "@polar-sh/sdk";

const polar = createClient({
  apiKey: process.env.POLAR_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a checkout session with Polar.sh
    const session = await polar.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?canceled=true`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${amount} Credits`,
              description: "Story generation credits for PictoStory",
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        amount,
      },
      mode: "payment",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
