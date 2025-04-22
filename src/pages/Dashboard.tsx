
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useMetrics } from "@/context/MetricsContext";
import MetricCard from "@/components/dashboard/MetricCard";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { PieChart } from "@/components/charts/PieChart";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { metrics, qualityData, npsData, callsData, currentPeriod, setCurrentPeriod } = useMetrics();
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const { data, error } = await supabase
          .from('complaints')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        setRecentComplaints(data || []);
      } catch (error) {
        console.error('Error loading complaints:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadComplaints();
  }, []);

  // Transform data for charts
  const qualityChartData = qualityData.map(item => ({
    name: item.week,
    'جودة المرافق': item.facilityManagement,
    'جودة الصيانة': item.maintenance,
    'جودة التسليم': item.delivery,
  }));

  const npsChartData = npsData.map(item => ({
    name: item.week,
    'العملاء الجدد': item.newCustomers,
    'بعد السنة الأولى': item.afterFirstYear,
    'العملاء القدامى': item.longTerm,
  }));

  const callsChartData = callsData.map(item => ({
    name: item.category,
    value: item.count,
  }));

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">لوحة المؤشرات</h1>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={currentPeriod === "weekly" ? "default" : "outline"}
              onClick={() => setCurrentPeriod("weekly")}
              className="transition-all shadow-sm hover:shadow"
            >
              أسبوعي
            </Button>
            <Button
              variant={currentPeriod === "yearly" ? "default" : "outline"}
              onClick={() => setCurrentPeriod("yearly")}
              className="transition-all shadow-sm hover:shadow"
            >
              سنوي
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} className="card-hover transition-all" />
          ))}
        </div>

        <Tabs defaultValue="quality" className="space-y-6">
          <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full bg-white/40 backdrop-blur-sm p-1 rounded-lg">
            <TabsTrigger value="quality" className="text-sm md:text-base">جودة الخدمات</TabsTrigger>
            <TabsTrigger value="nps" className="text-sm md:text-base">مؤشرات الترشيح</TabsTrigger>
            <TabsTrigger value="calls" className="text-sm md:text-base">توزيع المكالمات</TabsTrigger>
          </TabsList>

          <TabsContent value="quality" className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm">
            <Card className="border-none bg-transparent">
              <CardHeader>
                <CardTitle>مؤشرات الجودة {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
                <CardDescription>جودة إدارة المرافق، الصيانة والتسليم</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <LineChart 
                    data={qualityChartData} 
                    colors={['#10b981', '#3b82f6', '#f97316']} 
                    gridClassName="text-gray-400 opacity-30"
                    legendClassName="text-sm text-gray-600"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nps" className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm">
            <Card className="border-none bg-transparent">
              <CardHeader>
                <CardTitle>مؤشرات الترشيح {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
                <CardDescription>نسبة الترشيح للعملاء الجدد، بعد السنة الأولى، والعملاء القدامى</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <BarChart 
                    data={npsChartData} 
                    colors={['#22c55e', '#8b5cf6', '#ef4444']} 
                    gridClassName="text-gray-400 opacity-30"
                    legendClassName="text-sm text-gray-600"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls" className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm">
            <Card className="border-none bg-transparent">
              <CardHeader>
                <CardTitle>توزيع المكالمات {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
                <CardDescription>توزيع المكالمات حسب النوع</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-80 w-full max-w-md">
                  <PieChart 
                    data={callsChartData} 
                    colors={['#3b82f6', '#8b5cf6', '#ef4444', '#f97316', '#10b981', '#06b6d4']} 
                    legendClassName="text-sm text-gray-600"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-white/70 backdrop-blur-sm shadow-sm border-none">
          <CardHeader>
            <CardTitle>آخر الشكاوى المسجلة</CardTitle>
            <CardDescription>أحدث 5 شكاوى تم تسجيلها في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-4 text-muted-foreground">جاري تحميل البيانات...</p>
            ) : recentComplaints.length > 0 ? (
              <div className="overflow-x-auto rounded-md">
                <table className="w-full border-collapse">
                  <thead className="bg-muted/50">
                    <tr className="text-right text-sm font-medium text-muted-foreground">
                      <th className="p-3">رقم التذكرة</th>
                      <th className="p-3">اسم العميل</th>
                      <th className="p-3">المشروع</th>
                      <th className="p-3">الشكوى</th>
                      <th className="p-3">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentComplaints.map((complaint: any) => (
                      <tr key={complaint.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3 text-sm">{complaint.ticket_number || '-'}</td>
                        <td className="p-3 text-sm">{complaint.client_name || '-'}</td>
                        <td className="p-3 text-sm">{complaint.project || '-'}</td>
                        <td className="p-3 text-sm line-clamp-1">{complaint.complaint || '-'}</td>
                        <td className="p-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            complaint.status === 'مغلقة' ? 'bg-success-light text-green-700' :
                            complaint.status === 'قيد المعالجة' ? 'bg-warning-light text-amber-700' : 
                            'bg-error-light text-red-700'
                          }`}>
                            {complaint.status || 'جديدة'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">لا توجد شكاوى مسجلة</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
