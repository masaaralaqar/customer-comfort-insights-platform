
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { MessageSquare, ClipboardList, ChartBar } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 dir-rtl">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">نظام إدارة رضا العملاء</h1>
            <p className="text-xl text-gray-600">
              لوحة تحكم متكاملة لمتابعة وتحليل مؤشرات خدمة العملاء ورضاهم عن خدمات الصيانة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="border shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">خدمة العملاء</CardTitle>
                <CardDescription>
                  متابعة وتحليل المكالمات والاستفسارات وطلبات الصيانة
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span>تحليل اتجاهات المكالمات</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span>متابعة الاستفسارات</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span>إدارة طلبات الصيانة</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => navigate("/customer-service-dashboard")}
                >
                  عرض التقارير
                </Button>
              </CardFooter>
            </Card>

            <Card className="border shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">رضا العملاء عن الصيانة</CardTitle>
                <CardDescription>
                  قياس مستوى رضا العملاء عن خدمات الصيانة المقدمة
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span>قياس رضا العملاء عن الخدمات</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span>تقييم مدة إغلاق الطلبات</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span>تحليل حل المشكلات من أول مرة</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => navigate("/maintenance-satisfaction")}
                >
                  عرض التقارير
                </Button>
              </CardFooter>
            </Card>

            <Card className="border shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ChartBar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">إدخال البيانات</CardTitle>
                <CardDescription>
                  إضافة وتحديث بيانات الخدمة واستطلاعات الرأي
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span>إدخال بيانات المكالمات</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span>تسجيل استطلاعات الرأي</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span>متابعة حالة الطلبات</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => navigate("/data-entry")}
                >
                  إدخال البيانات
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="pt-10 flex justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="px-8"
            >
              تسجيل الدخول للنظام
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
