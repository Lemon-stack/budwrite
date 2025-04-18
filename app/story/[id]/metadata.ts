import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: story } = await supabase
    .from("stories")
    .select("title, content, image")
    .eq("id", params.id)
    .single();

  if (!story) {
    return {
      title: "Story Not Found | PictoStory",
      description: "The story you're looking for doesn't exist or has been removed.",
    };
  }

  // Clean the content for meta description
  const cleanContent = story.content
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim()
    .slice(0, 160); // Limit to 160 characters

  return {
    title: `${story.title} | PictoStory`,
    description: cleanContent,
    openGraph: {
      title: `${story.title} | PictoStory`,
      description: cleanContent,
      type: "article",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/story/${params.id}`,
      images: [
        {
          url: story.image || "/placeholder.svg",
          width: 1200,
          height: 630,
          alt: story.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${story.title} | PictoStory`,
      description: cleanContent,
      images: [story.image || "/placeholder.svg"],
    },
  };
} 