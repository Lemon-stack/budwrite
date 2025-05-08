"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { TextCursorIcon as Cursor, Type } from "lucide-react"; // Import Lucide icons
import { TextCursorIcon as CursorText } from "lucide-react";

export const TypewriterEffect = ({
  words,
  sentences = [],
  className,
  cursorClassName,
  typingSpeed = 0.05,
  erasingSpeed = 0.03,
  delayBetweenSentences = 1000,
  cursorIcon = "default", // New prop to select cursor icon
}: {
  words?: {
    text: string;
    className?: string;
  }[];
  sentences?: string[];
  className?: string;
  cursorClassName?: string;
  typingSpeed?: number;
  erasingSpeed?: number;
  delayBetweenSentences?: number;
  cursorIcon?: "default" | "cursor" | "cursorText" | "type"; // Options for cursor icon
}) => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<any>(null);

  // Process either individual words or a sentence
  const processContent = () => {
    if (sentences && sentences.length > 0) {
      // If we have sentences, use the current one and split it into words
      const currentSentence = sentences[currentSentenceIndex];
      return currentSentence.split(" ").map((word) => ({
        text: word.split(""),
        className: "",
      }));
    } else if (words) {
      // Otherwise use the provided words
      return words.map((word) => ({
        ...word,
        text: word.text.split(""),
      }));
    }
    return [];
  };

  const wordsArray = processContent();

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${index}`}
                  className={cn(
                    `dark:text-white text-black opacity-0 hidden`,
                    word.className
                  )}
                  data-char-index={`${idx}-${index}`}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
    );
  };

  // Render the appropriate cursor based on the cursorIcon prop
  const renderCursor = () => {
    const animationProps = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: {
        duration: 0.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
      },
      className: cn("inline-block ml-1", cursorClassName),
    };

    // Size adjustments for different screen sizes
    const iconSize = "w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8";

    switch (cursorIcon) {
      case "cursor":
        return (
          <motion.div {...animationProps}>
            <Cursor className={cn(iconSize, "text-blue-500")} />
          </motion.div>
        );
      case "cursorText":
        return (
          <motion.div {...animationProps}>
            <CursorText className={cn(iconSize, "text-blue-500")} />
          </motion.div>
        );
      case "type":
        return (
          <motion.div {...animationProps}>
            <Type className={cn(iconSize, "text-blue-500")} />
          </motion.div>
        );
      default:
        // Default cursor (the original vertical bar)
        return (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse" as const,
            }}
            className={cn(
              "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
              cursorClassName
            )}
          ></motion.span>
        );
    }
  };

  useEffect(() => {
    if (isInView && !isAnimating) {
      setIsAnimating(true);

      const animateTypewriter = async () => {
        try {
          // Get all spans for animation
          const spans = document.querySelectorAll(`[data-char-index]`);
          const spanArray = Array.from(spans);

          // Type from left to right (faster)
          await animate(
            spanArray,
            {
              display: "inline-block",
              opacity: 1,
            },
            {
              duration: typingSpeed,
              delay: stagger(typingSpeed),
              ease: "linear",
            }
          );

          // Wait before erasing
          await new Promise((resolve) =>
            setTimeout(resolve, delayBetweenSentences)
          );

          // Erase from right to left (faster)
          await animate(
            [...spanArray].reverse(),
            {
              opacity: 0,
              display: "none",
            },
            {
              duration: erasingSpeed,
              delay: stagger(erasingSpeed),
              ease: "linear",
            }
          );

          // Move to next sentence
          setCurrentSentenceIndex((prev) =>
            prev === (sentences?.length || 1) - 1 ? 0 : prev + 1
          );
          setIsAnimating(false);
        } catch (error) {
          console.error("Animation error:", error);
          setIsAnimating(false);
        }
      };

      animationRef.current = animateTypewriter();

      return () => {
        // Cleanup animation if component unmounts during animation
        if (
          animationRef.current &&
          typeof animationRef.current.cancel === "function"
        ) {
          animationRef.current.cancel();
        }
      };
    }
  }, [
    isInView,
    currentSentenceIndex,
    isAnimating,
    sentences,
    animate,
    typingSpeed,
    erasingSpeed,
    delayBetweenSentences,
  ]);

  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
        className
      )}
    >
      {renderWords()}
      {renderCursor()}
    </div>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
  cursorIcon,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
  cursorIcon?: "default" | "cursor" | "cursorText" | "type";
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(`dark:text-white text-black `, word.className)}
                >
                  {char}
                </span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </div>
    );
  };

  // Render the appropriate cursor based on the cursorIcon prop
  const renderCursor = () => {
    const animationProps = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: {
        duration: 0.8,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
      },
      className: cn("inline-block ml-1", cursorClassName),
    };

    // Size adjustments for different screen sizes
    const iconSize = "w-4 h-4 sm:w-5 sm:h-5 xl:w-6 xl:h-6";

    switch (cursorIcon) {
      case "cursor":
        return (
          <motion.div {...animationProps}>
            <Cursor className={cn(iconSize, "text-blue-500")} />
          </motion.div>
        );
      case "cursorText":
        return (
          <motion.div {...animationProps}>
            <CursorText className={cn(iconSize, "text-blue-500")} />
          </motion.div>
        );
      case "type":
        return (
          <motion.div {...animationProps}>
            <Type className={cn(iconSize, "text-blue-500")} />
          </motion.div>
        );
      default:
        // Default cursor (the original vertical bar)
        return (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse" as const,
            }}
            className={cn(
              "block rounded-sm w-[4px] h-4 sm:h-6 xl:h-12 bg-blue-500",
              cursorClassName
            )}
          ></motion.span>
        );
    }
  };

  return (
    <div className={cn("flex space-x-1 my-6", className)}>
      <motion.div
        className="overflow-hidden pb-2"
        initial={{
          width: "0%",
        }}
        whileInView={{
          width: "fit-content",
        }}
        transition={{
          duration: 2,
          ease: "linear",
          delay: 1,
        }}
      >
        <div
          className="text-xs sm:text-base md:text-xl lg:text:3xl xl:text-5xl font-bold"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {renderWords()}{" "}
        </div>{" "}
      </motion.div>
      {renderCursor()}
    </div>
  );
};
