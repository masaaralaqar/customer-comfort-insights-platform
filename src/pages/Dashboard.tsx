
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useMetrics } from "@/context/MetricsContext";
import MetricCard from "@/components/dashboard/MetricCard";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import PieChart from "@/components/charts/PieChart";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react";

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

  const chartColors = {
    quality: ['#10b981', '#3b82f6', '#f97316'],
    nps: ['#22c55e', '#8b5cf6', '#ef4444'],
    calls: ['#3b82f6', '#8b5cf6', '#ef4444', '#f97316', '#10b981', '#06b6d4']
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 text-transparent bg-clip-text dark:from-white dark:to-white/60">لوحة المؤشرات</h1>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={currentPeriod === "weekly" ? "default" : "outline"}
              onClick={() => setCurrentPeriod("weekly")}
              className="transition-all shadow-sm hover:shadow rounded-full"
            >
              أسبوعي
            </Button>
            <Button
              variant={currentPeriod === "yearly" ? "default" : "outline"}
              onClick={() => setCurrentPeriod("yearly")}
              className="transition-all shadow-sm hover:shadow rounded-full"
            >
              سنوي
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} className="border-none shadow-md bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-md transition-all hover:scale-[1.02] hover:-translate-y-1" />
          ))}
        </div>

        <Tabs defaultValue="quality" className="space-y-6">
          <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full bg-gray-800/60 backdrop-blur-md p-1 rounded-xl border border-gray-700/30">
            <TabsTrigger value="quality" className="text-sm md:text-base flex items-center gap-2 rounded-lg">
              <LineChartIcon size={16} />
              جودة الخدمات
            </TabsTrigger>
            <TabsTrigger value="nps" className="text-sm md:text-base flex items-center gap-2 rounded-lg">
              <BarChart2 size={16} />
              مؤشرات الترشيح
            </TabsTrigger>
            <TabsTrigger value="calls" className="text-sm md:text-base flex items-center gap-2 rounded-lg">
              <PieChartIcon size={16} />
              توزيع المكالمات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quality" className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/30 shadow-lg overflow-hidden">
            <Card className="border-none bg-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-white">مؤشرات الجودة {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
                <CardDescription className="text-gray-300">جودة إدارة المرافق، الصيانة والتسليم</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <LineChart 
                    title="مؤشرات الجودة"
                    data={qualityChartData}
                    dataKey="name"
                    categories={['جودة المرافق', 'جودة الصيانة', 'جودة التسليم']}
                    colors={chartColors.quality}
                    className="text-gray-300"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nps" className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/30 shadow-lg overflow-hidden">
            <Card className="border-none bg-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-white">مؤشرات الترشيح {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
                <CardDescription className="text-gray-300">نسبة الترشيح للعملاء الجدد، بعد السنة الأولى، والعملاء القدامى</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <BarChart 
                    title="مؤشرات الترشيح"
                    data={npsChartData}
                    dataKey="name"
                    categories={['العملاء الجدد', 'بعد السنة الأولى', 'العملاء القدامى']}
                    colors={chartColors.nps}
                    className="text-sm text-gray-300"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls" className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-700/30 shadow-lg overflow-hidden">
            <Card className="border-none bg-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-white">توزيع المكالمات {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
                <CardDescription className="text-gray-300">توزيع المكالمات حسب النوع</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-80 w-full max-w-md">
                  <PieChart 
                    title="توزيع المكالمات"
                    data={callsChartData}
                    colors={chartColors.calls}
                    showLegend={true}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-gray-800/40 backdrop-blur-md border border-gray-700/30 shadow-lg overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white">آخر الشكاوى المسجلة</CardTitle>
            <CardDescription className="text-gray-300">أحدث 5 شكاوى تم تسجيلها في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-4 text-gray-400">جاري تحميل البيانات...</p>
            ) : recentComplaints.length > 0 ? (
              <div className="overflow-x-auto rounded-md">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-700/30">
                    <tr className="text-right text-sm font-medium text-gray-300">
                      <th className="p-3">رقم التذكرة</th>
                      <th className="p-3">اسم العميل</th>
                      <th className="p-3">المشروع</th>
                      <th className="p-3">الشكوى</th>
                      <th className="p-3">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/20">
                    {recentComplaints.map((complaint: any) => (
                      <tr key={complaint.id} className="hover:bg-gray-700/10 transition-colors">
                        <td className="p-3 text-sm text-gray-300">{complaint.ticket_number || '-'}</td>
                        <td className="p-3 text-sm text-gray-300">{complaint.client_name || '-'}</td>
                        <td className="p-3 text-sm text-gray-300">{complaint.project || '-'}</td>
                        <td className="p-3 text-sm text-gray-300 line-clamp-1">{complaint.complaint || '-'}</td>
                        <td className="p-3 text-sm">
                          <Badge className={`px-2 py-1 rounded-full text-xs ${
                            complaint.status === 'مغلقة' ? 'bg-green-900/20 text-green-400 border-green-500/20' :
                            complaint.status === 'قيد المعالجة' ? 'bg-amber-900/20 text-amber-400 border-amber-500/20' : 
                            'bg-red-900/20 text-red-400 border-red-500/20'
                          }`}>
                            {complaint.status || 'جديدة'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-400">لا توجد شكاوى مسجلة</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
