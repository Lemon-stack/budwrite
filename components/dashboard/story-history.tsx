"use client";
import { useEffect, useRef } from "react";
import { useStories } from "@/lib/hooks/useStories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@supabase/supabase-js";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function StoryHistory() {
  const { stories, isLoading, error, loadMore, hasMore } = useStories();
  console.log("stories", stories);
  const observerTarget = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading stories: {error.message}
      </div>
    );
  }

  if (isLoading && stories.length === 0) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-3">
            <div className="flex gap-3">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No stories yet. Create your first story!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stories.map((story) => (
        <Card
          key={story.id}
          className="p-3 hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => router.push(`/dashboard/story/${story.id}`)}
        >
          <div className="flex gap-3">
            {story.image && (
              <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={story.image}
                  alt={story.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm">{story.title}</h3>
              <p className="text-xs text-muted-foreground mb-1">
                {formatDistanceToNow(new Date(story.created_at), {
                  addSuffix: true,
                })}
              </p>
              <p className="text-xs line-clamp-2">
                {story.content?.replace(/<[^>]*>/g, "")}
              </p>
            </div>
          </div>
        </Card>
      ))}
      {hasMore && <div ref={observerTarget} className="h-4" />}
      {isLoading && stories.length > 0 && (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <Card key={`loading-${i}`} className="p-3">
              <div className="flex gap-3">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
