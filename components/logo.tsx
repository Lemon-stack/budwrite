import { StarHalf } from "lucide-react";

interface Props {
  text?: string;
  icon?: string;
}
const Logo = ({ text, icon }: Props) => (
  <div className="flex items-center justify-center">
    <StarHalf className={`${icon} size-6 -mr-2`} />
    <span className={`${text} text-2xl font-semibold`}>PictoStory</span>
  </div>
);

export default Logo;
