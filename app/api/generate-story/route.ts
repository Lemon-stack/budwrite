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
    const { imageUrls, title, max_tokens = 2000 } = await request.json();
    // console.log("Received request with:", { imageUrls, title });

    if (!imageUrls || imageUrls.length === 0) {
      console.error("Missing required fields:", { imageUrls });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // First, analyze images using Llama 4 Maverick
    // console.log("Analyzing images with Llama 4 Maverick");
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
    // console.log("Image descriptions:", imageDescriptions);

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
    // console.log("Generating story with Llama 4 Maverick");
    const storyCompletion = await openai.chat.completions.create({
      model: "meta-llama/llama-4-maverick:free",
      messages: [
        {
          role: "system",
          content: `You are a master storyteller who generates engaging narratives based on image descriptions and a title. Your stories will:  

1. **Adapt to the input** – If the title/description references a known character (e.g., "SpongeBob at the Beach"), write in that character’s voice, staying true to their personality, speech, and world. Otherwise, craft an original story.  
2. **Follow a compelling structure** – Setup, conflict, and resolution with emotional stakes.  
3. **Use vivid details** – Bring images to life with sensory descriptions (sights, sounds, textures).  
4. **Include natural dialogue** – Reveals character and moves the plot forward.  
5. **Add a twist or insight** – Something unexpected but believable.  
6. **Maintain consistent tone/POV** – First-person if a character’s voice, third-person otherwise.  

**Formatting:**  
- Paragraph breaks for pacing.  
- Proper dialogue tags ("x said," not "x was like").  
- No meta-commentary—just the story.  

**If a character’s POV is detected:**  
- Mimic their speech patterns (e.g., "Oh no, Patrick!" for SpongeBob).  
- Stay true to their lore and relationships.  
- Keep it family-friendly but engaging.`,
        },
        {
          role: "user",
          content: `Title: ${title}\n\nImage Descriptions:\n${validDescriptions.map((desc: string, i: number) => `Image ${i + 1}: "${desc}"`).join("\n\n")}\n\nWrite a story (approx. ${max_tokens} tokens) based on these elements.`,
        },
      ],
      max_tokens: max_tokens,
      temperature: 0.7,
    });

    // console.log("Story generation response:", storyCompletion);

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
