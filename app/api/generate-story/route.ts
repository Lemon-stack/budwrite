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
    const { imageUrls, title } = await request.json();
    console.log("Received request with:", { imageUrls, title });

    if (!imageUrls || imageUrls.length === 0) {
      console.error("Missing required fields:", { imageUrls });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // First, analyze images using Llama 4 Maverick
    console.log("Analyzing images with Llama 4 Maverick");
    const imageAnalysisPromises = imageUrls.map(async (imageUrl: string) => {
      try {
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

        if (
          !completion ||
          !completion.choices ||
          completion.choices.length === 0
        ) {
          console.error("Invalid response from Llama for image:", imageUrl);
          return `Unable to analyze image ${imageUrl}. Please try again.`;
        }

        const description = completion.choices[0].message?.content;
        if (!description) {
          console.error(
            "No description received from Llama for image:",
            imageUrl
          );
          return `Unable to analyze image ${imageUrl}. Please try again.`;
        }

        return description;
      } catch (error) {
        console.error("Error analyzing image with Llama:", {
          imageUrl,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        return `Error analyzing image ${imageUrl}. Please try again.`;
      }
    });

    const imageDescriptions = await Promise.all(imageAnalysisPromises);
    console.log("Image descriptions:", imageDescriptions);

    // Check if we have any valid descriptions
    const validDescriptions = imageDescriptions.filter(
      (desc) =>
        !desc.includes("Unable to analyze") && !desc.includes("Error analyzing")
    );

    if (validDescriptions.length === 0) {
      console.error("No valid image descriptions were generated");
      return NextResponse.json(
        {
          error: "Failed to analyze any images. Please try again.",
          toast:
            "Failed to analyze the image. Please try again with a different image.",
        },
        { status: 500 }
      );
    }

    // Then generate story using Llama 4 Maverick
    console.log("Generating story with Llama 4 Maverick");
    const storyCompletion = await openai.chat.completions.create({
      model: "meta-llama/llama-4-maverick:free",
      messages: [
        {
          role: "system",
          content: `You are a creative storyteller who crafts engaging, unique narratives. Your task is to create a story based on the provided image descriptions and title. The story should:
1. Have a clear narrative arc with emotional depth
2. Use vivid sensory details and natural dialogue
3. Develop interesting characters and relationships
4. Include unexpected twists or insights
5. Maintain consistent tone and perspective
6. Be suitable for all ages but not overly simplistic

Format the story with proper paragraph breaks and dialogue formatting. Do not include any meta-commentary or instructions in your response - just the story itself.`,
        },
        {
          role: "user",
          content: `Title: ${title}\n\nImage Descriptions:\n${validDescriptions.map((desc: string, i: number) => `Image ${i + 1}: "${desc}"`).join("\n\n")}\n\nPlease write a creative and engaging story that incorporates elements from all the images.`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    console.log("Story generation response:", storyCompletion);

    if (
      !storyCompletion ||
      !storyCompletion.choices ||
      storyCompletion.choices.length === 0
    ) {
      console.error("Invalid response format from Llama:", storyCompletion);
      return NextResponse.json(
        {
          error: "Failed to generate story",
          toast: "Failed to generate the story. Please try again.",
        },
        { status: 500 }
      );
    }

    const story = storyCompletion.choices[0].message?.content;

    if (!story) {
      console.error("No story content received from Llama");
      return NextResponse.json(
        {
          error: "No story content received from Llama",
          toast: "Failed to generate the story. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      content: story,
      imageDescriptions: validDescriptions,
    });
  } catch (error) {
    console.error("Error generating story:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Failed to generate story",
        toast: "An unexpected error occurred. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
