
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      addNotification({
        title: "خطأ",
        message: "الرجاء إدخال اسم المستخدم وكلمة المرور",
        type: "error"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        addNotification({
          title: "تم تسجيل الدخول",
          message: "تم تسجيل الدخول بنجاح",
          type: "success"
        });
        navigate("/dashboard");
      } else {
        addNotification({
          title: "خطأ",
          message: "اسم المستخدم أو كلمة المرور غير صحيحة",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      addNotification({
        title: "خطأ",
        message: "حدث خطأ أثناء تسجيل الدخول",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout requireAuth={false}>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-background">
        <div className="w-full max-w-md p-4">
          <Card className="w-full overflow-hidden border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6 space-y-1 text-center bg-primary/10">
              <CardTitle className="text-2xl font-bold">مرحباً بك</CardTitle>
              <CardDescription>تسجيل الدخول إلى لوحة التحكم</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <Input
                    id="username"
                    placeholder="أدخل اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full transition-all hover:shadow-md"
                  disabled={loading}
                >
                  {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center pt-0">
              <p className="text-sm text-muted-foreground">
                منصة إلكترونية لإدارة مؤشرات راحة العملاء
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
