import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Based on this image description, create an engaging and creative story. The story should be well-structured with a clear beginning, middle, and end. Make it descriptive and immersive, using the visual elements from the description to create a vivid narrative.

Key requirements:
1. Create a unique, creative title that captures the essence of the story
2. Develop interesting characters with depth and personality
3. Include natural dialogue and sensory details
4. Add unexpected twists or insights
5. Maintain consistent tone and perspective
6. Make it suitable for all ages but not overly simplistic

Image Description:
${description}

Please format the story in HTML with appropriate paragraph tags. Start with a <h2> tag for the title, followed by the story content.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = response.text();

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error generating story:", error);
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 }
    );
  }
}
