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
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
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
      return NextResponse.json(
        { error: "Failed to analyze image" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      description: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
