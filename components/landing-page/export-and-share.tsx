import { CheckCircle, ChevronRight, Download, Share2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export default function ExportAndShare() {
  return (
    <section className="pr-4 py-20 bg-gradient-to-b from-[#12121A] to-[#0B0B10]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="bg-[#12121A] rounded-r-xl p-4 relative overflow-hidden shadow-[0_0_25px_rgba(138,43,226,0.2)]">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Export Options Interface"
                width={600}
                height={500}
                className="w-full rounded-lg shadow-lg"
              />
              <div className="absolute top-2 right-2 bg-purple-600/20 backdrop-blur-sm rounded-full p-2">
                <Share2 className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl text-slate-100 md:text-4xl font-bold mb-6">
              Export & Share Your Stories
            </h2>
            <p className="text-gray-400 mb-8">
              Once your story is perfect, share it with the world in multiple
              formats. Our flexible export options make it easy to publish
              anywhere.
            </p>

            {[
              {
                title: "Social Media Sharing",
                description:
                  "Share directly to Instagram, Facebook, Twitter and more",
              },
              {
                title: "PDF Export",
                description:
                  "Create beautiful PDFs with your images and stories",
              },
              {
                title: "Private Link Sharing",
                description:
                  "Share your stories privately with friends and family",
              },
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-6 w-6 text-purple-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </li>
            ))}

            <div className="flex flex-wrap gap-4 mt-8">
              <Link href={"/dashboard"}>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Alright, Let's try it out
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {/* <Button
                variant="outline"
                className="border-purple-600 text-purple-400 hover:bg-purple-600/20"
              >
                <Download className="mr-2 h-4 w-4" /> Try a Sample Export
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
