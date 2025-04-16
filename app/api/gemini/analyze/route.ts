import OpenAI from "openai";
import { NextResponse } from "next/server";

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

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function analyzeWithRetry(
  imageUrl: string,
  retries = MAX_RETRIES
): Promise<string> {
  try {
    // console.log("Sending image to LLaMA for analysis...");
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-4-maverick:free",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and provide a detailed description of what you see. Focus on the main subject, setting, and any notable details. Be descriptive and creative in your analysis.",
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

    console.log("Received response from LLaMA");
    const description = completion.choices[0].message.content;
    if (!description) {
      throw new Error("No description generated");
    }
    return description;
  } catch (error) {
    console.error(`Attempt ${MAX_RETRIES - retries + 1} failed:`, error);

    if (retries > 0) {
      console.log(`Retrying in ${RETRY_DELAY}ms...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return analyzeWithRetry(imageUrl, retries - 1);
    }

    throw error;
  }
}

export async function POST(request: Request) {
  try {
    // console.log("Received request to analyze image");
    const { imageUrl } = await request.json();
    // console.log("Image URL length:", imageUrl?.length || 0);

    if (!imageUrl) {
      console.error("No image URL provided");
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const description = await analyzeWithRetry(imageUrl);
    // console.log("Generated description length:", description.length);

    return NextResponse.json({ description });
  } catch (error) {
    console.error("Error in analyze endpoint:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : "Unknown error",
        code:
          error instanceof Error && "code" in error
            ? (error as any).code
            : undefined,
      },
      { status: 500 }
    );
  }
}
