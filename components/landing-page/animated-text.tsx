"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AnimatedTextProps {
  text: string
  className?: string
  highlightWords?: string[]
  highlightClassName?: string
  wordSpacing?: string | number // Add this prop for customizable word spacing
}

export function AnimatedText({
  text,
  className = "",
  highlightWords = [],
  highlightClassName = "",
  wordSpacing = "0.25em", // Default word spacing
}: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Split the text into words
  const words = text.split(" ")

  // Check if a word should be highlighted
  const shouldHighlight = (word: string) => {
    return highlightWords.some((highlight) => word.includes(highlight))
  }

  return (
    <h1 className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" style={{ display: "flex", flexWrap: "wrap", gap: wordSpacing }}>
        {words.map((word, index) => {
          const isHighlighted = shouldHighlight(word)
          const wordClassName = isHighlighted ? highlightClassName : ""

          return (
            <motion.span
              key={index}
              className={`inline-block ${wordClassName}`}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
                ease: [0.2, 0.65, 0.3, 0.9],
              }}
            >
              {word}
            </motion.span>
          )
        })}
      </span>
    </h1>
  )
}
