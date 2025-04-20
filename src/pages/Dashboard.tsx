import { useEffect } from "react";
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
import { useMetrics, MetricData } from "@/context/MetricsContext";

export default function Dashboard() {
  const { metrics, qualityData, npsData, callsData, currentPeriod, setCurrentPeriod } = useMetrics();

  // إضافة أيقونات للمؤشرات
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

  // مؤشرات مع أيقونات
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

        <div className="chart-container mt-6">
          <h3 className="text-lg font-semibold mb-4">خدمة العملاء - أنواع المكالمات {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</h3>
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
