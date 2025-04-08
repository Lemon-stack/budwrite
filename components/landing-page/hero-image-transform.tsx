"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { BookOpen, ImageIcon, Sparkles, Zap, PenTool, Layers } from "lucide-react"

export function HeroImageTransform() {
  const [currentStep, setCurrentStep] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  // Sample image analysis tags that appear during processing
  const analysisTags = ["Mountains", "Sunset", "Hiking", "Adventure", "Nature", "Exploration", "Journey", "Scenic View"]

  useEffect(() => {
    // Main step transition
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        // Reset analysis progress when moving to step 1
        if (prev === 0 && (prev + 1) % 5 === 1) {
          setAnalysisProgress(0)
        }
        return (prev + 1) % 5
      })
    }, 4000)

    // Analysis progress animation during step 1
    const analysisInterval = setInterval(() => {
      if (currentStep === 1 && analysisProgress < 100) {
        setAnalysisProgress((prev) => Math.min(prev + 5, 100))
      }
    }, 200)

    return () => {
      clearInterval(stepInterval)
      clearInterval(analysisInterval)
    }
  }, [currentStep, analysisProgress])

  // Sample story content
  const storyContent = {
    title: "The Mountain Journey",
    excerpt:
      "As the sun cast its golden rays across the rugged peaks, Sarah stood at the edge of the cliff, her heart racing with anticipation. The journey had been arduous, but the view before her made every step worthwhile...",
    continuation:
      "The wind whispered secrets of ancient travelers who had stood where she now stood, their spirits forever intertwined with the majestic landscape...",
  }

  // Sample style options
  const styleOptions = ["Adventure", "Mystery", "Romance", "Fantasy", "Historical"]

  return (
    <div className="relative h-[500px] md:h-[600px] w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-r from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1),transparent_70%)] z-5"></div>

      {/* Step label */}
      <div className="absolute top-4 left-4 z-30">
        <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-purple-500/30">
          <span className="text-xs font-medium text-white flex items-center">
            {currentStep === 0 && (
              <>
                <ImageIcon className="w-3 h-3 mr-1.5 text-purple-400" />
                Upload Image
              </>
            )}
            {currentStep === 1 && (
              <>
                <Zap className="w-3 h-3 mr-1.5 text-purple-400 animate-pulse" />
                AI Analysis
              </>
            )}
            {currentStep === 2 && (
              <>
                <Layers className="w-3 h-3 mr-1.5 text-purple-400" />
                Extracting Elements
              </>
            )}
            {currentStep === 3 && (
              <>
                <PenTool className="w-3 h-3 mr-1.5 text-purple-400" />
                Crafting Story
              </>
            )}
            {currentStep === 4 && (
              <>
                <BookOpen className="w-3 h-3 mr-1.5 text-purple-400" />
                Final Story
              </>
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        {/* Left side - Image and Analysis */}
        <div className="relative flex items-center justify-center p-6">
          {/* Original Image */}
          <motion.div
            className="relative rounded-lg overflow-hidden shadow-2xl border border-white/10 max-w-[300px]"
            initial={{ opacity: 1 }}
            animate={{
              opacity: currentStep === 0 ? 1 : currentStep >= 4 ? 0.7 : 0.4,
              scale: currentStep === 0 ? 1 : currentStep >= 4 ? 0.85 : 0.7,
              x: currentStep >= 1 ? -30 : 0,
              y: currentStep >= 1 ? -20 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="https://img.freepik.com/free-photo/beautiful-scenery-summit-mount-everest-covered-with-snow-white-clouds_181624-21317.jpg?t=st=1744132972~exp=1744136572~hmac=efac29cf97947c6990e6a6b12e1f8c4128054fb3f624161c263917b122c306ac&w=996"
              alt="Mountain landscape"
              width={300}
              height={400}
              className="object-cover"
            />

            {/* Image analysis overlay */}
            {currentStep === 1 && (
              <motion.div
                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white text-sm font-medium">Analyzing image...</p>
                <div className="w-3/4 h-2 bg-gray-800/80 rounded-full mt-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${analysisProgress}%` }}
                    transition={{ duration: 0.1 }}
                  ></motion.div>
                </div>
                <p className="text-white/70 text-xs mt-2">{analysisProgress}%</p>
              </motion.div>
            )}
          </motion.div>

          {/* Analysis Tags */}
          {(currentStep === 2 || currentStep === 3) && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {analysisTags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    className="absolute bg-purple-500/90 text-white text-xs px-2 py-1 rounded-full shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: Math.sin(index * 1.5) * 120,
                      y: Math.cos(index * 1.5) * 100,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1 + 0.5,
                    }}
                  >
                    {tag}
                  </motion.div>
                ))}

                {/* Central element */}
                <motion.div
                  className="bg-purple-600 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center z-10"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  <span className="font-medium">Story Elements</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right side - Story Generation */}
        <div className="relative flex items-center justify-center p-6">
          {/* Style Selection - Step 2-3 */}
          {(currentStep === 2 || currentStep === 3) && (
            <motion.div
              className="absolute top-6 right-6 z-20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-black/60 backdrop-blur-sm p-2 rounded-lg border border-purple-500/30">
                <p className="text-xs text-white/80 mb-2">Story Style:</p>
                <div className="flex flex-wrap gap-2">
                  {styleOptions.map((style, index) => (
                    <div
                      key={style}
                      className={`text-xs px-2 py-1 rounded-full cursor-pointer transition-colors ${
                        index === 0 ? "bg-purple-500 text-white" : "bg-gray-800/80 text-white/70 hover:bg-gray-700/80"
                      }`}
                    >
                      {style}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Story Generation Animation - Step 3 */}
          {currentStep === 3 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-full max-w-md h-[350px] bg-gray-900/80 backdrop-blur-sm rounded-lg border border-purple-500/30 p-4 overflow-hidden">
                <div className="flex items-center mb-3">
                  <PenTool className="w-4 h-4 text-purple-400 mr-2" />
                  <h3 className="text-white font-medium">Crafting Your Story</h3>
                </div>

                <div className="h-full overflow-hidden">
                  <motion.div
                    className="text-white/90 text-sm space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h4 className="text-lg font-bold text-purple-400">{storyContent.title}</h4>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      {storyContent.excerpt}
                    </motion.p>

                    <motion.div
                      className="inline-block w-3 h-5 bg-purple-500 animate-pulse"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.5 }}
                    />
                  </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          )}

          {/* Final Story - Step 4 */}
          {currentStep === 4 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-full max-w-md h-[350px] bg-gray-900/80 backdrop-blur-sm rounded-lg border border-purple-500/30 p-4 overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 text-purple-400 mr-2" />
                    <h3 className="text-white font-medium">Your Story</h3>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                  </div>
                </div>

                <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                  <div className="text-white/90 text-sm space-y-3">
                    <h4 className="text-lg font-bold text-purple-400">{storyContent.title}</h4>
                    <p>{storyContent.excerpt}</p>
                    <p>{storyContent.continuation}</p>
                    <p>
                      The air was thin at this altitude, but Sarah found it exhilarating rather than challenging. Each
                      breath filled her lungs with the pure essence of the mountains, untainted by the pollution of the
                      city she had left behind.
                    </p>
                    <p>
                      She took out her journal and began to sketch the panorama before her, trying to capture not just
                      the visual beauty but the feeling of standing at the edge of the world. The pages couldn't contain
                      the vastness, but they would serve as anchors for her memories when she returned to her ordinary
                      life.
                    </p>
                    <p>
                      As the sun began its descent, painting the sky in hues of orange and pink, Sarah knew this moment
                      would forever be etched in her soul—a reminder that sometimes the greatest discoveries happen when
                      we venture beyond our comfort zones.
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          )}

          {/* Initial state - Step 0 */}
          {currentStep === 0 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center max-w-xs">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                  <ImageIcon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Upload Any Image</h3>
                <p className="text-white/70 text-sm">
                  Our AI analyzes your photos and transforms them into captivating stories in seconds
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                    Vacation Photos
                  </span>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">Landscapes</span>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                    Family Moments
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Step indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {[0, 1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              currentStep === step ? "bg-purple-500" : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
