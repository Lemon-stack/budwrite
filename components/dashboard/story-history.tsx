import { useStories } from "@/hooks/use-stories";
import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function StoryHistory() {
  const { stories, isLoading, error, hasMore, loadMore } = useStories();
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!isLoading && stories.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-muted-foreground">No stories yet</p>
        <Button asChild>
          <Link href="/dashboard">Create your first story</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <Link
          key={story.id}
          href={`/dashboard/story/${story.id}`}
          className="block group"
        >
          <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
              <img
                src={story.thumbnail}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium group-hover:text-purple-500 transition-colors truncate">
                {story.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {story.excerpt}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(story.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
      ))}

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4 p-4">
              <Skeleton className="w-20 h-20 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!hasMore && stories.length > 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No more stories to load
        </div>
      )}

      <div ref={observerTarget} className="h-4" />
    </div>
  );
}
