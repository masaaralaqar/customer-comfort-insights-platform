
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        addNotification({
          title: "تم تسجيل الدخول بنجاح",
          message: `مرحباً بك ${username}`,
          type: "success",
        });
      } else {
        addNotification({
          title: "فشل تسجيل الدخول",
          message: "اسم المستخدم أو كلمة المرور غير صحيحة",
          type: "error",
        });
      }
    } catch (error) {
      addNotification({
        title: "خطأ",
        message: "حدث خطأ أثناء محاولة تسجيل الدخول",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout requireAuth={false}>
      <div className="container flex items-center justify-center min-h-screen">
        <div className="absolute top-4 left-4">
          <ThemeToggle />
        </div>
        <Card className="w-[350px] md:w-[450px]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">منصة إدارة راحة العملاء</CardTitle>
            <CardDescription>شركة الرمز العقارية</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
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
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
