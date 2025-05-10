"use client";

import { useEffect, useRef } from "react";
import { useWriting } from "@/hooks/useWriting";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function NewWritingPage() {
  const { writing, isLoading, error, updateWriting, hasUnsavedChanges } =
    useWriting("new");
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize content when writing is loaded
  useEffect(() => {
    if (writing && contentRef.current && !contentRef.current.innerHTML) {
      contentRef.current.innerHTML = writing.content;
    }
  }, [writing]);

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-dvh items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <section className="flex h-dvh flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Input
            type="text"
            value={writing?.title || ""}
            onChange={(e) => {
              updateWriting({ title: e.target.value });
            }}
            className="text-2xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            placeholder="Untitled"
          />
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          )}
        </div>
      </div>
      <div
        ref={contentRef}
        contentEditable
        className="flex-1 w-full p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20"
        onInput={(e) => {
          updateWriting({ content: e.currentTarget.innerHTML });
        }}
        suppressContentEditableWarning
      />
    </section>
  );
}
