import { SidebarProvider } from "@/components/ui/sidebar";
import DasboardSidebar from "../../components/dashboard/side-bar";
import { Header } from "@/components/dashboard/header";
import AuthProvider from "@/context/auth";

export default function Dashboard({children}: Readonly<{
    children: React.ReactNode
  }>){
    return(
      <AuthProvider>
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <DasboardSidebar />
              <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 p-4 md:p-6">{children}</main>
              </div>
            </div>
          </SidebarProvider>
      </AuthProvider>
    )
}