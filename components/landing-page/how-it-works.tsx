import { Upload, Sparkles, FileText, ChevronRight, Pen } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export default function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0B0B10] to-[#12121A]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col items-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-900/20 text-purple-400 text-sm font-medium mb-6 border border-purple-800/30">
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
              PictoStory
            </span>{" "}
            Works
          </h2>
          <p className="text-gray-400 max-w-2xl text-center text-lg">
            Transform your images to Epic stories
          </p>
        </div>

        <div className="space-y-16">
          {[
            {
              step: 1,
              icon: Upload,
              title: "Upload Your Image",
              description:
                "Simply upload any photo from your device. landscapes, portraits, action shots, wildlife, etc.",
            },
            {
              step: 2,
              icon: Pen,
              title: "Add a title",
              description: "Add a Title to your story",
            },
            {
              step: 3,
              icon: Sparkles,
              title: "AI Generates Your Story",
              description:
                "AI analyzes your image and creates a unique, engaging story based on what it sees.",
            },
            {
              step: 4,
              icon: FileText,
              title: "Enjoy & Share",
              description:
                "Read your personalized story and share it with friends and family across multiple platforms.",
            },
          ].map((item, index) => (
            <div key={index} className="group">
              <div
                className={`grid grid-cols-1 lg:grid-cols-5 gap-8 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                {/* Content Side */}
                <div className="lg:col-span-2">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-xl bg-purple-600/20 flex items-center justify-center mr-4 border border-purple-600/30">
                      <item.icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm mr-3">
                        {item.step}
                      </div>
                      <h3 className="text-2xl font-semibold text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-lg ml-16">
                    {item.description}
                  </p>
                </div>

                {/* Image Side */}
                <div className="lg:col-span-3">
                  <div className="bg-[#12121A]/80 backdrop-blur-sm rounded-xl p-3 border border-purple-900/30 hover:border-purple-600/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(138,43,226,0.15)]">
                    <Image
                      src={`/landing-step-${item.step}.png`}
                      alt={item.title}
                      width={800}
                      height={600}
                      className="w-full rounded-lg object-cover h-[350px]"
                    />
                  </div>
                </div>
              </div>

              {/* Connector line */}
              {index < 2 && (
                <div className="h-16 w-0.5 bg-gradient-to-b from-purple-600/50 to-purple-600/0 mx-auto my-0 hidden lg:block"></div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <Link href={"/dashboard"}>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 px-8 py-3 h-auto text-lg rounded-xl shadow-lg shadow-purple-900/20 transition-all duration-300 hover:shadow-purple-900/30">
              Try It Now <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
