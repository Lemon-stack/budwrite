import Link from "next/link";
import { ChevronLeft, Download, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

// Mock story data function - in a real app, you would fetch this data based on the ID
const getStoryById = (id: string) => {
  const stories = {
    "story-1": {
      id: "story-1",
      title: "The Mountain Adventure",
      timestamp: "April 8, 2025 at 10:37 AM",
      image: "/placeholder.svg?height=500&width=800",
      content: `
        <p>The morning mist clung to the mountainside as I began my ascent. The path, worn by countless travelers before me, wound its way through ancient pines that stood like silent sentinels guarding the secrets of the peaks.</p>
        <!-- ... rest of the content ... -->
      `,
      sourceImage: "/placeholder.svg?height=300&width=300",
    },
    "story-2": {
      id: "story-2",
      title: "Ocean Mysteries",
      timestamp: "April 7, 2025 at 3:15 PM",
      image: "/placeholder.svg?height=500&width=800",
      content: `
        <p>The ocean stretched before me, an endless expanse of deep blue meeting the horizon. Waves lapped gently against the shore, whispering secrets of distant lands and ancient times.</p>
        <!-- ... rest of the content ... -->
      `,
      sourceImage: "/placeholder.svg?height=300&width=300",
    },
  };

  return stories[id as keyof typeof stories];
};

// Updated Props type
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // Fixed searchParams type
};

export default async function StoryPage({ params, searchParams }: Props) {
  const resolvedParams = await params; // Resolve the params Promise
  const resolvedSearchParams = await searchParams; // Resolve the searchParams Promise
  const story = getStoryById(resolvedParams.id);

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
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
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/history">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back to History</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{story.title}</h1>
      </div>

      <div className="mb-6 rounded-lg overflow-hidden">
        <img
          src={story.image || "/placeholder.svg"}
          alt={story.title}
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          Generated on {story.timestamp}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Favorite
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <Separator className="mb-6" />

      <div
        className="prose prose-purple max-w-none mb-10"
        dangerouslySetInnerHTML={{ __html: story.content }}
      />

      <div className="bg-muted/30 rounded-lg p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Source Image</h2>
        <div className="flex items-start gap-6">
          <div className="w-1/3 rounded-md overflow-hidden">
            <img
              src={story.sourceImage || "/placeholder.svg"}
              alt="Source image for the story"
              className="w-full h-auto"
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              This story was generated based on the image you uploaded. Our AI
              analyzed the visual elements and created a unique narrative
              inspired by what it saw.
            </p>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Original Image
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">You might also like</h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-md overflow-hidden">
              <img
                src={`/placeholder.svg?height=150&width=250&text=Related Story ${i}`}
                alt={`Related story ${i}`}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
