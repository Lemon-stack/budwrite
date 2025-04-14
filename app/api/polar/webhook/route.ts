import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Create a service role client for bypassing RLS
const serviceRoleClient = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const payload = JSON.parse(body);
    // console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

    if (
      payload.type === "checkout.updated" &&
      payload.data.status === "succeeded"
    ) {
      // console.log("Processing successful checkout.updated event");

      const session = payload.data;
      // console.log("Session data:", JSON.stringify(session, null, 2));

      try {
        // Try to get metadata from both possible locations
        const metadata = session.metadata || session.customer_metadata;
        // console.log("Raw metadata:", metadata);

        if (!metadata) {
          console.error("No metadata found in session");
          throw new Error("No metadata found in session");
        }

        // Parse metadata if it's a string
        const parsedMetadata =
          typeof metadata === "string" ? JSON.parse(metadata) : metadata;
        // console.log("Parsed metadata:", parsedMetadata);

        const { userId, amount } = parsedMetadata;
        // console.log("Extracted userId:", userId, "amount:", amount);
        // console.log("userId type:", typeof userId);
        // console.log("userId length:", userId?.length);

        if (!userId || !amount) {
          console.error(
            "Missing userId or amount in metadata:",
            parsedMetadata
          );
          throw new Error("Missing required metadata");
        }

        // Get current credits using server-side Supabase client
        // console.log("Creating Supabase client...");
        // const supabase = await createClient();

        // console.log("Fetching current user credits for userId:", userId);
        const { data: userData, error: fetchError } = await serviceRoleClient
          .from("users")
          .select("id, credits")
          .eq("id", userId)
          .single();

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            // User not found, create new user record
            // console.log("User not found, creating new user record");

            // Get user's email from auth
            const { data: authUser, error: authError } =
              await serviceRoleClient.auth.admin.getUserById(userId);

            if (authError) {
              console.error("Error fetching user from auth:", authError);
              throw new Error(
                `Failed to fetch user from auth: ${authError.message}`
              );
            }

            if (!authUser?.user?.email) {
              console.error("No email found for user:", userId);
              throw new Error("User email not found in auth system");
            }

            const { data: newUser, error: createError } =
              await serviceRoleClient
                .from("users")
                .insert([
                  {
                    id: userId,
                    email: authUser.user.email,
                    credits: parseInt(amount),
                    createdAt: new Date().toISOString(),
                    userType: "free",
                    userName:
                      authUser.user.user_metadata?.full_name ||
                      authUser.user.email.split("@")[0],
                  },
                ])
                .select()
                .single();

            if (createError) {
              console.error("Error creating user:", createError);
              console.error("Error details:", {
                code: createError.code,
                message: createError.message,
                details: createError.details,
                hint: createError.hint,
              });
              console.error("Attempted to create user with data:", {
                id: userId,
                email: authUser.user.email,
                credits: parseInt(amount),
                userName: authUser.user.user_metadata?.full_name,
              });
              throw new Error(
                `Failed to create user record: ${createError.message}`
              );
            }

            // console.log("Successfully created new user with initial credits");
            return new Response("Webhook processed successfully", {
              status: 200,
            });
          }

          console.error("Error fetching user credits:", fetchError);
          throw new Error(
            `Failed to fetch user credits: ${fetchError.message}`
          );
        }

        // User exists, update their credits
        // console.log("Current user credits:", userData.credits);
        const newCredits = (userData.credits || 0) + parseInt(amount);
        // console.log("New credits to be set:", newCredits);

        const { error: updateError } = await serviceRoleClient
          .from("users")
          .update({ credits: newCredits })
          .eq("id", userId);

        if (updateError) {
          console.error("Error updating credits:", updateError);
          throw new Error("Failed to update credits");
        }

        // console.log(
        //   `Successfully added ${amount} credits to user ${userId}. New total: ${newCredits}`
        // );
      } catch (error) {
        console.error("Error processing webhook:", error);
        throw error;
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook processing failed", { status: 500 });
  }
}
