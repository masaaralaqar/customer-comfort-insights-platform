
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const { login, users } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // التحقق من قائمة المستخدمين عند تحميل الصفحة
  useEffect(() => {
    console.log("قائمة المستخدمين المتاحة عند تحميل صفحة تسجيل الدخول:", users);
    const savedUsers = localStorage.getItem('auth_users');
    if (savedUsers) {
      console.log('المستخدمون المحفوظون في localStorage:', JSON.parse(savedUsers));
    }
  }, [users]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("محاولة تسجيل الدخول باستخدام:", username, password);
      
      // التحقق من صحة قيم الإدخال
      if (!username || !password) {
        addNotification({
          title: "خطأ في تسجيل الدخول",
          message: "يرجى إدخال اسم المستخدم وكلمة المرور",
          type: "error"
        });
        setLoading(false);
        return;
      }
      
      const success = await login(username, password);
      
      if (success) {
        addNotification({
          title: "تم تسجيل الدخول",
          message: "مرحباً بك في نظام الإدارة",
          type: "success"
        });
        navigate("/dashboard");
      } else {
        addNotification({
          title: "خطأ في تسجيل الدخول",
          message: "اسم المستخدم أو كلمة المرور غير صحيحة",
          type: "error"
        });
      }
    } catch (error) {
      console.error("خطأ في تسجيل الدخول:", error);
      addNotification({
        title: "خطأ في تسجيل الدخول",
        message: "اسم المستخدم أو كلمة المرور غير صحيحة",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
