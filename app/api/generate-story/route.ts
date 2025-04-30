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
    const {
      imageDescriptions,
      title,
      max_tokens = 2000,
    } = await request.json();

    if (!imageDescriptions || imageDescriptions.length === 0 || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: "Failed to generate story" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      content: storyCompletion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error generating story:", error);
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 }
    );
  }
}
