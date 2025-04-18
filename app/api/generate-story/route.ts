import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL,
    "X-Title": "PictoStory",
  },
});

export async function POST(request: Request) {
  try {
    const { descriptions, title, imageUrls } = await request.json();
    console.log("Received request with:", { descriptions, title, imageUrls });

    if (!descriptions || !title || !imageUrls || descriptions.length === 0) {
      console.error("Missing required fields:", {
        descriptions,
        title,
        imageUrls,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Generating story with GPT-4.1-mini");
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are a creative storyteller who crafts engaging, unique narratives. Create a story based on the image descriptions that:
1. Has a clear narrative arc with emotional depth
2. Uses vivid sensory details and natural dialogue
3. Develops interesting characters and relationships
4. Includes unexpected twists or insights
5. Maintains consistent tone and perspective
6. Is suitable for all ages but not overly simplistic

If the provided title is generic or seems like a prompt (e.g., "Generate a story based on this image"), create your own creative title that captures the essence of the story.

Format the story with proper paragraph breaks and dialogue formatting.`,
        },
        {
          role: "user",
          content: `Create a story based on these image descriptions:\n\n${descriptions.map((desc: string, i: number) => `Image ${i + 1}: "${desc}"`).join("\n\n")}\n\nTitle: ${title}\n\nPlease write a creative and engaging story that incorporates elements from all the images.`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    console.log("Story generation response:", completion);

    if (!completion || !completion.choices || completion.choices.length === 0) {
      console.error("Invalid response format from GPT-4.1-mini:", completion);
      throw new Error("Invalid response format from GPT-4.1-mini");
    }

    const story = completion.choices[0].message?.content;

    if (!story) {
      console.error("No story content received from GPT-4.1-mini");
      throw new Error("No story content received from GPT-4.1-mini");
    }

    return NextResponse.json({ content: story });
  } catch (error) {
    console.error("Error generating story:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Failed to generate story",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
