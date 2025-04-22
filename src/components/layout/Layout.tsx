
import { ReactNode, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export default function Layout({ children, requireAuth = true }: LayoutProps) {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!requireAuth) {
    return <div className="min-h-screen bg-background" dir="rtl">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-background/80" dir="rtl">
      <div className={`fixed inset-y-0 right-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0`}>
        <Sidebar />
      </div>
      
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full shadow-md bg-white" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>
      
      <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${sidebarOpen ? 'md:mr-64' : 'md:mr-0'}`}>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-6 min-h-[calc(100vh-3rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}
