"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  rating: number
}

export function TestimonialCard({ quote, author, role, rating }: TestimonialCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
      className="rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 transition-all hover:border-red-500/20 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]"
    >
      <motion.div className="mb-4 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <Star className={`h-4 w-4 ${i < rating ? "fill-red-500 text-red-500" : "fill-gray-800 text-gray-800"}`} />
          </motion.div>
        ))}
      </motion.div>
      <p className="mb-4 text-white/90">"{quote}"</p>
      <div>
        <p className="font-medium text-white">{author}</p>
        <p className="text-sm text-white/70">{role}</p>
      </div>
    </motion.div>
  )
}
