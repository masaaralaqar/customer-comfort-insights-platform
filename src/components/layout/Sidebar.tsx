
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BarChart2,
  Database, 
  Settings, 
  MessageCircle, 
  Wrench, 
  LogOut, 
  User 
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { path: "/dashboard", label: "لوحة المؤشرات", icon: <LayoutDashboard size={18} /> },
    { path: "/data-entry", label: "إدخال البيانات", icon: <Database size={18} /> },
    { path: "/customer-service", label: "خدمة العملاء", icon: <MessageCircle size={18} /> },
    { path: "/complaints", label: "الشكاوى", icon: <BarChart2 size={18} /> },
    { path: "/maintenance", label: "الصيانة", icon: <Wrench size={18} /> },
    { path: "/settings", label: "الإعدادات", icon: <Settings size={18} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg">
      <div className="p-6 flex flex-col items-center border-b border-white/10">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
          <User size={32} className="text-white" />
        </div>
        <div className="text-center">
          <h3 className="font-bold">{user?.username || "مستخدم"}</h3>
          <p className="text-sm text-white/70">{user?.role || "مستخدم"}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive 
                      ? "bg-white/20 text-white font-medium" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          <span>تسجيل الخروج</span>
        </Button>
      </div>
    </div>
  );
}
