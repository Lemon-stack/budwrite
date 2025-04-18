import HTMLFlipBook from "react-pageflip";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "../../hooks/use-media-query";

interface BookDisplayStoryProps {
  content: string;
  title: string;
  image: string;
  className?: string;
}

export default function BookDisplayStory({
  content,
  title,
  image,
  className,
}: BookDisplayStoryProps) {
  // Remove the title from content and split into pages
  const cleanContent = content.replace(/\*\*.*?\*\*/g, "").trim(); // Remove any **title** pattern
  const pages = cleanContent.split(/\n\n+/).filter((page) => page.trim());
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const isMediumScreen = useMediaQuery("(max-width: 1024px)");

  if (isSmallScreen) {
    return (
      <div
        className={cn(
          "w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg px-4 py-6",
          className
        )}
      >
        <div className="mb-6">
          <img
            src={image}
            alt="Story cover"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h1 className="text-2xl font-bold text-center break-words">
            {title}
          </h1>
        </div>
        <div className="space-y-6">
          {pages.map((page, index) => (
            <div key={index} className="text-gray-900">
              <p className="text-base leading-relaxed break-words whitespace-pre-wrap">
                {page}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate dimensions based on screen size
  const dimensions = isMediumScreen
    ? { width: 300, height: 500 } // Portrait mode for medium screens
    : { width: 550, height: 733 }; // Landscape mode for large screens

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <div className="flex justify-center">
        <HTMLFlipBook
          width={dimensions.width}
          height={dimensions.height}
          size="stretch"
          minWidth={300}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="book-content"
          style={{ margin: "0 auto" }}
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={isMediumScreen}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={0}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {/* Cover Page */}
          <div className="page bg-white">
            <div className="page-content h-full relative">
              <img
                src={image}
                alt="Story cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h1 className="text-4xl font-bold text-white text-center px-4">
                  {title}
                </h1>
              </div>
            </div>
          </div>

          {/* Blank First Page */}
          <div className="page bg-white">
            <div className="page-content h-full" />
          </div>

          {/* Content Pages */}
          {pages.map((page, index) => (
            <div key={index} className="page bg-white p-8 shadow-lg">
              <div className="page-content">
                <p className="text-lg leading-relaxed text-gray-900">{page}</p>
              </div>
            </div>
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
}
