
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { MetricCard } from "@/components/dashboard/MetricCard";
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

// بيانات تجريبية للرسوم البيانية
const qualityData = [
  { week: "الأسبوع 1", facilityManagement: 89, maintenance: 90, delivery: 95 },
  { week: "الأسبوع 2", facilityManagement: 92, maintenance: 95, delivery: 97 },
  { week: "الأسبوع 3", facilityManagement: 93, maintenance: 94, delivery: 96 },
  { week: "الأسبوع 4", facilityManagement: 96, maintenance: 97, delivery: 98 },
];

const npsData = [
  { week: "الأسبوع 1", newCustomers: 60, afterFirstYear: 61, longTerm: 30 },
  { week: "الأسبوع 2", newCustomers: 63, afterFirstYear: 64, longTerm: 32 },
  { week: "الأسبوع 3", newCustomers: 65, afterFirstYear: 66, longTerm: 36 },
  { week: "الأسبوع 4", newCustomers: 67, afterFirstYear: 68, longTerm: 37 },
];

const callsData = [
  { category: "مهتمين", count: 42 },
  { category: "مهتمين مشاريع", count: 38 },
  { category: "طلبات صيانة", count: 65 },
  { category: "استفسارات", count: 58 },
  { category: "مهتمين مكاتب", count: 34 },
  { category: "شكاوى", count: 28 },
];

// بيانات المؤشرات
const metrics = [
  {
    title: "نسبة الترشيح للعملاء الجدد",
    value: "65%",
    target: "65%",
    icon: <Users />,
    change: 2.4,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "نسبة الترشيح بعد السنة",
    value: "67%",
    target: "65%",
    icon: <Users />,
    change: 3.1,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "نسبة الترشيح للعملاء القدامى",
    value: "30%",
    target: "30%",
    icon: <Users />,
    change: 1.8,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "جودة التسليم",
    value: "98%",
    target: "100%",
    icon: <Activity />,
    change: 1.5,
    isPositive: true,
    reachedTarget: false,
    isLowerBetter: false,
  },
  {
    title: "جودة الصيانة",
    value: "96%",
    target: "100%",
    icon: <Wrench />,
    change: 2.8,
    isPositive: true,
    reachedTarget: false,
    isLowerBetter: false,
  },
  {
    title: "عدد الثواني للرد",
    value: "2.8 ثانية",
    target: "3 ثواني",
    icon: <Timer />,
    change: 5.7,
    isPositive: false,
    reachedTarget: true,
    isLowerBetter: true,
  },
  {
    title: "معدل الرد على المكالمات",
    value: "18%",
    target: "20%",
    icon: <Phone />,
    change: 4.3,
    isPositive: false,
    reachedTarget: false,
    isLowerBetter: true,
  },
  {
    title: "راحة العميل (CSAT)",
    value: "74%",
    target: "70%",
    icon: <UserCheck />,
    change: 5.7,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "سرعة إغلاق طلبات الصيانة",
    value: "2.5 يوم",
    target: "3 أيام",
    icon: <Clock />,
    change: 8.2,
    isPositive: false,
    reachedTarget: true,
    isLowerBetter: true,
  },
  {
    title: "عدد إعادة فتح طلب",
    value: "0",
    target: "0",
    icon: <FileText />,
    change: 0,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: true,
  },
  {
    title: "جودة إدارة المرافق",
    value: "80%",
    target: "80%",
    icon: <Briefcase />,
    change: 1.8,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "معدل التحول",
    value: "2%",
    target: "2%",
    icon: <Percent />,
    change: 1.5,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "نسبة الرضا عن التسليم",
    value: "80%",
    target: "80%",
    icon: <UserCheck />,
    change: 2.3,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "عدد العملاء المرشحين",
    value: "584",
    target: "584",
    icon: <Users />,
    change: 3.5,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "المساهمة في المبيعات",
    value: "5%",
    target: "5%",
    icon: <Percent />,
    change: 2.1,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
];

export default function Dashboard() {
  const [period, setPeriod] = useState<"weekly" | "yearly">("weekly");

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">لوحة التحكم الرئيسية</h1>
          <div className="flex gap-2">
            <Button
              variant={period === "weekly" ? "default" : "outline"}
              onClick={() => setPeriod("weekly")}
            >
              أسبوعي
            </Button>
            <Button
              variant={period === "yearly" ? "default" : "outline"}
              onClick={() => setPeriod("yearly")}
            >
              سنوي
            </Button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">مؤشرات الأداء الرئيسية {period === "weekly" ? "الأسبوعية" : "السنوية"}</h2>
        
        <div className="dashboard-grid">
          {metrics.map((metric, index) => (
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
            <h3 className="text-lg font-semibold mb-4">مؤشرات الجودة</h3>
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
            <h3 className="text-lg font-semibold mb-4">مؤشرات الترشيح</h3>
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

        <div className="chart-container mt-6">
          <h3 className="text-lg font-semibold mb-4">خدمة العملاء - أنواع المكالمات</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart
              data={callsData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="عدد المكالمات" fill="#3b82f6" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
