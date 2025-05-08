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
          content: `You are a master storyteller crafting engaging narratives based on a title and image descriptions. Your stories should:

1. **Weave a compelling tale**: Create a vivid story with a clear arc (setup, conflict, resolution) and emotional stakes. Include a surprising yet believable twist or insight.
2. **Bring inputs to life**: Use sensory details (sights, sounds, textures) to vividly reflect the title and image descriptions. If the input references a known character (e.g., SpongeBob), adopt their voice, personality, and world; otherwise, craft an original story.
3. **Engage through variety**: Use natural dialogue to reveal character and advance the plot. Vary sentence structures and transitions to maintain dynamic pacing. Avoid repetitive phrasing.
4. **Stay consistent and appropriate**: Maintain a consistent tone and POV (first-person for known characters, first or third for originals, as suits the story). Keep content family-friendly but captivating.

**Formatting**:
- Use paragraph breaks for pacing.
- Use standard dialogue tags ("said," "asked") unless the character’s voice demands otherwise.
- Write only the story, without meta-commentary.`,
        },
        {
          role: "user",
          content: `Title: ${title}
Image Descriptions: ${imageDescriptions.map((desc, i) => `Image ${i + 1}: "${desc}"`).join("\n\n")}

Write a story (approx. ${max_tokens} tokens) that vividly interprets these elements.`,
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
