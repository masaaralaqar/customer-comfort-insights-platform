
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
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 text-white border-l border-gray-700/30 shadow-xl">
      <div className="p-6 flex flex-col items-center border-b border-gray-700/30">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center mb-3">
          <User size={32} className="text-primary" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-white">{user?.username || "مستخدم"}</h3>
          <p className="text-sm text-gray-300">{user?.role || "مستخدم"}</p>
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
                      ? "bg-gray-700/30 text-white font-medium border-r-2 border-primary" 
                      : "text-gray-300 hover:bg-gray-700/20 hover:text-white"
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

      <div className="p-4 border-t border-gray-700/30">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/20"
          onClick={handleLogout}
        >
          <LogOut size={18} className="ml-2" />
          <span>تسجيل الخروج</span>
        </Button>
      </div>
    </div>
  );
}
