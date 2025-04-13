import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanStoryContent(content: string): string {
  // Split by \n\n and take everything after the first part
  const parts = content.split("\n\n");
  if (parts.length > 1) {
    return parts.slice(1).join("\n\n");
  }
  return content;
}
