import { BookOpen, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

export default function StoryShowcase() {
  return (
    <section className="py-20 bg-[#12121A]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            See What <span className="text-purple-500">PictoStory</span> Can
            Create
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse through examples of AI-generated stories from various types
            of images
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Mountain Adventure",
              description:
                "A thrilling tale of exploration and discovery in the mountains",
              imageHeight: 300,
              imageWidth: 400,
            },
            {
              title: "Urban Mystery",
              description:
                "A suspenseful story set in the heart of a bustling city",
              imageHeight: 300,
              imageWidth: 400,
            },
            {
              title: "Beach Getaway",
              description:
                "A relaxing narrative about finding peace by the ocean",
              imageHeight: 300,
              imageWidth: 400,
            },
          ].map((story, index) => (
            <div
              key={index}
              className="bg-[#1A1A24] rounded-xl overflow-hidden border border-purple-900/30"
            >
              <div className="relative">
                <Image
                  src={`/placeholder.svg?height=${story.imageHeight}&width=${story.imageWidth}`}
                  alt={story.title}
                  width={story.imageWidth}
                  height={story.imageHeight}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-purple-600/80 backdrop-blur-sm rounded-full p-2">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {story.title}
                </h3>
                <p className="text-gray-400 mb-4">{story.description}</p>
                <div className="bg-[#12121A] p-3 rounded-md border border-purple-900/30 mb-4">
                  <p className="text-gray-300 text-sm italic line-clamp-3">
                    "The majestic peaks towered above as Sarah adjusted her
                    backpack. Little did she know that this hiking trip would
                    change her life forever..."
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-purple-600 text-purple-400 hover:bg-purple-600/20"
                >
                  Read Full Story
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-purple-600 hover:bg-purple-700">
            Create Your Own Story <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
