"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useScroll,
  useTransform,
} from "framer-motion";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

const TestimonialCard = ({ quote, author, role }: TestimonialCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="flex h-full flex-col rounded-xl border border-purple-500/20 bg-gradient-to-b from-white/5 to-transparent p-6 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
    >
      <p className="mb-4 flex-grow text-white/80 italic">"{quote}"</p>
      <div>
        <p className="font-bold text-white">{author}</p>
        <p className="text-purple-400">{role}</p>
      </div>
    </motion.div>
  );
};

const MarqueeTestimonials = () => {
  const [testimonials, setTestimonials] = useState<TestimonialCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials");
        if (!response.ok) {
          throw new Error("Failed to fetch testimonials");
        }
        const data = await response.json();
        if (data.testimonials && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch testimonials"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const marqueeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const x = useRef(0);
  const speed = 0.5;

  useAnimationFrame(() => {
    if (!marqueeRef.current) return;

    x.current -= speed;
    const { width } = marqueeRef.current.getBoundingClientRect();

    if (x.current <= -width / 2) {
      x.current = 0;
    }

    marqueeRef.current.style.transform = `translateX(${x.current}px)`;
  });

  // If there are no testimonials, don't render the section
  if (isLoading || error || testimonials.length === 0) {
    return null;
  }

  // Duplicate testimonials to create a seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="bg-black py-24 overflow-hidden">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mx-auto max-w-2xl text-white/70">
            Join thousands of creators who have transformed their images into
            stories
          </p>
        </motion.div>

        <div className="relative">
          {/* Purple gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-black to-transparent" />
          <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-black to-transparent" />

          {/* Marquee container */}
          <div className="relative overflow-hidden">
            <div
              ref={marqueeRef}
              className="flex gap-6 py-4"
              style={{ width: "fit-content" }}
            >
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
  );
};

export default MarqueeTestimonials;
