import { useState, useEffect } from "react";

interface StoryHistory {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  excerpt: string;
}

// Mock data generator
const generateMockStories = (count: number): StoryHistory[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `story-${i + 1}`,
    title: `Story ${i + 1}`,
    thumbnail: `/placeholder.svg?height=200&width=300&text=Story+${i + 1}`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(), // Each story is 1 day apart
    excerpt: `This is a sample excerpt for story ${i + 1}. It contains a brief description of what the story is about.`,
  }));
};

export const useStories = (pageSize = 5) => {
  const [stories, setStories] = useState<StoryHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchStories = async (pageNum: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate API response
      const newStories = generateMockStories(pageSize);

      if (pageNum === 1) {
        setStories(newStories);
      } else {
        setStories((prev) => [...prev, ...newStories]);
      }

      // Simulate reaching the end of the list
      setHasMore(pageNum < 4); // Only show 4 pages of data
    } catch (err) {
      setError("Failed to load stories. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    fetchStories(page);
  }, [page]);

  return {
    stories,
    isLoading,
    error,
    hasMore,
    loadMore,
  };
};
