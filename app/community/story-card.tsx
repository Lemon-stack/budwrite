"use client";
import { useAuth } from "@/context/auth";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";

import Link from "next/link";

export default function StoryCard({ story }: { story: any }) {
  const { user } = useAuth();
  return (
    <div className="mb-2">
      <Link href={`/creation/${story.id}`}>
        <Image
          src={story.image}
          alt={story.title}
          width={100}
          height={100}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      </Link>

      <div className="flex items-start gap-2">
        <span className="size-6 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#f5f3ff_0%,_#ede9fe_25%,_#c4b5fd_50%,_#a78bfa_75%,_#7c3aed_100%)] shadow-lg" />
        <div>
          <h1 className="text-base font-bold text-start break-words">
            {story.title}
          </h1>
        </div>
        {/* like and dislike buttons */}
        {user && (
          <div className="flex items-center gap-2 ml-auto">
            <button className="size-6 rounded-full bg-zinc-900 text-white">
              <ThumbsUp className="size-4" />
            </button>
            <button className="size-6 rounded-full bg-zinc-900 text-white">
              <ThumbsDown className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
