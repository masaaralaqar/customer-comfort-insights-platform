
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMetrics } from "@/context/MetricsContext";
import { 
  Wrench, 
  Clock, 
  ThumbsUp, 
  FileText,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { Button } from "@/components/ui/button";

export default function Maintenance() {
  const { currentPeriod, setCurrentPeriod } = useMetrics();

  // بيانات الصيانة
  const maintenanceMetrics = [
    {
      title: "متوسط رضا العملاء عن الصيانة",
      value: currentPeriod === "weekly" ? "88%" : "92%",
      change: currentPeriod === "weekly" ? "+3.5%" : "+5.7%",
      isPositive: true,
      icon: <ThumbsUp className="h-5 w-5" />,
      color: "bg-green-100 text-green-800"
    },
    {
      title: "متوسط وقت الاستجابة",
      value: currentPeriod === "weekly" ? "4.2 ساعة" : "3.8 ساعة",
      change: currentPeriod === "weekly" ? "-8%" : "-12%",
      isPositive: true,
      icon: <Clock className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800"
    },
    {
      title: "سرعة إغلاق طلبات الصيانة",
      value: currentPeriod === "weekly" ? "2.5 يوم" : "2.2 يوم",
      change: currentPeriod === "weekly" ? "-5%" : "-8%",
      isPositive: true,
      icon: <Wrench className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-800"
    },
    {
      title: "عدد طلبات الصيانة",
      value: currentPeriod === "weekly" ? "65" : "790",
      change: currentPeriod === "weekly" ? "+8%" : "+5%",
      isPositive: false,
      icon: <FileText className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-800"
    }
  ];

  // بيانات جودة الصيانة حسب النوع
  const maintenanceTypes = [
    { type: "كهرباء", satisfaction: 92, rating: 4.6 },
    { type: "سباكة", satisfaction: 88, rating: 4.4 },
    { type: "تكييف", satisfaction: 91, rating: 4.5 },
    { type: "نجارة", satisfaction: 86, rating: 4.3 },
    { type: "أجهزة منزلية", satisfaction: 85, rating: 4.2 },
    { type: "أجهزة إلكترونية", satisfaction: 89, rating: 4.4 },
  ];

  // تقييمات جوانب الصيانة
  const maintenanceAspects = [
    { aspect: "سرعة الاستجابة", value: 85 },
    { aspect: "جودة الإصلاح", value: 92 },
    { aspect: "سلوك الفني", value: 95 },
    { aspect: "النظافة بعد الصيانة", value: 80 },
    { aspect: "الالتزام بالموعد", value: 82 },
    { aspect: "أسعار قطع الغيار", value: 75 },
  ];

  // عدد طلبات الصيانة حسب الشهر
  const maintenanceByPeriod = currentPeriod === "weekly" ? [
    { name: "الأسبوع 1", count: 58 },
    { name: "الأسبوع 2", count: 65 },
    { name: "الأسبوع 3", count: 62 },
    { name: "الأسبوع 4", count: 70 },
  ] : [
    { name: "يناير", count: 62 },
    { name: "فبراير", count: 58 },
    { name: "مارس", count: 65 },
    { name: "أبريل", count: 70 },
    { name: "مايو", count: 68 },
    { name: "يونيو", count: 72 },
    { name: "يوليو", count: 76 },
    { name: "أغسطس", count: 80 },
    { name: "سبتمبر", count: 74 },
    { name: "أكتوبر", count: 68 },
    { name: "نوفمبر", count: 65 },
    { name: "ديسمبر", count: 70 },
  ];

  // تقسيم أنواع طلبات الصيانة
  const maintenanceTypesPie = [
    { name: "كهرباء", value: 30 },
    { name: "سباكة", value: 25 },
    { name: "تكييف", value: 20 },
    { name: "نجارة", value: 15 },
    { name: "أجهزة منزلية", value: 7 },
    { name: "أجهزة إلكترونية", value: 3 },
  ];

  // ألوان مخصصة للرسم البياني الدائري
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">رضا العملاء عن الصيانة</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {maintenanceMetrics.map((metric, index) => (
            <Card key={index} className={metric.color}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className="text-muted-foreground">{metric.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs mt-1">
                  {metric.isPositive ? 
                    <TrendingUp className="inline h-3 w-3 mr-1" /> : 
                    <TrendingDown className="inline h-3 w-3 mr-1" />
                  }
                  <span className={metric.isPositive ? "text-green-700" : "text-red-700"}>
                    {metric.change}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>رضا العملاء حسب نوع الصيانة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={maintenanceTypes}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis domain={[75, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="satisfaction" name="نسبة الرضا %" fill="#8884d8" />
                    <Bar dataKey="rating" name="التقييم (من 5)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>أنواع طلبات الصيانة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={maintenanceTypesPie}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {maintenanceTypesPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>تقييم جوانب الصيانة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={maintenanceAspects}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="aspect" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                      name="التقييم"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>عدد طلبات الصيانة {currentPeriod === "weekly" ? "الأسبوعية" : "الشهرية"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={maintenanceByPeriod}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="عدد الطلبات" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
