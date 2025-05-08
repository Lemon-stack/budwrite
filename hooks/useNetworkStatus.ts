import { useState, useEffect } from "react";

type NetworkStatus = {
  isOnline: boolean;
  strength: "strong" | "good" | "weak";
  message: string;
};

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: true,
    strength: "strong",
    message: "Strong connection",
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      if (!navigator.onLine) {
        setStatus({
          isOnline: false,
          strength: "weak",
          message: "No internet connection",
        });
        return;
      }

      // Simulate connection strength based on navigator.connection if available
      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        if (connection.effectiveType === "4g") {
          setStatus({
            isOnline: true,
            strength: "strong",
            message: "Strong connection (4G)",
          });
        } else if (connection.effectiveType === "3g") {
          setStatus({
            isOnline: true,
            strength: "good",
            message: "Good connection (3G)",
          });
        } else {
          setStatus({
            isOnline: true,
            strength: "weak",
            message: "Weak connection (2G)",
          });
        }
      } else {
        // Fallback if connection API is not available
        setStatus({
          isOnline: true,
          strength: "good",
          message: "Connection status available",
        });
      }
    };

    // Initial check
    updateNetworkStatus();

    // Add event listeners
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    if ("connection" in navigator) {
      (navigator as any).connection.addEventListener(
        "change",
        updateNetworkStatus
      );
    }

    // Cleanup
    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
      if ("connection" in navigator) {
        (navigator as any).connection.removeEventListener(
          "change",
          updateNetworkStatus
        );
      }
    };
  }, []);

  return status;
}
