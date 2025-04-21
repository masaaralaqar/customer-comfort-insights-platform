
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import StatsCard from '@/components/cards/StatsCard';
import PieChart from '@/components/charts/PieChart';
import LineChart from '@/components/charts/LineChart';
import CommentCard, { CommentData } from '@/components/feedback/CommentCard';
import TimeRangeFilter from '@/components/filters/TimeRangeFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// تعريف واجهات البيانات
interface SatisfactionData {
  maintenanceService: {
    veryHappy: number;
    happy: number;
    neutral: number;
    unhappy: number;
    veryUnhappy: number;
    totalResponses: number;
    satisfactionRate: number;
  };
  closingTime: {
    veryHappy: number;
    happy: number;
    neutral: number;
    unhappy: number;
    veryUnhappy: number;
    totalResponses: number;
    satisfactionRate: number;
  };
  firstTimeResolution: {
    yes: number;
    no: number;
    totalResponses: number;
    resolutionRate: number;
  };
  comments: CommentData[];
}

// بيانات مؤقتة للعرض
const WEEKLY_DATA: SatisfactionData = {
  maintenanceService: {
    veryHappy: 35,
    happy: 25,
    neutral: 10,
    unhappy: 5,
    veryUnhappy: 2,
    totalResponses: 77,
    satisfactionRate: 78
  },
  closingTime: {
    veryHappy: 30,
    happy: 20,
    neutral: 12,
    unhappy: 8,
    veryUnhappy: 5,
    totalResponses: 75,
    satisfactionRate: 67
  },
  firstTimeResolution: {
    yes: 62,
    no: 15,
    totalResponses: 77,
    resolutionRate: 81
  },
  comments: [
    {
      id: '1',
      text: 'كانت خدمة الصيانة ممتازة وسريعة. شكراً للموظف أحمد على التعامل الاحترافي.',
      date: '2025-04-15',
      employeeName: 'خالد محمد',
      rating: 'راضي جدًا',
      serviceType: 'صيانة تكييف'
    },
    {
      id: '2',
      text: 'استغرق إصلاح المشكلة وقتاً أطول من المتوقع، لكن النتيجة كانت جيدة.',
      date: '2025-04-14',
      employeeName: 'سارة أحمد',
      rating: 'راضي',
      serviceType: 'إصلاح تسرب مياه'
    },
    {
      id: '3',
      text: 'الفني لم يكن متعاوناً ولم يشرح المشكلة بشكل واضح.',
      date: '2025-04-13',
      employeeName: 'عمر خالد',
      rating: 'غير راضي',
      serviceType: 'صيانة كهرباء'
    },
    {
      id: '4',
      text: 'لم يتم حل المشكلة من المرة الأولى واضطررت للاتصال مرة أخرى.',
      date: '2025-04-12',
      employeeName: 'فاطمة علي',
      rating: 'محايد',
      serviceType: 'صيانة باب'
    },
    {
      id: '5',
      text: 'خدمة سريعة وممتازة، شكراً لفريق الصيانة!',
      date: '2025-04-11',
      employeeName: 'محمد عبدالله',
      rating: 'راضي جدًا',
      serviceType: 'إصلاح نافذة'
    }
  ]
};

const YEARLY_DATA: SatisfactionData = {
  maintenanceService: {
    veryHappy: 450,
    happy: 320,
    neutral: 150,
    unhappy: 80,
    veryUnhappy: 50,
    totalResponses: 1050,
    satisfactionRate: 73
  },
  closingTime: {
    veryHappy: 380,
    happy: 290,
    neutral: 180,
    unhappy: 120,
    veryUnhappy: 80,
    totalResponses: 1050,
    satisfactionRate: 64
  },
  firstTimeResolution: {
    yes: 820,
    no: 230,
    totalResponses: 1050,
    resolutionRate: 78
  },
  comments: [
    {
      id: '1',
      text: 'كانت خدمة الصيانة ممتازة وسريعة. شكراً للموظف أحمد على التعامل الاحترافي.',
      date: '2025-04-15',
      employeeName: 'خالد محمد',
      rating: 'راضي جدًا',
      serviceType: 'صيانة تكييف'
    },
    {
      id: '2',
      text: 'استغرق إصلاح المشكلة وقتاً أطول من المتوقع، لكن النتيجة كانت جيدة.',
      date: '2025-04-14',
      employeeName: 'سارة أحمد',
      rating: 'راضي',
      serviceType: 'إصلاح تسرب مياه'
    },
    {
      id: '3',
      text: 'الفني لم يكن متعاوناً ولم يشرح المشكلة بشكل واضح.',
      date: '2025-04-13',
      employeeName: 'عمر خالد',
      rating: 'غير راضي',
      serviceType: 'صيانة كهرباء'
    },
    {
      id: '4',
      text: 'لم يتم حل المشكلة من المرة الأولى واضطررت للاتصال مرة أخرى.',
      date: '2025-04-12',
      employeeName: 'فاطمة علي',
      rating: 'محايد',
      serviceType: 'صيانة باب'
    },
    {
      id: '5',
      text: 'خدمة سريعة وممتازة، شكراً لفريق الصيانة!',
      date: '2025-04-11',
      employeeName: 'محمد عبدالله',
      rating: 'راضي جدًا',
      serviceType: 'إصلاح نافذة'
    },
    {
      id: '6',
      text: 'تجربة ممتازة مع فريق الصيانة، وصلوا في الموعد المحدد وأنجزوا العمل بكفاءة.',
      date: '2025-03-18',
      employeeName: 'عبدالرحمن ياسر',
      rating: 'راضي جدًا',
      serviceType: 'صيانة شاملة'
    },
    {
      id: '7',
      text: 'المشكلة تكررت بعد أسبوع من الإصلاح. أتمنى أن يتم حلها بشكل دائم.',
      date: '2025-03-05',
      employeeName: 'نورة سالم',
      rating: 'غير راضي',
      serviceType: 'تسرب مياه'
    },
    {
      id: '8',
      text: 'فريق الصيانة محترف جداً. شكراً على الخدمة السريعة.',
      date: '2025-02-22',
      employeeName: 'سعد العامري',
      rating: 'راضي جدًا',
      serviceType: 'صيانة مكيف'
    }
  ]
};

// بيانات الرسوم البيانية
const generateTrendData = (view: 'weekly' | 'yearly') => {
  if (view === 'weekly') {
    return [
      { day: "السبت", "الرضا عن الخدمة": 72, "الرضا عن المدة": 65, "الحل من أول مرة": 80 },
      { day: "الأحد", "الرضا عن الخدمة": 75, "الرضا عن المدة": 68, "الحل من أول مرة": 82 },
      { day: "الاثنين", "الرضا عن الخدمة": 78, "الرضا عن المدة": 70, "الحل من أول مرة": 85 },
      { day: "الثلاثاء", "الرضا عن الخدمة": 80, "الرضا عن المدة": 72, "الحل من أول مرة": 84 },
      { day: "الأربعاء", "الرضا عن الخدمة": 82, "الرضا عن المدة": 74, "الحل من أول مرة": 86 },
      { day: "الخميس", "الرضا عن الخدمة": 81, "الرضا عن المدة": 73, "الحل من أول مرة": 85 },
      { day: "الجمعة", "الرضا عن الخدمة": 0, "الرضا عن المدة": 0, "الحل من أول مرة": 0 },
    ];
  } else {
    return [
      { month: "يناير", "الرضا عن الخدمة": 70, "الرضا عن المدة": 62, "الحل من أول مرة": 75 },
      { month: "فبراير", "الرضا عن الخدمة": 72, "الرضا عن المدة": 65, "الحل من أول مرة": 76 },
      { month: "مارس", "الرضا عن الخدمة": 73, "الرضا عن المدة": 64, "الحل من أول مرة": 77 },
      { month: "أبريل", "الرضا عن الخدمة": 75, "الرضا عن المدة": 66, "الحل من أول مرة": 78 },
      { month: "مايو", "الرضا عن الخدمة": 74, "الرضا عن المدة": 65, "الحل من أول مرة": 80 },
      { month: "يونيو", "الرضا عن الخدمة": 76, "الرضا عن المدة": 67, "الحل من أول مرة": 81 },
      { month: "يوليو", "الرضا عن الخدمة": 78, "الرضا عن المدة": 68, "الحل من أول مرة": 82 },
      { month: "أغسطس", "الرضا عن الخدمة": 79, "الرضا عن المدة": 70, "الحل من أول مرة": 83 },
      { month: "سبتمبر", "الرضا عن الخدمة": 80, "الرضا عن المدة": 71, "الحل من أول مرة": 84 },
      { month: "أكتوبر", "الرضا عن الخدمة": 79, "الرضا عن المدة": 70, "الحل من أول مرة": 83 },
      { month: "نوفمبر", "الرضا عن الخدمة": 77, "الرضا عن المدة": 69, "الحل من أول مرة": 82 },
      { month: "ديسمبر", "الرضا عن الخدمة": 75, "الرضا عن المدة": 68, "الحل من أول مرة": 80 },
    ];
  }
};

const MaintenanceSatisfaction = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<string>('this-week');
  const [view, setView] = useState<'weekly' | 'yearly'>('weekly');
  const [activeTab, setActiveTab] = useState<string>('service');
  const [data, setData] = useState<SatisfactionData>(WEEKLY_DATA);
  const [trendData, setTrendData] = useState(generateTrendData('weekly'));

  // تحديث البيانات عند تغيير العرض
  useEffect(() => {
    setData(view === 'weekly' ? WEEKLY_DATA : YEARLY_DATA);
    setTrendData(generateTrendData(view));
  }, [view, timeRange]);

  // تحويل البيانات إلى تنسيق مناسب للرسوم البيانية الدائرية
  const getMaintenanceServicePieData = () => [
    { name: 'راضي جدًا', value: data.maintenanceService.veryHappy, color: '#4ade80' },
    { name: 'راضي', value: data.maintenanceService.happy, color: '#a3e635' },
    { name: 'محايد', value: data.maintenanceService.neutral, color: '#facc15' },
    { name: 'غير راضي', value: data.maintenanceService.unhappy, color: '#fb923c' },
    { name: 'غير راضي جدًا', value: data.maintenanceService.veryUnhappy, color: '#f87171' },
  ];

  const getClosingTimePieData = () => [
    { name: 'راضي جدًا', value: data.closingTime.veryHappy, color: '#4ade80' },
    { name: 'راضي', value: data.closingTime.happy, color: '#a3e635' },
    { name: 'محايد', value: data.closingTime.neutral, color: '#facc15' },
    { name: 'غير راضي', value: data.closingTime.unhappy, color: '#fb923c' },
    { name: 'غير راضي جدًا', value: data.closingTime.veryUnhappy, color: '#f87171' },
  ];

  const getFirstTimeResolutionPieData = () => [
    { name: 'نعم', value: data.firstTimeResolution.yes, color: '#4ade80' },
    { name: 'لا', value: data.firstTimeResolution.no, color: '#f87171' },
  ];

  return (
    <Layout>
      <div className="container mx-auto p-4 py-8 space-y-8 dir-rtl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/customer-service-dashboard')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">رضا العملاء عن الصيانة</h1>
          </div>
          <TimeRangeFilter 
            selectedTimeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            selectedView={view}
            onViewChange={setView}
            className="mb-4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard 
            title="معدل الرضا عن خدمات الصيانة"
            value={`${data.maintenanceService.satisfactionRate}%`}
            trend={2}
            className="bg-green-50"
          />
          <StatsCard 
            title="معدل الرضا عن مدة إغلاق الطلبات"
            value={`${data.closingTime.satisfactionRate}%`}
            trend={-1}
            className="bg-yellow-50"
          />
          <StatsCard 
            title="معدل حل المشكلة من أول مرة"
            value={`${data.firstTimeResolution.resolutionRate}%`}
            trend={3}
            className="bg-blue-50"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="service">الرضا عن خدمات الصيانة</TabsTrigger>
            <TabsTrigger value="closing-time">الرضا عن مدة إغلاق الطلبات</TabsTrigger>
            <TabsTrigger value="first-time">الحل من أول مرة</TabsTrigger>
            <TabsTrigger value="trends">اتجاهات الرضا</TabsTrigger>
          </TabsList>

          {/* قسم الرضا عن خدمات الصيانة */}
          <TabsContent value="service" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="col-span-1 md:col-span-3">
                <PieChart
                  title="توزيع مستويات الرضا عن خدمات الصيانة"
                  data={getMaintenanceServicePieData()}
                />
              </div>
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatsCard 
                  title="راضي جدًا"
                  value={data.maintenanceService.veryHappy}
                  className="bg-green-100"
                />
                <StatsCard 
                  title="راضي"
                  value={data.maintenanceService.happy}
                  className="bg-green-50"
                />
                <StatsCard 
                  title="محايد"
                  value={data.maintenanceService.neutral}
                  className="bg-yellow-50"
                />
                <StatsCard 
                  title="غير راضي"
                  value={data.maintenanceService.unhappy}
                  className="bg-red-50"
                />
                <StatsCard 
                  title="غير راضي جدًا"
                  value={data.maintenanceService.veryUnhappy}
                  className="bg-red-100"
                />
                <StatsCard 
                  title="إجمالي الردود"
                  value={data.maintenanceService.totalResponses}
                />
              </div>
            </div>
          </TabsContent>

          {/* قسم الرضا عن مدة إغلاق الطلبات */}
          <TabsContent value="closing-time" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="col-span-1 md:col-span-3">
                <PieChart
                  title="توزيع مستويات الرضا عن مدة إغلاق الطلبات"
                  data={getClosingTimePieData()}
                />
              </div>
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatsCard 
                  title="راضي جدًا"
                  value={data.closingTime.veryHappy}
                  className="bg-green-100"
                />
                <StatsCard 
                  title="راضي"
                  value={data.closingTime.happy}
                  className="bg-green-50"
                />
                <StatsCard 
                  title="محايد"
                  value={data.closingTime.neutral}
                  className="bg-yellow-50"
                />
                <StatsCard 
                  title="غير راضي"
                  value={data.closingTime.unhappy}
                  className="bg-red-50"
                />
                <StatsCard 
                  title="غير راضي جدًا"
                  value={data.closingTime.veryUnhappy}
                  className="bg-red-100"
                />
                <StatsCard 
                  title="إجمالي الردود"
                  value={data.closingTime.totalResponses}
                />
              </div>
            </div>
          </TabsContent>

          {/* قسم الحل من أول مرة */}
          <TabsContent value="first-time" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <PieChart
                  title="هل تم إغلاق الطلب من أول مرة؟"
                  data={getFirstTimeResolutionPieData()}
                />
              </div>
              <div className="col-span-1 grid grid-cols-1 md:grid-cols-2 gap-4 self-center">
                <StatsCard 
                  title="نعم"
                  value={data.firstTimeResolution.yes}
                  className="bg-green-50"
                />
                <StatsCard 
                  title="لا"
                  value={data.firstTimeResolution.no}
                  className="bg-red-50"
                />
                <StatsCard 
                  title="إجمالي الردود"
                  value={data.firstTimeResolution.totalResponses}
                  className="md:col-span-2"
                />
              </div>
            </div>
          </TabsContent>

          {/* قسم اتجاهات الرضا */}
          <TabsContent value="trends" className="space-y-6">
            <LineChart
              title="اتجاهات مؤشرات الرضا عن خدمات الصيانة"
              data={trendData}
              dataKey={view === 'weekly' ? 'day' : 'month'}
              categories={['الرضا عن الخدمة', 'الرضا عن المدة', 'الحل من أول مرة']}
              colors={['#4ade80', '#facc15', '#3b82f6']}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">ملاحظات العملاء</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MaintenanceSatisfaction;
