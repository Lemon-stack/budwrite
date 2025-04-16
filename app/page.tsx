import Link from "next/link";
import {
  BookOpen,
  ImageIcon,
  Sparkles,
  ArrowRight,
  Play,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingCta } from "@/components/landing-page/floating-cta";
import { ParticleBackground } from "@/components/landing-page/particle-background";
import { AnimatedText } from "@/components/landing-page/animated-text";
import { ScrollReveal } from "@/components/landing-page/scroll-reveal";
import { FeatureCard } from "@/components/landing-page/feature-card";
import { HeroImageTransform } from "@/components/landing-page/hero-image-transform";
import { MarqueeScroll } from "@/components/landing-page/marquee-scroll";
import { TestimonialCard } from "@/components/landing-page/testimonial-card";
import { StoryDemo } from "@/components/landing-page/story-demo";
import Header from "@/components/landing-page/header";
import MarqueeTestimonials from "@/components/landing-page/testimonials-section";
export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Floating CTA */}
      <FloatingCta />

      <Header />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-black to-gray-900 pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_70%)]"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        </div>

        <div className="container relative z-10 px-4 py-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* <div className="mb-6 inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-sm text-purple-500">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              <span>AI-Powered Image-to-Story Conversion</span>
            </div> */}

            <AnimatedText
              text="Transform Your Pictures Into Epic Stories"
              className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl flex items-center text-center lg:text-7xl"
              highlightWords={["Pictures", "Stories"]}
              highlightClassName="text-purple-500"
            />

            <p className="mb-10 text-xl text-white/70">
              Captivating stories crafted from your images, no writing skills
              needed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-purple-500 hover:bg-purple-600 text-white min-w-[180px] group transition-all duration-300 transform hover:scale-105"
                asChild
              >
                <Link href="/dashboard">
                  Create Your First Story
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent min-w-[180px] group transition-all duration-300"
                asChild
              >
                <Link href="/demo">
                  <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-20 mx-auto max-w-5xl">
            <HeroImageTransform />
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <MarqueeScroll />

      {/* Features Section */}
      <section id="features" className="bg-black py-24">
        <div className="container px-4">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Powerful Features
              </h2>
              <p className="mx-auto max-w-2xl text-white/70">
                Everything you need to create professional-quality stories from
                your images
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ScrollReveal delay={0.1}>
              <FeatureCard
                icon={<ImageIcon className="h-6 w-6" />}
                title="AI Image Analysis"
                description="Our advanced AI models analyze your images to identify objects, scenes, emotions, and context"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <FeatureCard
                icon={<BookOpen className="h-6 w-6" />}
                title="Narrative Generation"
                description="Transform visual elements into rich, engaging stories with compelling characters and plots"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <FeatureCard
                icon={<Sparkles className="h-6 w-6" />}
                title="Style Customization"
                description="Select from various storytelling styles and genres to match your creative vision"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      {/* <section id="how-it-works" className="bg-gradient-to-b from-gray-900 to-black py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15),transparent_70%)]"></div>

        <div className="container relative z-10 px-4">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">See It In Action</h2>
              <p className="mx-auto max-w-2xl text-white/70">
                Watch how easily your images transform into captivating stories
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto max-w-5xl">
            <ScrollReveal>
              <StoryDemo />
            </ScrollReveal>
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <MarqueeTestimonials />

      {/* CTA Section */}
      <section className="relative bg-black py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_70%)]"></div>
        </div>

        <div className="container relative z-10 px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl rounded-2xl border border-purple-500/20 bg-gradient-to-b from-gray-900 to-black p-8 text-center sm:p-12 hover:border-purple-500/40 transition-all duration-500 shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:shadow-[0_0_50px_rgba(168,85,247,0.2)]">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Ready to Create Your First Story?
              </h2>
              <p className="mb-8 text-white/70">
                Join thousands of creators and start transforming your images
                today. No writing experience required.
              </p>
              <Button
                size="lg"
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 transform transition-transform hover:scale-105"
                asChild
              >
                <Link href="/dashboard">Get Started For Free</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-12">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500 text-white">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold text-white">PictoStory</span>
              </Link>
              <p className="mt-4 text-sm text-white/70">
                Transform your images into captivating stories with AI
                technology.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase text-white/70">
                Product
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="text-sm text-white/70 hover:text-white"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-white/70 hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-sm text-white/70 hover:text-white"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase text-white/70">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-white/70 hover:text-white"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-white/70 hover:text-white"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-sm text-white/70 hover:text-white"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase text-white/70">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-white/70 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-white/70 hover:text-white"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-sm text-white/70 hover:text-white"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8 text-center">
            <p className="text-sm text-white/50">
              © {new Date().getFullYear()} StoryVision. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
