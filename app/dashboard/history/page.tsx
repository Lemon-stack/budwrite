"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock stories data
const stories = [
  {
    id: "story-1",
    title: "The Mountain Adventure",
    timestamp: "2 hours ago",
    thumbnail: "/placeholder.svg?height=200&width=300",
    excerpt:
      "A journey through the misty mountains revealed unexpected wonders...",
  },
  {
    id: "story-2",
    title: "Ocean Mysteries",
    timestamp: "Yesterday",
    thumbnail: "/placeholder.svg?height=200&width=300",
    excerpt: "Beneath the waves, ancient secrets waited to be discovered...",
  },
  {
    id: "story-3",
    title: "City Lights",
    timestamp: "3 days ago",
    thumbnail: "/placeholder.svg?height=200&width=300",
    excerpt:
      "The urban landscape transformed as night fell, revealing a hidden world...",
  },
  {
    id: "story-4",
    title: "Desert Mirage",
    timestamp: "1 week ago",
    thumbnail: "/placeholder.svg?height=200&width=300",
    excerpt:
      "The shimmering heat created illusions that blurred reality and imagination...",
  },
  {
    id: "story-5",
    title: "Forest Whispers",
    timestamp: "2 weeks ago",
    thumbnail: "/placeholder.svg?height=200&width=300",
    excerpt: "Among ancient trees, voices of the past echoed through time...",
  },
  {
    id: "story-6",
    title: "Starry Night",
    timestamp: "3 weeks ago",
    thumbnail: "/placeholder.svg?height=200&width=300",
    excerpt:
      "The cosmic dance of celestial bodies told stories older than humanity...",
  },
];

export default function HistoryPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [displayedStories, setDisplayedStories] = useState(stories);
  const [pullDownDistance, setPullDownDistance] = useState(0);
  const touchStartY = useRef(0);
  const isPulling = useRef(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In a real app, you would fetch new stories here
      setDisplayedStories(stories);
    } finally {
      setIsRefreshing(false);
      setPullDownDistance(0);
    }
  }, []);

  const handleTouchStart = (e: TouchEvent) => {
    // Only start tracking if we're at the top of the page
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling.current) return;

    const touchY = e.touches[0].clientY;
    const distance = touchY - touchStartY.current;

    // Only allow pulling down
    if (distance > 0) {
      setPullDownDistance(Math.min(distance, 100));
    }
  };

  const handleTouchEnd = () => {
    if (isPulling.current && pullDownDistance > 50) {
      handleRefresh();
    } else {
      setPullDownDistance(0);
    }
    isPulling.current = false;
  };

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullDownDistance]);

  return (
    <div className="space-y-6">
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-purple-600 transition-transform duration-200"
        style={{ transform: `translateY(${pullDownDistance}px)` }}
      />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Story History</h1>
      </div>

      {isRefreshing && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedStories.map((story) => (
          <Link
            href={`/dashboard/story/${story.id}`}
            key={story.id}
            className="group"
          >
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={story.thumbnail || "/placeholder.svg"}
                  alt={story.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600">
                  {story.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {story.excerpt}
                </p>
              </CardContent>
              <CardFooter className="border-t p-4 text-xs text-muted-foreground">
                Generated {story.timestamp}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
