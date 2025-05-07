import Link from "next/link";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { getCreations } from "../creation/actions";
import Image from "next/image";
import StoryCard from "./story-card";
export default async function CommunityCreationsPage() {
  const creations = await getCreations();

  return (
    <div className="flex flex-col items-start gap-2 mx-auto px-4">
      <div className="flex flex-col items-start gap-1 mb-2">
        <h1 className="text-base font-bold text-center break-words">
          Explore other creations
        </h1>
        <p className="text-sm text-center break-words text-muted-foreground">
          See what others have created with PictoStory
        </p>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {creations?.map((creation) => (
          <StoryCard key={creation.id} story={creation} />
        ))}
      </section>
    </div>
  );
}
