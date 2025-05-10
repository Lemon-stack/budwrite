"use client";

import { useEffect, use, useState } from "react";
import { useWriting } from "@/hooks/useWriting";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Command, Save, Plus, Loader } from "lucide-react";
import { TipTapRoot } from "@/components/typography/tip-tap-root";
import { useHotkeys } from "react-hotkeys-hook";
export default function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = use(params).id;
  const [isSaving, setIsSaving] = useState(false);
  const {
    writing,
    isLoading,
    error,
    updateWriting,
    saveWriting,
    hasUnsavedChanges,
  } = useWriting(id);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveWriting();
      toast.success("Writing saved successfully");
    } catch (err) {
      toast.error("Failed to save writing");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const preventDefaultSave = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", preventDefaultSave);
    return () => document.removeEventListener("keydown", preventDefaultSave);
  }, []);

  useHotkeys(
    "ctrl+s",
    () => {
      handleSave();
    },
    { enableOnContentEditable: true }
  );
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
    <section className="flex h-dvh flex-col items-center gap-4 p-4">
      <div className="max-w-3xl min-h-full w-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Input
              type="text"
              value={writing?.title || ""}
              onChange={(e) => {
                updateWriting({ title: e.target.value });
              }}
              className="text-lg font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              placeholder="Untitled"
            />
            <Button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              className="gap-2 bg-gradient-green text-white"
            >
              {isSaving ? (
                <Loader className="animate-spin size-4" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="flex-1 w-full mt-4 h-full">
          <TipTapRoot
            content={writing?.content || ""}
            onUpdate={(content) => updateWriting({ content })}
          />
        </div>
      </div>
    </section>
  );
}
