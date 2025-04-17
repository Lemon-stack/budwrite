"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function FloatingCta() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Show the CTA after scrolling down a bit
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight

      if (scrollPosition > windowHeight * 0.5 && !isDismissed) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 hidden md:block right-6 z-50 max-w-sm"
        >
          <div className="relative rounded-lg border border-purple-500/20 bg-black/90 p-4 shadow-[0_0_30px_rgba(168,85,247,0.25)] backdrop-blur-sm">
            <button
              onClick={handleDismiss}
              className="absolute right-2 top-2 rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-3 text-lg font-bold text-white">Ready to create your first Story?</div>
            <p className="mb-4 text-sm text-white/70">
              Join other of creators who are already making mind-blowing stories.
            </p>

            <div className="flex items-center gap-3">
              <Button
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                size="sm"
              >
                Get Started Free
              </Button>
              <Button variant="outline" size="sm" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
