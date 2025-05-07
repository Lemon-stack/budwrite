import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth";

const BUCKET_NAME = "stories-13v9opf_0";

export function useStories() {
  const { supabase } = useAuth();
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false); // New flag to prevent concurrent fetches
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set()); // Track all seen story IDs
  const pageSize = 10;

  const refresh = async () => {
    setStories([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setSeenIds(new Set());
    await loadMore();
  };

  const loadMore = useCallback(async () => {
    if (isFetching || !hasMore) return; // Prevent concurrent fetches or unnecessary calls

    try {
      setIsFetching(true);
      setIsLoading(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        throw new Error("No active session");
      }

      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) {
        throw error;
      }

      // Format image URLs to be public
      const formattedData = await Promise.all(
        data.map(async (story) => {
          let imageUrl = story.image;

          if (imageUrl && !/^https?:\/\//.test(imageUrl)) {
            try {
              const fileName = imageUrl.split("/").pop();
              console.log("Processing image:", {
                original: imageUrl,
                fileName,
              });

              const { data } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName);

              imageUrl = data.publicUrl;
              console.log("Generated URL:", imageUrl);
            } catch (err) {
              console.error("Error formatting image URL:", err);
              imageUrl = null;
            }
          }

          return {
            ...story,
            image: imageUrl,
          };
        })
      );

      // Filter out duplicates using seenIds
      const newStories = formattedData.filter(
        (story) => !seenIds.has(story.id)
      );

      if (newStories.length === 0) {
        setHasMore(false);
        return;
      }

      // Update seenIds and stories
      setSeenIds((prev) => {
        const newSet = new Set(prev);
        newStories.forEach((story) => newSet.add(story.id));
        return newSet;
      });

      setStories((prev) => [...prev, ...newStories]);
      setHasMore(data.length === pageSize);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load stories")
      );
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [isFetching, hasMore, page, seenIds, supabase]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return { stories, isLoading, error, loadMore, hasMore, refresh };
}
