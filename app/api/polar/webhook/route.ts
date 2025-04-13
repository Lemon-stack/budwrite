import { NextResponse } from "next/server";
import { createClient } from "@polar-sh/sdk";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const polar = createClient({
  apiKey: process.env.POLAR_API_KEY!,
});

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const sig = req.headers.get("polar-signature");
    if (!sig) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const body = await req.text();
    const event = polar.webhooks.constructEvent(
      body,
      sig,
      process.env.POLAR_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { userId, amount } = session.metadata;

      // Update user's credits in the database
      const { error } = await supabase.rpc("increment_credits", {
        user_id: userId,
        amount: parseInt(amount),
      });

      if (error) {
        console.error("Error updating credits:", error);
        return NextResponse.json(
          { error: "Failed to update credits" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
