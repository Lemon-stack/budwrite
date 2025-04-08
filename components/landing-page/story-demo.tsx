"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ImageIcon, BookOpen, RefreshCw } from "lucide-react"

export function StoryDemo() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleGenerate = () => {
    setIsGenerating(true)
    setIsComplete(false)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setIsComplete(true)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const handleReset = () => {
    setIsGenerating(false)
    setIsComplete(false)
    setProgress(0)
  }

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-gray-900/50 backdrop-blur-sm">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Image to Story Converter</h3>
        <Button variant="outline" size="sm" onClick={handleReset} className="text-white/70 border-white/10">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 p-6">
        <div className="space-y-4">
          <div className="aspect-video relative rounded-lg overflow-hidden border border-white/10">
            <Image src="/placeholder.svg?height=400&width=600" alt="Sample image" fill className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {isGenerating ? "Analyzing Image..." : "Generate Story"}
              </Button>
            </div>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/70">
                <span>Analyzing image...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-white/10">
          <div className="flex items-center mb-4">
            <BookOpen className="h-5 w-5 text-purple-500 mr-2" />
            <h3 className="text-lg font-medium text-white">Generated Story</h3>
          </div>

          {!isComplete ? (
            <div className="h-[300px] flex items-center justify-center text-white/50 text-center p-6">
              {isGenerating ? (
                <div className="space-y-4">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p>Creating your story...</p>
                </div>
              ) : (
                <p>Click "Generate Story" to transform your image into a narrative</p>
              )}
            </div>
          ) : (
            <div className="h-[300px] overflow-y-auto text-white space-y-4 pr-2">
              <h4 className="text-xl font-bold text-purple-400">The Coastal Adventure</h4>

              <p>
                The waves crashed against the rocky shore as Emma stood at the edge of the cliff, her hair dancing
                wildly in the salty breeze. She had traveled for days to reach this remote coastline, drawn by stories
                of hidden treasures and ancient mysteries.
              </p>

              <p>
                Below her, the turquoise waters revealed glimpses of a submerged structure—remnants of a civilization
                long forgotten by time but preserved in the embrace of the sea. Emma clutched the weathered map in her
                hand, the ink fading but the markings still visible enough to confirm she was in the right place.
              </p>

              <p>
                "This is it," she whispered to herself, excitement bubbling within her chest. "The Temple of the Sea
                Guardians."
              </p>

              <p>
                As the sun began its descent toward the horizon, casting golden reflections across the water's surface,
                Emma knew she had until nightfall to find the hidden entrance. Legend said it would only reveal itself
                when the last light of day touched the ancient stones.
              </p>

              <p>
                With determination in her eyes and adventure in her heart, she began her careful descent down the narrow
                path carved into the cliff face. Little did she know that this discovery would change not only her life
                but the understanding of history itself.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
