import { LeafyGreen, StarHalf } from "lucide-react";
import { FlipWords } from "./ui/flip-words";

interface Props {
  text?: string;
  icon?: string;
  showCaption?: boolean;
  animation?: boolean;
}

const Logo = ({ text, icon, showCaption, animation }: Props) => {
  const captionWords = [
    "Your personal assistant for writing",
    "Write with confidence",
    "Express yourself freely",
    "Create amazing content",
  ];

  return (
    <div className="flex items-center justify-center">
      <span className="bg-gradient-to-tr from-green-600/50 via-green-500/50 via-50% to-sidebar-accent/50 to-97% rounded-lg p-2 mr-2">
        <LeafyGreen className={`${icon} size-4`} />
      </span>
      <div className="flex flex-col">
        <span className={`${text} text-xl font-semibold`}>Yappwrite</span>
        {showCaption &&
          (animation ? (
            <FlipWords
              words={captionWords}
              className="text-sm text-muted-foreground"
              duration={4000}
            />
          ) : (
            <span className="text-sm text-muted-foreground">
              Your personal assistant for writing
            </span>
          ))}
      </div>
    </div>
  );
};

export default Logo;
