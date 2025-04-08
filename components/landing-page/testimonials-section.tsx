"use client"

import { useRef } from "react"
import { motion, useAnimationFrame, useScroll, useTransform } from "framer-motion"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  rating: number
}

const TestimonialCard = ({ quote, author, role, rating }: TestimonialCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="flex h-full flex-col rounded-xl border border-purple-500/20 bg-gradient-to-b from-white/5 to-transparent p-6 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
    >
      <div className="mb-4 flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-5 w-5 ${i < rating ? "text-purple-500" : "text-gray-400"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="mb-4 flex-grow text-white/80 italic">"{quote}"</p>
      <div>
        <p className="font-bold text-white">{author}</p>
        <p className="text-purple-400">{role}</p>
      </div>
    </motion.div>
  )
}

const MarqueeTestimonials = () => {
  const testimonials = [
    {
      quote:
        "I never thought I could create engaging stories without writing skills. StoryVision changed everything for me.",
      author: "Sarah Johnson",
      role: "Content Creator",
      rating: 5,
    },
    {
      quote:
        "The quality of the stories generated is incredible. It's like having a professional writer interpret my photos.",
      author: "Michael Chen",
      role: "Photographer",
      rating: 5,
    },
    {
      quote: "I use StoryVision for all my social media posts now. The custom stories bring my images to life.",
      author: "Alex Rodriguez",
      role: "Influencer",
      rating: 4,
    },
    {
      quote:
        "StoryVision has become an essential tool in my creative workflow. The AI understands the mood of my images perfectly.",
      author: "Emma Wilson",
      role: "Digital Artist",
      rating: 5,
    },
    {
      quote: "As a marketing professional, I've found StoryVision invaluable for creating compelling content quickly.",
      author: "David Park",
      role: "Marketing Director",
      rating: 4,
    },
  ]

  // Duplicate testimonials to create a seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  const marqueeRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, 50])
  const x = useRef(0)
  const speed = 0.5

  useAnimationFrame(() => {
    if (!marqueeRef.current) return

    x.current -= speed
    const { width } = marqueeRef.current.getBoundingClientRect()

    // Reset position when we've scrolled the width of the original set
    if (x.current <= -width / 2) {
      x.current = 0
    }

    marqueeRef.current.style.transform = `translateX(${x.current}px)`
  })

  return (
    <section id="testimonials" className="bg-black py-24 overflow-hidden">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">What Our Users Say</h2>
          <p className="mx-auto max-w-2xl text-white/70">
            Join thousands of creators who have transformed their images into stories
          </p>
        </motion.div>

        <div className="relative">
          {/* Purple gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-black to-transparent" />
          <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-black to-transparent" />

          {/* Marquee container */}
          <div className="relative overflow-hidden">
            <div ref={marqueeRef} className="flex gap-6 py-4" style={{ width: "fit-content" }}>
              {duplicatedTestimonials.map((testimonial, index) => (
                <div key={index} className="w-[350px] flex-shrink-0">
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MarqueeTestimonials
