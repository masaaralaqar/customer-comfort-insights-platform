
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMetrics } from "@/context/MetricsContext";
import { Phone, Clock, MessageSquare, UserCheck } from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";

export default function CustomerService() {
  const { currentPeriod, setCurrentPeriod, callsData } = useMetrics();

  // بيانات للرسوم البيانية
  const satisfactionData = [
    { name: "راضون جداً", value: 42 },
    { name: "راضون", value: 28 },
    { name: "محايدون", value: 15 },
    { name: "غير راضين", value: 10 },
    { name: "غير راضين بشدة", value: 5 },
  ];

  // بيانات لرسم الخط - وقت الانتظار
  const waitTimeData = currentPeriod === "weekly" ? [
    { day: "السبت", time: 3.2 },
    { day: "الأحد", time: 2.8 },
    { day: "الاثنين", time: 3.5 },
    { day: "الثلاثاء", time: 2.9 },
    { day: "الأربعاء", time: 2.6 },
    { day: "الخميس", time: 2.5 },
    { day: "الجمعة", time: 2.4 },
  ] : [
    { day: "يناير", time: 3.1 },
    { day: "فبراير", time: 3.0 },
    { day: "مارس", time: 2.9 },
    { day: "أبريل", time: 2.8 },
    { day: "مايو", time: 2.7 },
    { day: "يونيو", time: 2.6 },
    { day: "يوليو", time: 2.5 },
    { day: "أغسطس", time: 2.4 },
    { day: "سبتمبر", time: 2.3 },
    { day: "أكتوبر", time: 2.2 },
    { day: "نوفمبر", time: 2.1 },
    { day: "ديسمبر", time: 2.0 },
  ];

  // ألوان للرسم البياني الدائري
  const COLORS = ["#10b981", "#34d399", "#6ee7b7", "#f97316", "#ef4444"];

  // بطاقات البيانات
  const metricsCards = [
    {
      title: "متوسط وقت الرد",
      value: currentPeriod === "weekly" ? "2.8 ثانية" : "2.5 ثانية",
      icon: <Clock className="h-5 w-5" />,
      color: "bg-green-100 text-green-800"
    },
    {
      title: "معدل الرد على المكالمات",
      value: currentPeriod === "weekly" ? "98%" : "99%",
      icon: <Phone className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800"
    },
    {
      title: "إجمالي المكالمات",
      value: currentPeriod === "weekly" ? "265" : "3,220",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-800"
    },
    {
      title: "مؤشر رضا العملاء",
      value: currentPeriod === "weekly" ? "74%" : "78%",
      icon: <UserCheck className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-800"
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">خدمة العملاء</h1>
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
          {metricsCards.map((card, index) => (
            <Card key={index} className={card.color}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className="text-muted-foreground">{card.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>أنواع المكالمات {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={callsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="عدد المكالمات" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>مستوى رضا العملاء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={satisfactionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {satisfactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>متوسط وقت الانتظار ({currentPeriod === "weekly" ? "أيام الأسبوع" : "أشهر السنة"})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waitTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[2, 4]} />
                  <Tooltip formatter={(value) => [`${value} ثانية`, "وقت الانتظار"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="time"
                    name="وقت الانتظار (ثانية)"
                    stroke="#10b981"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
