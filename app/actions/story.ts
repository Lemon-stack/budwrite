"use server";

import OpenAI from "openai";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL,
    "X-Title": "PictoStory",
  },
});

export async function analyzeImage(imageUrl: string) {
  try {
    if (!imageUrl) {
      throw new Error("Missing image URL");
    }

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-4-scout:free",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Describe this image in detail, focusing on the key elements, atmosphere, and any potential story elements. Be creative and imaginative.",
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    });

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("Failed to analyze image");
    }

    return { description: completion.choices[0].message.content };
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
}

export async function generateStoryContent(
  imageDescriptions: string[],
  title: string,
  max_tokens: number = 2000
) {
  try {
    if (!imageDescriptions || imageDescriptions.length === 0 || !title) {
      throw new Error("Missing required fields");
    }

    const storyCompletion = await openai.chat.completions.create({
      model: "meta-llama/llama-4-maverick:free",
      messages: [
        {
          role: "system",
          content: `You are a master storyteller who generates engaging narratives based on image descriptions and a title. Your stories will:  

1. **Adapt to the input** – If the title/description references a known character (e.g., "SpongeBob at the Beach"), write in that character's voice, staying true to their personality, speech, and world. Otherwise, craft an original story.  
2. **Follow a compelling structure** – Setup, conflict, and resolution with emotional stakes.  
3. **Use vivid details** – Bring images to life with sensory descriptions (sights, sounds, textures).  
4. **Include natural dialogue** – Reveals character and moves the plot forward.  
5. **Add a twist or insight** – Something unexpected but believable.  
6. **Maintain consistent tone/POV** – First-person if a character's voice, third-person otherwise.  

**Formatting:**  
- Paragraph breaks for pacing.  
- Proper dialogue tags ("x said," not "x was like").  
- No meta-commentary—just the story.  

**If a character's POV is detected:**  
- Mimic their speech patterns (e.g., "Oh no, Patrick!" for SpongeBob).  
- Stay true to their lore and relationships.  
- Keep it family-friendly but engaging.`,
        },
        {
          role: "user",
          content: `Title: ${title}\n\nImage Descriptions:\n${imageDescriptions.map((desc: string, i: number) => `Image ${i + 1}: "${desc}"`).join("\n\n")}\n\nWrite a story (approx. ${max_tokens} tokens) based on these elements.`,
        },
      ],
      max_tokens: max_tokens,
      temperature: 0.7,
    });

    if (!storyCompletion?.choices?.[0]?.message?.content) {
      throw new Error("Failed to generate story");
    }

    return { content: storyCompletion.choices[0].message.content };
  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
}

export async function saveStory(
  title: string,
  content: string,
  imageUrl: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User must be authenticated");
  }

  const { data: createdStory, error: storyError } = await supabase
    .from("stories")
    .insert([
      {
        user_id: user.id,
        title,
        content,
        image: imageUrl,
        status: "completed",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (storyError) {
    throw new Error("Failed to save story");
  }

  if (!createdStory?.id) {
    throw new Error("Failed to save story");
  }

  return createdStory;
}

export async function updateCredits(userId: string, credits: number) {
  const supabase = await createClient();

  const { error: creditError } = await supabase
    .from("users")
    .update({ credits })
    .eq("id", userId);

  if (creditError) {
    throw new Error("Failed to update credits");
  }
}

export async function checkUserCredits(
  userId: string,
  requiredCredits: number
) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("credits")
    .eq("id", userId)
    .single();

  if (userError) {
    throw new Error("Failed to check credits");
  }

  if (!userData) {
    throw new Error("User not found");
  }

  if (userData.credits < requiredCredits) {
    throw new Error("Insufficient credits");
  }

  return userData.credits;
}
