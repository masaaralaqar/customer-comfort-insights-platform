import React from 'react';
import Layout from '@/components/layout/Layout';
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  LineChart, 
  Activity, 
  Users, 
  Timer, 
  Phone, 
  Percent, 
  FileText, 
  Wrench, 
  Clock, 
  UserCheck, 
  Briefcase 
} from "lucide-react";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar
} from "recharts";
import { useMetrics } from "@/context/MetricsContext";

export default function Dashboard() {
  const {
    metrics,
    qualityData,
    npsData,
    callsData,
    currentPeriod,
    setCurrentPeriod
  } = useMetrics();

  const customerServiceData = {
    calls: {
      customersInterested: 120,
      projectsInterested: 45,
      officeInterested: 30,
      inquiries: 200,
      maintenanceRequests: 85,
      contactRequests: 150,
      complaints: 25,
      total: 655
    },
    inquiries: {
      soldProjects: 35,
      apartmentRentals: 42,
      deedInquiries: 28,
      documentRequests: 65,
      general: 95
    },
    maintenance: {
      cancelled: 12,
      resolved: 65,
      inProgress: 18
    }
  };

  const maintenanceSatisfaction = {
    serviceQuality: 92,
    closureTime: 88,
    firstTimeResolution: 85,
    comments: "تحسن ملحوظ في سرعة الاستجابة وجودة الخدمة"
  };

  const getIconForMetric = (index: number) => {
    const icons = [
      <Users key="users1" />,
      <Users key="users2" />,
      <Users key="users3" />,
      <Activity key="activity" />,
      <Wrench key="wrench" />,
      <Timer key="timer" />,
      <Phone key="phone" />,
      <UserCheck key="usercheck1" />,
      <Clock key="clock" />,
      <FileText key="filetext" />,
      <Briefcase key="briefcase" />,
      <Percent key="percent1" />,
      <UserCheck key="usercheck2" />,
      <Users key="users4" />,
      <Percent key="percent2" />
    ];
    return icons[index] || <Activity />;
  };

  const metricsWithIcons = metrics.map((metric, index) => ({
    ...metric,
    icon: getIconForMetric(index)
  }));

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">لوحة التحكم الرئيسية</h1>
          <div className="flex gap-2">
            <Button
              variant={currentPeriod === "weekly" ? "default" : "outline"}
              onClick={() => setCurrentPeriod("weekly")}
            >
              أسبوعي
            </Button>
            <Button
              variant={currentPeriod === "yearly" ? "default" : "outline"}
              onClick={() => setCurrentPeriod("yearly")}
            >
              سنوي
            </Button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">مؤشرات الأداء الرئيسية {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</h2>

        <div className="dashboard-grid">
          {metricsWithIcons.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              target={metric.target}
              icon={metric.icon}
              change={metric.change}
              isPositive={metric.isPositive}
              reachedTarget={metric.reachedTarget}
              isLowerBetter={metric.isLowerBetter}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="chart-container">
            <h3 className="text-lg font-semibold mb-4">مؤشرات الجودة {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart
                data={qualityData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[85, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="delivery"
                  name="جودة التسليم"
                  stroke="#10b981"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="maintenance"
                  name="جودة الصيانة"
                  stroke="#f97316"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="facilityManagement"
                  name="جودة إدارة المرافق"
                  stroke="#10b981"
                  activeDot={{ r: 8 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3 className="text-lg font-semibold mb-4">مؤشرات الترشيح {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart
                data={npsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[25, 75]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="newCustomers"
                  name="نسبة الترشيح للعملاء الجدد"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="afterFirstYear"
                  name="نسبة الترشيح بعد السنة"
                  stroke="#2563eb"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="longTerm"
                  name="نسبة الترشيح للعملاء القدامى"
                  stroke="#ef4444"
                  activeDot={{ r: 8 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">خدمة العملاء {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</h2>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نوع المكالمة</TableHead>
                  <TableHead className="text-center">العدد</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-right">عملاء مهتمين</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.calls.customersInterested}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-right">مهتمين مشاريع</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.calls.projectsInterested}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-right">مهتمين مكاتب</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.calls.officeInterested}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-right">استفسارات</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.calls.inquiries}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-right">طلبات صيانة</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.calls.maintenanceRequests}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-right">طلبات تواصل</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.calls.contactRequests}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-right">شكاوى</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.calls.complaints}</TableCell>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell className="text-right font-bold">إجمالي المكالمات</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.calls.total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نوع الاستفسار</TableHead>
                  <TableHead className="text-center">العدد</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-right">مشاريع مباعة</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.inquiries.soldProjects}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-right">إيجارات شقق</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.inquiries.apartmentRentals}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-right">استفسارات الصكوك</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.inquiries.deedInquiries}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-right">طلب أوراق</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.inquiries.documentRequests}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-right">استفسارات عامة</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.inquiries.general}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">حالة الطلب</TableHead>
                  <TableHead className="text-center">العدد</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-right">تم الإلغاء</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.maintenance.cancelled}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-right">تم الحل</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.maintenance.resolved}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-right">قيد المعالجة</TableCell>
                  <TableCell className="text-center font-bold">{customerServiceData.maintenance.inProgress}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">رضا العملاء عن الخدمات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maintenanceSatisfaction.serviceQuality}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">رضا العملاء عن مدة الإغلاق</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maintenanceSatisfaction.closureTime}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">نسبة الحل من أول مرة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maintenanceSatisfaction.firstTimeResolution}%</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ملاحظات العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{maintenanceSatisfaction.comments}</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}