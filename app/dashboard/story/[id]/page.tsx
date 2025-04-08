import Link from "next/link"
import { ChevronLeft, Download, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

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
        
        <p>Each step took me higher, the air growing thinner, crisper. The world below gradually disappeared beneath a sea of clouds, transforming the landscape into an ethereal realm suspended between earth and sky.</p>
        
        <p>At midday, I reached a plateau overlooking a hidden valley. Wildflowers painted the meadow in vibrant hues of purple and gold, swaying gently in the mountain breeze. A crystal-clear stream cut through the center, its waters catching the sunlight and scattering it like diamonds across the surface.</p>
        
        <p>I sat on a sun-warmed rock, unpacking my simple lunch. A curious marmot watched from a safe distance, its whiskers twitching with interest. The silence was profound, broken only by the occasional call of an eagle soaring overhead.</p>
        
        <p>As the afternoon wore on, the sky transformed, clouds gathering with surprising speed. The first rumble of thunder echoed across the valley, a warning of the storm to come. I gathered my belongings, knowing I needed to find shelter before the full force of the mountain weather was unleashed.</p>
        
        <p>A small cave, hidden behind a curtain of vines, provided the perfect refuge. As rain began to pound the earth outside, I settled in, watching nature's spectacular show from my protected vantage point. Lightning illuminated the valley in brilliant flashes, revealing glimpses of a transformed landscape.</p>
        
        <p>When the storm finally passed, leaving the world washed clean, I emerged to witness a double rainbow arching across the sky—a perfect end to an adventure that had revealed the mountains' many moods and mysteries.</p>
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
        
        <p>I waded into the cool water, feeling the soft sand shift beneath my feet. With each step, the shore receded further, until I was floating, suspended in the embrace of the sea.</p>
        
        <p>Beneath the surface, a world of wonder unfolded. Schools of silver fish darted around me, their scales catching the filtered sunlight. Coral formations created an underwater cityscape, home to countless creatures of all shapes and colors.</p>
        
        <p>A sea turtle glided past, its ancient eyes seeming to hold the wisdom of centuries. I followed at a respectful distance, watching as it navigated the reef with effortless grace.</p>
        
        <p>In a hidden cove, protected by towering cliffs, I discovered a shipwreck half-buried in the sand. Wooden beams, weathered by time and tide, formed a skeletal outline of what once must have been a magnificent vessel. Marine life had claimed it as their own, transforming human creation into a living monument.</p>
        
        <p>As the sun began its descent, casting golden light across the water's surface, I reluctantly made my way back to shore. The mysteries of the ocean would remain, waiting to be explored another day.</p>
      `,
      sourceImage: "/placeholder.svg?height=300&width=300",
    },
  }

  return stories[id as keyof typeof stories]
}

export default function StoryPage({ params }: { params: { id: string } }) {
  const story = getStoryById(params.id)

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">Story not found</h1>
        <p className="text-muted-foreground mb-6">The story you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    )
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
        <img src={story.image || "/placeholder.svg"} alt={story.title} className="w-full h-auto object-cover" />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">Generated on {story.timestamp}</div>
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

      <div className="prose prose-purple max-w-none mb-10" dangerouslySetInnerHTML={{ __html: story.content }} />

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
              This story was generated based on the image you uploaded. Our AI analyzed the visual elements and created
              a unique narrative inspired by what it saw.
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
  )
}
