"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { StarHalf, Type } from "lucide-react";

interface TypewriterInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  typingSpeed?: number;
  erasingSpeed?: number;
  delayBetweenSentences?: number;
  onTypingComplete?: (sentence: string) => void;
  onTypingStart?: (sentence: string) => void;
  autoStart?: boolean;
  loop?: boolean;
  maxLength?: number;
}

export function TypewriterInput({
  typingSpeed = 70, // in milliseconds per character
  erasingSpeed = 30, // in milliseconds per character
  delayBetweenSentences = 1500,
  onTypingComplete,
  onTypingStart,
  autoStart = true,
  loop = true,
  className,
  onChange,
  value,
  maxLength = 35, // Default max length for titles
  ...props
}: TypewriterInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [isPaused, setIsPaused] = useState(!autoStart);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isUserTyping = useRef(false);
  const sentences = [
    "The Library of Lost Souls ...",
    "Madara a merchant of war ...",
    "The Last Page of History ...",
    "The Book of Whispers ...",
    "Two Worlds ...",
  ];

  // Calculate cursor position in pixels
  const calculateCursorPosition = useCallback(() => {
    if (!inputRef.current || !containerRef.current) return 0;

    // Create a temporary span to measure text width
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.whiteSpace = "pre";
    span.style.font = window.getComputedStyle(inputRef.current).font;
    span.textContent = displayValue || "";

    // Append to container, measure, then remove
    containerRef.current.appendChild(span);
    const width = span.getBoundingClientRect().width;
    containerRef.current.removeChild(span);

    // Add padding offset (assuming left padding is 12px)
    const paddingLeft = 12;
    // Add extra spacing when typing vs erasing
    const cursorSpacing = isTyping ? 8 : 0;
    return Math.min(
      width + paddingLeft + cursorSpacing,
      inputRef.current.offsetWidth - 20
    );
  }, [displayValue, isTyping]);

  // Update cursor position whenever display value changes
  useEffect(() => {
    if (!showPlaceholder) return; // Only update cursor position when placeholder is visible

    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      setCursorPosition(calculateCursorPosition());
    }, 10);

    return () => clearTimeout(timer);
  }, [calculateCursorPosition, showPlaceholder]);

  // Clear any existing timers when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Focus the input and set cursor position
  // const focusAndSetCursor = (position: number) => {
  //   if (inputRef.current) {
  //     inputRef.current.focus()
  //     inputRef.current.setSelectionRange(position, position)
  //   }
  // }

  // Main typewriter effect logic
  useEffect(() => {
    if (sentences.length === 0 || isPaused || isUserTyping.current) return;

    const currentSentence = sentences[currentSentenceIndex];

    if (isTyping) {
      if (displayValue.length < currentSentence.length) {
        // Still typing the current sentence
        timerRef.current = setTimeout(() => {
          const nextChar = currentSentence.charAt(displayValue.length);
          const newValue = displayValue + nextChar;
          setDisplayValue(newValue);

          // Call the onChange handler to update the parent component's state
          if (onChange) {
            const event = {
              target: { value: newValue },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(event);
          }
        }, typingSpeed);
      } else {
        // Finished typing the current sentence
        setIsTyping(false);
        if (onTypingComplete) {
          onTypingComplete(currentSentence);
        }

        // Wait before starting to erase
        timerRef.current = setTimeout(() => {
          setIsErasing(true);
        }, delayBetweenSentences);
      }
    } else if (isErasing) {
      if (displayValue.length > 0) {
        // Still erasing the current sentence
        timerRef.current = setTimeout(() => {
          const newValue = displayValue.slice(0, -1);
          setDisplayValue(newValue);

          // Call the onChange handler to update the parent component's state
          if (onChange) {
            const event = {
              target: { value: newValue },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(event);
          }
        }, erasingSpeed);
      } else {
        // Finished erasing, move to the next sentence
        setIsErasing(false);
        const nextIndex = (currentSentenceIndex + 1) % sentences.length;

        // If we've gone through all sentences and loop is false, stop
        if (nextIndex === 0 && !loop) {
          setIsPaused(true);
          return;
        }

        setCurrentSentenceIndex(nextIndex);

        // Wait before starting to type the next sentence
        timerRef.current = setTimeout(() => {
          if (onTypingStart) {
            onTypingStart(sentences[nextIndex]);
          }
          setIsTyping(true);
        }, typingSpeed * 3);
      }
    } else {
      // Initial state or after reset - start typing
      if (onTypingStart) {
        onTypingStart(currentSentence);
      }
      setIsTyping(true);
    }
  }, [
    displayValue,
    currentSentenceIndex,
    isTyping,
    isErasing,
    isPaused,
    sentences,
    typingSpeed,
    erasingSpeed,
    delayBetweenSentences,
    loop,
    onChange,
    onTypingComplete,
    onTypingStart,
  ]);

  // Methods to control the animation
  const start = () => {
    isUserTyping.current = false;
    if (!isTyping && !isErasing) {
      setIsTyping(true);
    }
    setIsPaused(false);
  };

  const pause = () => {
    setIsPaused(true);
  };

  const reset = () => {
    setDisplayValue("");
    setCurrentSentenceIndex(0);
    setIsTyping(false);
    setIsErasing(false);
    setIsPaused(true);
    isUserTyping.current = false;
    setCursorPosition(0);

    // Call the onChange handler to update the parent component's state
    if (onChange) {
      const event = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  // Handle manual input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If user is manually typing, pause the automatic typing and hide placeholder
    isUserTyping.current = true;
    setIsPaused(true);
    setShowPlaceholder(false);

    // Ensure the value doesn't exceed maxLength
    const newValue = e.target.value.slice(0, maxLength);
    setDisplayValue(newValue);

    // Call the original onChange handler with the truncated value
    if (onChange) {
      const event = {
        ...e,
        target: { ...e.target, value: newValue },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }

    // Update cursor position after a small delay
    setTimeout(() => {
      setCursorPosition(calculateCursorPosition());
    }, 10);
  };

  // Handle focus events
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Hide placeholder when input is focused
    setShowPlaceholder(false);

    // Call the original onFocus handler if provided
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  // Handle blur events
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Show placeholder again if input is empty
    if (!e.target.value) {
      setShowPlaceholder(true);
    }

    // Call the original onBlur handler if provided
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  // Handle click events
  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // If the user clicks in the input, consider it as manual interaction
    isUserTyping.current = true;
    setIsPaused(true);

    // Call the original onClick handler if provided
    if (props.onClick) {
      props.onClick(e);
    }

    // Update cursor position after a small delay
    setTimeout(() => {
      setCursorPosition(calculateCursorPosition());
    }, 10);
  };

  // Default cursor icon if none provided
  const defaultCursor = (
    <StarHalf
      className={cn(
        "h-4 w-4 text-primary fill-primary"
        // (isTyping || isErasing) && !isPaused ? "animate" : ""
      )}
    />
  );

  return (
    <div ref={containerRef} className="relative">
      <Input
        {...props}
        ref={inputRef}
        value={value !== undefined ? value : displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        className={cn(
          showPlaceholder ? "caret-transparent" : "", // Only hide cursor during placeholder animation
          className
        )}
      />

      {/* Custom cursor icon and placeholder animation */}
      {showPlaceholder && (
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-100",
            (isTyping || isErasing) && !isPaused ? "opacity-70" : "opacity-70"
          )}
          style={{
            left: `${cursorPosition}px`,
            // Smooth transition for cursor movement
            transition: "left 0.1s ease-out",
          }}
        >
          {defaultCursor}
        </div>
      )}
    </div>
  );
}
