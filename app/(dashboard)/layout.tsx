import ProtectedRoute from "@/components/protected-route";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
      <Toaster />
    </ProtectedRoute>
  );
} 