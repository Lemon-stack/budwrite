import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wifi, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NetworkStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: {
    isOnline: boolean;
    strength: "strong" | "good" | "weak";
    message: string;
  };
}

export function NetworkStatusDialog({
  open,
  onOpenChange,
  status,
}: NetworkStatusDialogProps) {
  const getStatusColor = () => {
    if (!status.isOnline) return "text-red-500";
    switch (status.strength) {
      case "strong":
        return "text-green-500";
      case "good":
        return "text-yellow-500";
      case "weak":
        return "text-red-500";
    }
  };

  const getConnectionImpact = () => {
    if (!status.isOnline) {
      return {
        title: "No Connection",
        description:
          "Story generation is not possible without an internet connection. Please check your connection and try again.",
        severity: "error",
      };
    }

    switch (status.strength) {
      case "strong":
        return {
          title: "Optimal Connection",
          description:
            "Your connection is ideal for story generation. You can proceed with confidence.",
          severity: "success",
        };
      case "good":
        return {
          title: "Moderate Connection",
          description:
            "Your connection is acceptable but may experience occasional delays. Consider waiting for a stronger connection to avoid potential credit loss.",
          severity: "warning",
        };
      case "weak":
        return {
          title: "Poor Connection",
          description:
            "Your connection is not recommended for story generation. Weak connections may lead to failed generations and credit loss. Please wait for a better connection.",
          severity: "error",
        };
    }
  };

  const impact = getConnectionImpact();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wifi className={`h-5 w-5 ${getStatusColor()}`} />
            Network Status
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <p className="text-lg font-medium">{status.message}</p>

          <Alert
            variant={impact.severity === "error" ? "destructive" : "default"}
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{impact.title}</AlertTitle>
            <AlertDescription className="mt-2">
              {impact.description}
            </AlertDescription>
          </Alert>

          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">
              Connection Impact on Story Generation:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                Strong connections ensure reliable story generation and prevent
                credit loss
              </li>
              <li>Weak connections may cause timeouts or failed generations</li>
              <li>
                Each failed generation due to connection issues will still
                consume credits
              </li>
              <li>
                We recommend waiting for a stable connection before generating
                stories
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
