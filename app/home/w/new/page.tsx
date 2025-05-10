"use client";

import { useEffect, useRef } from "react";
import { useWriting } from "@/hooks/useWriting";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import EditPage from "../[id]/page";

export default function NewWritingPage() {
  return <EditPage params={Promise.resolve({ id: "new" })} />;
}
