import { Webhooks } from "@polar-sh/nextjs";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    if (payload.type === "checkout.session.completed") {
      const session = payload.data.object;
      const { userId, amount } = session.metadata;

      // Update user's credits in the database
      const { error } = await supabase.rpc("increment_credits", {
        user_id: userId,
        amount: parseInt(amount),
      });

      if (error) {
        console.error("Error updating credits:", error);
        throw new Error("Failed to update credits");
      }
    }
  },
});
