import { NextResponse } from "next/server";
import OpenAI from "openai";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not set in environment variables");
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": "PictoStory",
  },
});

export async function POST(request: Request) {
  try {
    const { description, title } = await request.json();

    if (!description || !title) {
      return NextResponse.json(
        { error: "Description and title are required" },
        { status: 400 }
      );
    }

    console.log(
      "Generating story with description:",
      description.substring(0, 100) + "..."
    );

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-4-maverick:free",
      messages: [
        {
          role: "system",
          content: `You are a creative storyteller. Generate an engaging story based on the given image description and title. 
          
          Formatting rules:
          1. Use proper paragraph breaks (double line breaks between paragraphs)
          2. Include dialogue with proper formatting
          3. Use descriptive language and sensory details
          4. Maintain consistent tense and point of view
          5. Keep paragraphs focused and concise
          6. Use proper punctuation and capitalization
          
          The story should be suitable for all ages and include rich details and character development.`,
        },
        {
          role: "user",
          content: `Create a well-formatted story with the title "${title}" based on this image description: ${description}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      throw new Error("No content generated");
    }

    // Ensure proper paragraph formatting
    const formattedContent = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n\n");

    return NextResponse.json({ content: formattedContent });
  } catch (error) {
    console.error("Error in story generation:", error);
    return NextResponse.json(
      {
        error: "Failed to generate story",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
