import Logo from "@/components/logo";
import BottomControlBar from "@/components/ui/bottom-controller";
import { BookOpen, File, Lightbulb, Settings } from "lucide-react";

const quickStart = [
  {
    title: "Fresh Page",
    icon: File,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

export default function Home() {
  return (
    <section className="flex h-dvh items-center justify-center flex-col gap-12">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Logo
            icon="size-6"
            text="text-2xl"
            showCaption={true}
          />
        </div>
      </div>
      <BottomControlBar />
    </section>
  );
}
