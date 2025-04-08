"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{
      y: -5,
      scale: 1.02,
      transition: { duration: 0.2 },
    }}
    className="group relative rounded-xl border border-purple-500/30 bg-gradient-to-b from-white/5 to-transparent p-6 transition-all hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]"
  >
    {/* Animated background glow */}
    <motion.div
      className="absolute inset-0 -z-10 rounded-xl bg-purple-500/5 opacity-0 blur-xl group-hover:opacity-100"
      initial={{ scale: 0.8 }}
      whileHover={{
        scale: 1.2,
        transition: {
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          duration: 2,
        },
      }}
    />

    <motion.div
      className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white"
      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
      transition={{ duration: 0.5 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 1 }}
      animate={{
        scale: [1, 1.05, 1],
        transition: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
      }}
    >
      {icon}
    </motion.div>

    <motion.h3
      className="mb-2 text-xl font-bold text-white"
      initial={{ opacity: 1 }}
      whileHover={{
        color: "rgb(168, 85, 247)",
        transition: { duration: 0.2 },
      }}
    >
      {title}
    </motion.h3>

    <motion.p
      className="text-white/70"
      initial={{ opacity: 0.7 }}
      whileHover={{
        opacity: 1,
        transition: { duration: 0.2 },
      }}
    >
      {description}
    </motion.p>

    {/* Subtle corner accent */}
    <motion.div
      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-br-xl border-b border-r border-purple-500/50"
      initial={{ opacity: 0 }}
      whileHover={{
        opacity: 1,
        rotate: 10,
        transition: { duration: 0.3 },
      }}
    />
  </motion.div>
  )
}
