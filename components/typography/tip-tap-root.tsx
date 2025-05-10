"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code2,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Pilcrow,
} from "lucide-react";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";

interface TipTapRootProps {
  content: string;
  onUpdate: (content: string) => void;
}

export function TipTapRoot({ content, onUpdate }: TipTapRootProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
    autofocus: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1 p-1 border rounded-lg bg-background">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            "p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("bold") && "bg-accent",
            !editor.can().chain().focus().toggleBold().run() &&
              "opacity-50 cursor-not-allowed"
          )}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            "p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("italic") && "bg-accent",
            !editor.can().chain().focus().toggleItalic().run() &&
              "opacity-50 cursor-not-allowed"
          )}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={cn(
            "p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("strike") && "bg-accent",
            !editor.can().chain().focus().toggleStrike().run() &&
              "opacity-50 cursor-not-allowed"
          )}
          aria-label="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={cn(
            "p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("code") && "bg-accent",
            !editor.can().chain().focus().toggleCode().run() &&
              "opacity-50 cursor-not-allowed"
          )}
          aria-label="Inline code"
        >
          <Code className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={cn(
            "p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("paragraph") && "bg-accent"
          )}
          aria-label="Paragraph"
        >
          <Pilcrow className="h-4 w-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={cn(
            "p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("heading", { level: 1 }) && "bg-accent",
            !editor.can().chain().focus().toggleHeading({ level: 1 }).run() &&
              "opacity-50 cursor-not-allowed"
          )}
          aria-label="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            "p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("heading", { level: 2 }) && "bg-accent",
            !editor.can().chain().focus().toggleHeading({ level: 2 }).run() &&
              "opacity-50 cursor-not-allowed"
          )}
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={cn(
            "p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("heading", { level: 3 }) && "bg-accent",
            !editor.can().chain().focus().toggleHeading({ level: 3 }).run() &&
              "opacity-50 cursor-not-allowed"
          )}
          aria-label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("bulletList") && "bg-accent"
          )}
          aria-label="Bullet list"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("orderedList") && "bg-accent"
          )}
          aria-label="Ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("blockquote") && "bg-accent"
          )}
          aria-label="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={cn(
            "p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("horizontalRule") && "bg-accent"
          )}
          aria-label="Horizontal rule"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={cn(
            "p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            !editor.can().chain().focus().undo().run() &&
              "opacity-50 cursor-not-allowed"
          )}
          aria-label="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={cn(
            "p-2 rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            !editor.can().chain().focus().redo().run() &&
              "opacity-50 cursor-not-allowed"
          )}
          aria-label="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>
      <div className="[&_h1]:text-4xl [&_h1]:font-bold [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:text-2xl [&_h3]:font-bold [&_p]:my-2 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-white [&_blockquote]:pl-4 [&_blockquote]:my-2 [&_blockquote]:italic [&_pre]:bg-accent [&_pre]:p-4 [&_pre]:rounded [&_code]:bg-accent [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_hr]:my-4 [&_hr]:border-t [&_hr]:border-white/20">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
