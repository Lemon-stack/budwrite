import { Webhooks } from "@polar-sh/nextjs";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

    if (payload.type === "checkout.session.completed") {
      console.log("Processing checkout.session.completed event");

      const session = payload.data.object;
      console.log("Session data:", JSON.stringify(session, null, 2));

      try {
        const metadata = JSON.parse(session.metadata);
        console.log("Parsed metadata:", metadata);

        const { userId, amount } = metadata;
        console.log("Extracted userId:", userId, "amount:", amount);

        if (!userId || !amount) {
          console.error("Missing userId or amount in metadata:", metadata);
          throw new Error("Missing required metadata");
        }

        // Get current credits
        console.log("Fetching current user credits for userId:", userId);
        const { data: userData, error: fetchError } = await supabase
          .from("users")
          .select("credits")
          .eq("id", userId)
          .single();

        if (fetchError) {
          console.error("Error fetching user credits:", fetchError);
          throw new Error("Failed to fetch user credits");
        }

        console.log("Current user credits:", userData.credits);
        const newCredits = (userData.credits || 0) + parseInt(amount);
        console.log("New credits to be set:", newCredits);

        // Update user's credits in the database
        console.log("Updating user credits in database");
        const { data: updateData, error: updateError } = await supabase
          .from("users")
          .update({ credits: newCredits })
          .eq("id", userId)
          .select();

        if (updateError) {
          console.error("Error updating credits:", updateError);
          throw new Error("Failed to update credits");
        }

        console.log("Successfully updated credits. New user data:", updateData);
        console.log(
          `Successfully added ${amount} credits to user ${userId}. New total: ${newCredits}`
        );
      } catch (error) {
        console.error("Error processing webhook:", error);
        throw error;
      }
    } else {
      console.log(
        "Ignoring non-checkout.session.completed event:",
        payload.type
      );
    }
  },
});
