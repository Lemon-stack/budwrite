"use client";

import React, { useState } from "react";
import { Volume2, Mic, Bot, Target, CircleOff } from "lucide-react";
import { VoiceTranscription } from "./voice-transcription";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const icons = [
  { icon: Volume2, label: "Sound" },
  { icon: Mic, label: "Speech" },
  { icon: Target, label: "Focus" },
];

export default function BottomControlBar() {
  const [showTranscription, setShowTranscription] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pathname = usePathname();
  const { setOpen } = useSidebar();

  // Only render if we're in the edit page

  if (!pathname?.startsWith("/home/w")) {
    return null;
  }

  const handleTranscriptionComplete = (text: string) => {
    // Handle the transcribed text here
    console.log("Transcribed text:", text);
    toast.success("Transcription complete");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
      setOpen(false);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      setOpen(true);
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 bg-neutral-900/90 rounded-xl shadow-lg flex items-center px-3 py-2 gap-3 border border-neutral-800">
      {icons.map(({ icon: Icon, label }, idx) => (
        <div key={label} className="relative">
          {label === "Speech" && showTranscription ? (
            <VoiceTranscription
              onTranscriptionComplete={handleTranscriptionComplete}
            />
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all ${
                    (label === "Speech" && showTranscription) ||
                    (label === "Focus" && isFullscreen)
                      ? "bg-gradient-to-tr from-green-600/50 via-green-500/50 via-50% to-sidebar-accent/50 to-97% text-white shadow-md"
                      : idx === 0
                        ? "bg-gradient-to-tr from-green-600/50 via-green-500/50 via-50% to-sidebar-accent/50 to-97% text-white shadow-md"
                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                  aria-label={label}
                  onClick={() => {
                    if (label === "Speech") {
                      setShowTranscription(!showTranscription);
                    } else if (label === "Focus") {
                      toggleFullscreen();
                    }
                  }}
                >
                  <Icon size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {label === "Focus"
                    ? isFullscreen
                      ? "Exit Focus Mode"
                      : "Focus Mode"
                    : label}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
}
