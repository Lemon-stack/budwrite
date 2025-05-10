import DasboardSidebar from "@/components/dashboard/side-bar";
import BottomControlBar from "@/components/ui/bottom-controller";
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <DasboardSidebar />
      <main className="flex-1 p-4 relative md:p-6 overflow-auto">
        {children}
        <BottomControlBar />
      </main>
    </div>
  );
}
