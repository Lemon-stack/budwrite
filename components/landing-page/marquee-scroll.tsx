"use client"

import { motion } from "framer-motion"
import { Music, Sparkles, Zap, Star, Heart, Headphones, Mic, BookOpen, Image } from "lucide-react"

export function MarqueeScroll() {
  const items = [
    { text: "AI-POWERED STORIES", icon: <Sparkles className="h-4 w-4" /> },
    { text: "INSTANT CREATION", icon: <Zap className="h-4 w-4" /> },
    { text: "VIVID NARRATIVES", icon: <Star className="h-4 w-4" /> },
    { text: "MULTIPLE STYLES", icon: <BookOpen className="h-4 w-4" /> },
    { text: "CUSTOM TALES", icon: <Heart className="h-4 w-4" /> },
    { text: "VOICE NARRATION", icon: <Mic className="h-4 w-4" /> },
    { text: "PICTURE-DRIVEN PLOTS", icon: <Image className="h-4 w-4" /> },
  ];

  // Duplicate items to create seamless loop
  const scrollItems = [...items, ...items, ...items]

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-black py-4">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      >
        {scrollItems.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center px-4 text-white/70"
            whileHover={{ scale: 1.05, color: "#a855f7" }}
          >
            {item.icon}
            <span className="ml-2 text-sm font-medium">{item.text}</span>
            <span className="mx-4">•</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
