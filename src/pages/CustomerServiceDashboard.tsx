
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import StatsCard from '@/components/cards/StatsCard';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import TimeRangeFilter from '@/components/filters/TimeRangeFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText, ClipboardList } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// تعريف واجهات البيانات
interface CustomerServiceData {
  calls: {
    complaints: number;
    contactRequests: number;
    maintenanceRequests: number;
    inquiries: number;
    officeInterests: number;
    futureProjectInterests: number;
    interestedCustomers: number;
    totalCalls: number;
  };
  inquiries: {
    generalInquiries: number;
    documentRequests: number;
    deedInquiries: number;
    apartmentRentals: number;
    soldProjects: number;
  };
  maintenance: {
    cancelled: number;
    resolved: number;
    inProgress: number;
  };
}

// بيانات مؤقتة للعرض
const WEEKLY_DATA: CustomerServiceData = {
  calls: {
    complaints: 24,
    contactRequests: 56,
    maintenanceRequests: 89,
    inquiries: 120,
    officeInterests: 15,
    futureProjectInterests: 42,
    interestedCustomers: 67,
    totalCalls: 413
  },
  inquiries: {
    generalInquiries: 45,
    documentRequests: 23,
    deedInquiries: 18,
    apartmentRentals: 12,
    soldProjects: 34
  },
  maintenance: {
    cancelled: 7,
    resolved: 65,
    inProgress: 17
  }
};

const YEARLY_DATA: CustomerServiceData = {
  calls: {
    complaints: 345,
    contactRequests: 782,
    maintenanceRequests: 1456,
    inquiries: 2356,
    officeInterests: 287,
    futureProjectInterests: 534,
    interestedCustomers: 967,
    totalCalls: 6727
  },
  inquiries: {
    generalInquiries: 1245,
    documentRequests: 586,
    deedInquiries: 423,
    apartmentRentals: 256,
    soldProjects: 489
  },
  maintenance: {
    cancelled: 156,
    resolved: 1293,
    inProgress: 87
  }
};

// بيانات الرسوم البيانية
const generateTimelineData = (view: 'weekly' | 'yearly') => {
  if (view === 'weekly') {
    return [
      { day: "السبت", شكاوى: 5, "طلبات تواصل": 8, "طلبات صيانة": 12, استفسارات: 18 },
      { day: "الأحد", شكاوى: 6, "طلبات تواصل": 10, "طلبات صيانة": 15, استفسارات: 22 },
      { day: "الاثنين", شكاوى: 4, "طلبات تواصل": 12, "طلبات صيانة": 18, استفسارات: 25 },
      { day: "الثلاثاء", شكاوى: 3, "طلبات تواصل": 7, "طلبات صيانة": 14, استفسارات: 20 },
      { day: "الأربعاء", شكاوى: 4, "طلبات تواصل": 9, "طلبات صيانة": 16, استفسارات: 19 },
      { day: "الخميس", شكاوى: 2, "طلبات تواصل": 6, "طلبات صيانة": 10, استفسارات: 16 },
      { day: "الجمعة", شكاوى: 0, "طلبات تواصل": 4, "طلبات صيانة": 4, استفسارات: 0 },
    ];
  } else {
    return [
      { month: "يناير", شكاوى: 25, "طلبات تواصل": 45, "طلبات صيانة": 78, استفسارات: 125 },
      { month: "فبراير", شكاوى: 28, "طلبات تواصل": 50, "طلبات صيانة": 85, استفسارات: 142 },
      { month: "مارس", شكاوى: 32, "طلبات تواصل": 62, "طلبات صيانة": 95, استفسارات: 156 },
      { month: "أبريل", شكاوى: 30, "طلبات تواصل": 55, "طلبات صيانة": 90, استفسارات: 175 },
      { month: "مايو", شكاوى: 35, "طلبات تواصل": 65, "طلبات صيانة": 110, استفسارات: 195 },
      { month: "يونيو", شكاوى: 40, "طلبات تواصل": 70, "طلبات صيانة": 125, استفسارات: 210 },
      { month: "يوليو", شكاوى: 38, "طلبات تواصل": 75, "طلبات صيانة": 120, استفسارات: 205 },
      { month: "أغسطس", شكاوى: 42, "طلبات تواصل": 80, "طلبات صيانة": 135, استفسارات: 220 },
      { month: "سبتمبر", شكاوى: 45, "طلبات تواصل": 85, "طلبات صيانة": 145, استفسارات: 240 },
      { month: "أكتوبر", شكاوى: 42, "طلبات تواصل": 82, "طلبات صيانة": 140, استفسارات: 230 },
      { month: "نوفمبر", شكاوى: 40, "طلبات تواصل": 80, "طلبات صيانة": 135, استفسارات: 225 },
      { month: "ديسمبر", شكاوى: 38, "طلبات تواصل": 78, "طلبات صيانة": 128, استفسارات: 220 },
    ];
  }
};

const generateMaintenanceData = (view: 'weekly' | 'yearly') => {
  if (view === 'weekly') {
    return [
      { day: "السبت", "تم الإلغاء": 1, "تم الحل": 8, "قيد المعالجة": 4 },
      { day: "الأحد", "تم الإلغاء": 0, "تم الحل": 12, "قيد المعالجة": 5 },
      { day: "الاثنين", "تم الإلغاء": 2, "تم الحل": 15, "قيد المعالجة": 4 },
      { day: "الثلاثاء", "تم الإلغاء": 1, "تم الحل": 10, "قيد المعالجة": 3 },
      { day: "الأربعاء", "تم الإلغاء": 1, "تم الحل": 14, "قيد المعالجة": 2 },
      { day: "الخميس", "تم الإلغاء": 2, "تم الحل": 6, "قيد المعالجة": 0 },
      { day: "الجمعة", "تم الإلغاء": 0, "تم الحل": 0, "قيد المعالجة": 0 },
    ];
  } else {
    return [
      { month: "يناير", "تم الإلغاء": 10, "تم الحل": 65, "قيد المعالجة": 15 },
      { month: "فبراير", "تم الإلغاء": 12, "تم الحل": 75, "قيد المعالجة": 20 },
      { month: "مارس", "تم الإلغاء": 15, "تم الحل": 90, "قيد المعالجة": 12 },
      { month: "أبريل", "تم الإلغاء": 8, "تم الحل": 85, "قيد المعالجة": 10 },
      { month: "مايو", "تم الإلغاء": 14, "تم الحل": 110, "قيد المعالجة": 8 },
      { month: "يونيو", "تم الإلغاء": 18, "تم الحل": 120, "قيد المعالجة": 5 },
      { month: "يوليو", "تم الإلغاء": 15, "تم الحل": 115, "قيد المعالجة": 4 },
      { month: "أغسطس", "تم الإلغاء": 20, "تم الحل": 125, "قيد المعالجة": 3 },
      { month: "سبتمبر", "تم الإلغاء": 14, "تم الحل": 130, "قيد المعالجة": 5 },
      { month: "أكتوبر", "تم الإلغاء": 12, "تم الحل": 128, "قيد المعالجة": 2 },
      { month: "نوفمبر", "تم الإلغاء": 10, "تم الحل": 130, "قيد المعالجة": 3 },
      { month: "ديسمبر", "تم الإلغاء": 8, "تم الحل": 120, "قيد المعالجة": 0 },
    ];
  }
};

const generateInquiriesData = (view: 'weekly' | 'yearly') => {
  if (view === 'weekly') {
    return [
      { day: "السبت", قيمة: 12 },
      { day: "الأحد", قيمة: 18 },
      { day: "الاثنين", قيمة: 25 },
      { day: "الثلاثاء", قيمة: 22 },
      { day: "الأربعاء", قيمة: 20 },
      { day: "الخميس", قيمة: 15 },
      { day: "الجمعة", قيمة: 0 },
    ];
  } else {
    return [
      { month: "يناير", "استفسارات عامة": 25, "طلب أوراق": 15, "استفسارات صكوك": 10, "إيجارات شقق": 8, "مشاريع مباعة": 20 },
      { month: "فبراير", "استفسارات عامة": 30, "طلب أوراق": 18, "استفسارات صكوك": 12, "إيجارات شقق": 10, "مشاريع مباعة": 25 },
      { month: "مارس", "استفسارات عامة": 35, "طلب أوراق": 20, "استفسارات صكوك": 15, "إيجارات شقق": 12, "مشاريع مباعة": 30 },
      { month: "أبريل", "استفسارات عامة": 38, "طلب أوراق": 22, "استفسارات صكوك": 18, "إيجارات شقق": 10, "مشاريع مباعة": 28 },
      { month: "مايو", "استفسارات عامة": 42, "طلب أوراق": 25, "استفسارات صكوك": 20, "إيجارات شقق": 15, "مشاريع مباعة": 32 },
      { month: "يونيو", "استفسارات عامة": 45, "طلب أوراق": 28, "استفسارات صكوك": 22, "إيجارات شقق": 18, "مشاريع مباعة": 35 },
      { month: "يوليو", "استفسارات عامة": 48, "طلب أوراق": 30, "استفسارات صكوك": 25, "إيجارات شقق": 20, "مشاريع مباعة": 38 },
      { month: "أغسطس", "استفسارات عامة": 52, "طلب أوراق": 32, "استفسارات صكوك": 28, "إيجارات شقق": 22, "مشاريع مباعة": 40 },
      { month: "سبتمبر", "استفسارات عامة": 50, "طلب أوراق": 30, "استفسارات صكوك": 26, "إيجارات شقق": 20, "مشاريع مباعة": 42 },
      { month: "أكتوبر", "استفسارات عامة": 48, "طلب أوراق": 28, "استفسارات صكوك": 24, "إيجارات شقق": 18, "مشاريع مباعة": 40 },
      { month: "نوفمبر", "استفسارات عامة": 45, "طلب أوراق": 25, "استفسارات صكوك": 22, "إيجارات شقق": 15, "مشاريع مباعة": 38 },
      { month: "ديسمبر", "استفسارات عامة": 42, "طلب أوراق": 22, "استفسارات صكوك": 20, "إيجارات شقق": 12, "مشاريع مباعة": 35 },
    ];
  }
};

const CustomerServiceDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<string>('this-week');
  const [view, setView] = useState<'weekly' | 'yearly'>('weekly');
  const [activeTab, setActiveTab] = useState<string>('calls');
  const [data, setData] = useState<CustomerServiceData>(WEEKLY_DATA);
  const [chartData, setChartData] = useState(generateTimelineData('weekly'));
  const [maintenanceChartData, setMaintenanceChartData] = useState(generateMaintenanceData('weekly'));
  const [inquiriesChartData, setInquiriesChartData] = useState(generateInquiriesData('weekly'));

  // تحديث البيانات عند تغيير العرض
  useEffect(() => {
    setData(view === 'weekly' ? WEEKLY_DATA : YEARLY_DATA);
    setChartData(generateTimelineData(view));
    setMaintenanceChartData(generateMaintenanceData(view));
    setInquiriesChartData(generateInquiriesData(view));
  }, [view, timeRange]);

  return (
    <Layout>
      <div className="container mx-auto p-4 py-8 space-y-8 dir-rtl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold mb-4">لوحة خدمة العملاء</h1>
          <TimeRangeFilter 
            selectedTimeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            selectedView={view}
            onViewChange={setView}
            className="mb-4"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> المكالمات
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> الاستفسارات
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> طلبات الصيانة
            </TabsTrigger>
          </TabsList>

          {/* قسم المكالمات */}
          <TabsContent value="calls" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard 
                title="شكاوى"
                value={data.calls.complaints}
                icon={<MessageSquare className="h-4 w-4" />}
                className="bg-red-50"
              />
              <StatsCard 
                title="طلبات تواصل"
                value={data.calls.contactRequests}
                icon={<MessageSquare className="h-4 w-4" />}
                className="bg-blue-50"
              />
              <StatsCard 
                title="طلبات صيانة"
                value={data.calls.maintenanceRequests}
                icon={<ClipboardList className="h-4 w-4" />}
                className="bg-yellow-50"
              />
              <StatsCard 
                title="استفسارات"
                value={data.calls.inquiries}
                icon={<FileText className="h-4 w-4" />}
                className="bg-purple-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard 
                title="مهتمين مكاتب"
                value={data.calls.officeInterests}
                className="bg-green-50"
              />
              <StatsCard 
                title="مهتمين مشاريع قادمة"
                value={data.calls.futureProjectInterests}
                className="bg-green-50"
              />
              <StatsCard 
                title="عملاء مهتمين"
                value={data.calls.interestedCustomers}
                className="bg-green-50"
              />
              <StatsCard 
                title="إجمالي المكالمات"
                value={data.calls.totalCalls}
                trend={5}
                description="مقارنة بالفترة السابقة"
                className="bg-blue-100"
              />
            </div>

            <LineChart
              title="اتجاهات المكالمات"
              data={chartData}
              dataKey={view === 'weekly' ? 'day' : 'month'}
              categories={['شكاوى', 'طلبات تواصل', 'طلبات صيانة', 'استفسارات']}
              colors={['#f87171', '#3b82f6', '#facc15', '#8b5cf6']}
            />
          </TabsContent>

          {/* قسم الاستفسارات */}
          <TabsContent value="inquiries" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatsCard 
                title="استفسارات عامة"
                value={data.inquiries.generalInquiries}
                className="bg-blue-50"
              />
              <StatsCard 
                title="طلب أوراق للأهمية"
                value={data.inquiries.documentRequests}
                className="bg-blue-50"
              />
              <StatsCard 
                title="استفسارات عن الصكوك وإجراءات البيع"
                value={data.inquiries.deedInquiries}
                className="bg-blue-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatsCard 
                title="إيجارات شقق"
                value={data.inquiries.apartmentRentals}
                className="bg-green-50"
              />
              <StatsCard 
                title="مشاريع مباعة"
                value={data.inquiries.soldProjects}
                className="bg-green-50"
              />
            </div>

            {view === 'weekly' ? (
              <BarChart
                title="توزيع الاستفسارات الأسبوعية"
                data={inquiriesChartData as any}
                dataKey="day"
                categories={['قيمة']}
                colors={['#3b82f6']}
              />
            ) : (
              <BarChart
                title="توزيع أنواع الاستفسارات خلال العام"
                data={inquiriesChartData as any}
                dataKey="month"
                categories={[
                  'استفسارات عامة',
                  'طلب أوراق',
                  'استفسارات صكوك',
                  'إيجارات شقق',
                  'مشاريع مباعة'
                ]}
                colors={['#3b82f6', '#4ade80', '#facc15', '#f87171', '#8b5cf6']}
              />
            )}
          </TabsContent>

          {/* قسم طلبات الصيانة */}
          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard 
                title="تم الإلغاء"
                value={data.maintenance.cancelled}
                className="bg-red-50"
              />
              <StatsCard 
                title="تم الحل"
                value={data.maintenance.resolved}
                className="bg-green-50"
              />
              <StatsCard 
                title="قيد المعالجة"
                value={data.maintenance.inProgress}
                className="bg-yellow-50"
              />
            </div>

            <BarChart
              title="حالة طلبات الصيانة"
              data={maintenanceChartData}
              dataKey={view === 'weekly' ? 'day' : 'month'}
              categories={['تم الإلغاء', 'تم الحل', 'قيد المعالجة']}
              colors={['#f87171', '#4ade80', '#facc15']}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/maintenance-satisfaction')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            عرض رضا العملاء عن الصيانة
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerServiceDashboard;
