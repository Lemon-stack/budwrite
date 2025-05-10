import { LeafyGreen } from "lucide-react";

interface Props {
  text?: string;
  icon?: string;
  showCaption?: boolean;
}

const Logo = ({ text, icon, showCaption }: Props) => {
  return (
    <div className="flex items-center justify-center">
      <span className="bg-gradient-to-tr from-green-600/50 via-green-500/50 via-50% to-sidebar-accent/50 to-97% rounded-lg p-2 mr-2">
        <LeafyGreen className={`${icon} size-4`} />
      </span>
      <div className="flex flex-col">
        <span className={`${text} text-xl font-semibold`}>Yappwrite</span>
        {showCaption && (
          <span className="text-sm text-muted-foreground">
            Your personal assistant for writing
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
