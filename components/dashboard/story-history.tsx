"use client";
import { useEffect, useRef, useState } from "react";
import { useStories } from "@/lib/hooks/useStories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@supabase/supabase-js";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { cleanStoryContent } from "@/lib/utils";
import { MoreVertical, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { debounce } from "lodash";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function StoryHistory() {
  const { stories, isLoading, error, loadMore, hasMore, refresh } =
    useStories();
  const [deletingStoryId, setDeletingStoryId] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleDelete = async (storyId: string, imageUrl: string) => {
    try {
      setDeletingStoryId(storyId);

      // Extract the filename from the image URL
      const fileName = imageUrl.split("/").pop();

      // Delete from storage
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from("stories")
          .remove([fileName]);

        if (storageError) {
          console.error("Error deleting image:", storageError);
        }
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("stories")
        .delete()
        .eq("id", storyId);

      if (dbError) throw dbError;

      toast.success("Story deleted successfully");
      refresh(); // Refresh the story list
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story");
    } finally {
      setDeletingStoryId(null);
    }
  };

  useEffect(() => {
    const debouncedLoadMore = debounce(() => {
      if (hasMore && !isLoading) {
        loadMore();
      }
    }, 300);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          debouncedLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      observer.disconnect();
      debouncedLoadMore.cancel();
    };
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
          className="p-3 hover:bg-muted/50 transition-colors relative"
        >
          {deletingStoryId === story.id && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          <div className="flex gap-3">
            {story.image && (
              <div
                className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0 cursor-pointer"
                onClick={() => router.push(`/dashboard/story/${story.id}`)}
              >
                <img
                  src={story.image}
                  alt={story.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => router.push(`/dashboard/story/${story.id}`)}
            >
              <h3 className="font-medium text-sm">{story.title}</h3>
              <p className="text-xs text-muted-foreground mb-1">
                {formatDistanceToNow(new Date(story.created_at), {
                  addSuffix: true,
                })}
              </p>
              <p className="text-xs line-clamp-2">
                {cleanStoryContent(story.content?.replace(/<[^>]*>/g, ""))}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(story.id, story.image);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
      {hasMore && <div ref={observerTarget} className="h-4" />}
      {isLoading && stories.length > 0 && (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <Card key={`skeleton-${i}`} className="p-3">
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
