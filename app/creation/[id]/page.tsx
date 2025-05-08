"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import BookDisplayStory from "@/components/dashboard/book-display-story";
import Loading from "@/loading";
import { ArrowLeft, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUrlState } from "@/hooks/use-url-state";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Story = {
  id: string;
  title: string;
  content: string;
  image: string;
  status: string;
  created_at: string;
};

type Props = {
  params: Promise<{ id: string }>;
};

export default function PublicStoryPage({ params }: Props) {
  // Use state to store the resolved id
  const [id, setId] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUrlState } = useUrlState();
  const router = useRouter();

  // Resolve the params Promise to get the id
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  async function loadStory() {
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setStory(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load story");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadStory();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Story not found</h1>
        <p className="text-muted-foreground mb-6">
          The story you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-4 bg-primary-foreground sm:p-6">
      <section className="flex items-center justify-between">
        <div className="flex flex-col items-start w-full gap-6 p-2">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Back
          </div>
          <div className="flex items-start gap-2">
            {/* user blob */}
            <span className="size-8 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#f5f3ff_0%,_#ede9fe_25%,_#c4b5fd_50%,_#a78bfa_75%,_#7c3aed_100%)] shadow-lg" />

            <div className="flex flex-col items-start">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight mb-1">
                {story.title}
              </h1>
              <span className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                Created on {new Date(story.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setUrlState("signin", "creations")}
          className="px-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white hover"
        >
          Try it
          <WandSparkles className="size-4 ml-2" />
        </Button>
      </section>

      <Separator className="mb-4 sm:mb-6" />
      <div className="w-full">
        {story.status === "generating" ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-10">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Generating story...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <BookDisplayStory
              content={story.content}
              title={story.title.replace(/\*/g, "")}
              image={story.image}
            />
          </div>
        )}
      </div>
    </div>
  );
}
