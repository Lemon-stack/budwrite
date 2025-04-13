import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const payload = JSON.parse(body);
    console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

    if (
      payload.type === "checkout.updated" &&
      payload.data.status === "succeeded"
    ) {
      console.log("Processing successful checkout.updated event");

      const session = payload.data;
      console.log("Session data:", JSON.stringify(session, null, 2));

      try {
        // Try to get metadata from both possible locations
        const metadata = session.metadata || session.customer_metadata;
        console.log("Raw metadata:", metadata);

        if (!metadata) {
          console.error("No metadata found in session");
          throw new Error("No metadata found in session");
        }

        // Parse metadata if it's a string
        const parsedMetadata =
          typeof metadata === "string" ? JSON.parse(metadata) : metadata;
        console.log("Parsed metadata:", parsedMetadata);

        const { userId, amount } = parsedMetadata;
        console.log("Extracted userId:", userId, "amount:", amount);
        console.log("userId type:", typeof userId);
        console.log("userId length:", userId?.length);

        if (!userId || !amount) {
          console.error(
            "Missing userId or amount in metadata:",
            parsedMetadata
          );
          throw new Error("Missing required metadata");
        }

        // Get current credits using server-side Supabase client
        console.log("Creating Supabase client...");
        const supabase = await createClient();

        console.log("Fetching current user credits for userId:", userId);
        const { data: userData, error: fetchError } = await supabase
          .from("users")
          .select("id, credits")
          .eq("id", userId)
          .single();

        if (fetchError) {
          console.error("Error fetching user credits:", fetchError);
          console.error("Error details:", {
            code: fetchError.code,
            message: fetchError.message,
            details: fetchError.details,
            hint: fetchError.hint,
          });

          // Try to find any user with this ID to debug
          const { data: allUsers, error: listError } = await supabase
            .from("users")
            .select("id")
            .limit(5);

          console.log("First 5 users in database:", allUsers);
          throw new Error(
            `Failed to fetch user credits: ${fetchError.message}`
          );
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
        "Ignoring event:",
        payload.type,
        "with status:",
        payload.data?.status
      );
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook processing failed", { status: 500 });
  }
}
