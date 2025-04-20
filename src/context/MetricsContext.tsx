import React, { createContext, useContext, useState, ReactNode } from "react";

// تعريف أنواع البيانات
export interface MetricData {
  title: string;
  value: string;
  target: string;
  icon: React.ReactNode;
  change: number;
  isPositive: boolean;
  reachedTarget: boolean;
  isLowerBetter: boolean;
}

export interface QualityData {
  week: string;
  facilityManagement: number;
  maintenance: number;
  delivery: number;
}

export interface NPSData {
  week: string;
  newCustomers: number;
  afterFirstYear: number;
  longTerm: number;
}

export interface CallsData {
  category: string;
  count: number;
}

export interface CustomerServiceData {
  calls: {
    complaints: number;
    contactRequests: number;
    maintenanceRequests: number;
    inquiries: number;
    officeInterested: number;
    projectsInterested: number;
    customersInterested: number;
    total: number;
  };
  inquiries: {
    general: number;
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

export interface MaintenanceSatisfactionData {
  serviceQuality: number;
  closureTime: number;
  firstTimeResolution: number;
  comments: string;
}

// تعريف نوع للبيانات مع فصل الأسبوعي والسنوي
export interface PeriodData {
  weekly: {
    metrics: MetricData[];
    qualityData: QualityData[];
    npsData: NPSData[];
    callsData: CallsData[];
  };
  yearly: {
    metrics: MetricData[];
    qualityData: QualityData[];
    npsData: NPSData[];
    callsData: CallsData[];
  };
}

interface MetricsContextType {
  currentPeriod: "weekly" | "yearly";
  setCurrentPeriod: (period: "weekly" | "yearly") => void;
  metrics: MetricData[];
  qualityData: QualityData[];
  npsData: NPSData[];
  callsData: CallsData[];
  updateMetric: (index: number, data: Partial<MetricData>) => void;
  updateQualityData: (index: number, data: Partial<QualityData>) => void;
  updateNPSData: (index: number, data: Partial<NPSData>) => void;
  updateCallsData: (index: number, data: Partial<CallsData>) => void;
  addMetric: (data: MetricData) => void;
  addQualityData: (data: QualityData) => void;
  addNPSData: (data: NPSData) => void;
  addCallsData: (data: CallsData) => void;
}

// البيانات الافتراضية للرسوم البيانية
const defaultQualityData = [
  { week: "الأسبوع 1", facilityManagement: 89, maintenance: 90, delivery: 95 },
  { week: "الأسبوع 2", facilityManagement: 92, maintenance: 95, delivery: 97 },
  { week: "الأسبوع 3", facilityManagement: 93, maintenance: 94, delivery: 96 },
  { week: "الأسبوع 4", facilityManagement: 96, maintenance: 97, delivery: 98 },
];

const defaultYearlyQualityData = [
  { week: "الربع الأول", facilityManagement: 90, maintenance: 92, delivery: 96 },
  { week: "الربع الثاني", facilityManagement: 93, maintenance: 95, delivery: 97 },
  { week: "الربع الثالث", facilityManagement: 94, maintenance: 96, delivery: 98 },
  { week: "الربع الرابع", facilityManagement: 97, maintenance: 98, delivery: 99 },
];

const defaultNpsData = [
  { week: "الأسبوع 1", newCustomers: 60, afterFirstYear: 61, longTerm: 30 },
  { week: "الأسبوع 2", newCustomers: 63, afterFirstYear: 64, longTerm: 32 },
  { week: "الأسبوع 3", newCustomers: 65, afterFirstYear: 66, longTerm: 36 },
  { week: "الأسبوع 4", newCustomers: 67, afterFirstYear: 68, longTerm: 37 },
];

const defaultYearlyNpsData = [
  { week: "الربع الأول", newCustomers: 61, afterFirstYear: 63, longTerm: 31 },
  { week: "الربع الثاني", newCustomers: 64, afterFirstYear: 65, longTerm: 34 },
  { week: "الربع الثالث", newCustomers: 66, afterFirstYear: 67, longTerm: 37 },
  { week: "الربع الرابع", newCustomers: 68, afterFirstYear: 69, longTerm: 39 },
];

const defaultCallsData = [
  { category: "مهتمين", count: 42 },
  { category: "مهتمين مشاريع", count: 38 },
  { category: "طلبات صيانة", count: 65 },
  { category: "استفسارات", count: 58 },
  { category: "مهتمين مكاتب", count: 34 },
  { category: "شكاوى", count: 28 },
];

const defaultYearlyCallsData = [
  { category: "مهتمين", count: 520 },
  { category: "مهتمين مشاريع", count: 480 },
  { category: "طلبات صيانة", count: 790 },
  { category: "استفسارات", count: 680 },
  { category: "مهتمين مكاتب", count: 410 },
  { category: "شكاوى", count: 340 },
];

// بيانات المؤشرات الافتراضية
const defaultMetrics = [
  {
    title: "نسبة الترشيح للعملاء الجدد",
    value: "65%",
    target: "65%",
    icon: null, // سيتم تعيينه في Dashboard.tsx
    change: 2.4,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "نسبة الترشيح بعد السنة",
    value: "67%",
    target: "65%",
    icon: null,
    change: 3.1,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "نسبة الترشيح للعملاء القدامى",
    value: "30%",
    target: "30%",
    icon: null,
    change: 1.8,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "جودة التسليم",
    value: "98%",
    target: "100%",
    icon: null,
    change: 1.5,
    isPositive: true,
    reachedTarget: false,
    isLowerBetter: false,
  },
  {
    title: "جودة الصيانة",
    value: "96%",
    target: "100%",
    icon: null,
    change: 2.8,
    isPositive: true,
    reachedTarget: false,
    isLowerBetter: false,
  },
  {
    title: "عدد الثواني للرد",
    value: "2.8 ثانية",
    target: "3 ثواني",
    icon: null,
    change: 5.7,
    isPositive: false,
    reachedTarget: true,
    isLowerBetter: true,
  },
  {
    title: "معدل الرد على المكالمات",
    value: "18%",
    target: "20%",
    icon: null,
    change: 4.3,
    isPositive: false,
    reachedTarget: false,
    isLowerBetter: true,
  },
  {
    title: "راحة العميل (CSAT)",
    value: "74%",
    target: "70%",
    icon: null,
    change: 5.7,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "سرعة إغلاق طلبات الصيانة",
    value: "2.5 يوم",
    target: "3 أيام",
    icon: null,
    change: 8.2,
    isPositive: false,
    reachedTarget: true,
    isLowerBetter: true,
  },
  {
    title: "عدد إعادة فتح طلب",
    value: "0",
    target: "0",
    icon: null,
    change: 0,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: true,
  },
  {
    title: "جودة إدارة المرافق",
    value: "80%",
    target: "80%",
    icon: null,
    change: 1.8,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "معدل التحول",
    value: "2%",
    target: "2%",
    icon: null,
    change: 1.5,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "نسبة الرضا عن التسليم",
    value: "80%",
    target: "80%",
    icon: null,
    change: 2.3,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "عدد العملاء المرشحين",
    value: "584",
    target: "584",
    icon: null,
    change: 3.5,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "المساهمة في المبيعات",
    value: "5%",
    target: "5%",
    icon: null,
    change: 2.1,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
];

const defaultYearlyMetrics = [
  {
    title: "نسبة الترشيح للعملاء الجدد",
    value: "68%",
    target: "65%",
    icon: null, 
    change: 4.6,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "نسبة الترشيح بعد السنة",
    value: "70%",
    target: "65%",
    icon: null,
    change: 7.7,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "نسبة الترشيح للعملاء القدامى",
    value: "35%",
    target: "30%",
    icon: null,
    change: 16.7,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "جودة التسليم",
    value: "99%",
    target: "100%",
    icon: null,
    change: 2.5,
    isPositive: true,
    reachedTarget: false,
    isLowerBetter: false,
  },
  {
    title: "جودة الصيانة",
    value: "98%",
    target: "100%",
    icon: null,
    change: 3.8,
    isPositive: true,
    reachedTarget: false,
    isLowerBetter: false,
  },
  {
    title: "عدد الثواني للرد",
    value: "2.5 ثانية",
    target: "3 ثواني",
    icon: null,
    change: 16.7,
    isPositive: false,
    reachedTarget: true,
    isLowerBetter: true,
  },
  {
    title: "معدل الرد على المكالمات",
    value: "16%",
    target: "20%",
    icon: null,
    change: 20.0,
    isPositive: false,
    reachedTarget: false,
    isLowerBetter: true,
  },
  {
    title: "راحة العميل (CSAT)",
    value: "78%",
    target: "70%",
    icon: null,
    change: 11.4,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "سرعة إغلاق طلبات الصيانة",
    value: "2.2 يوم",
    target: "3 أيام",
    icon: null,
    change: 26.7,
    isPositive: false,
    reachedTarget: true,
    isLowerBetter: true,
  },
  {
    title: "عدد إعادة فتح طلب",
    value: "2",
    target: "0",
    icon: null,
    change: 200,
    isPositive: false,
    reachedTarget: false,
    isLowerBetter: true,
  },
  {
    title: "جودة إدارة المرافق",
    value: "85%",
    target: "80%",
    icon: null,
    change: 6.25,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "معدل التحول",
    value: "2.5%",
    target: "2%",
    icon: null,
    change: 25.0,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "نسبة الرضا عن التسليم",
    value: "85%",
    target: "80%",
    icon: null,
    change: 6.25,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "عدد العملاء المرشحين",
    value: "672",
    target: "584",
    icon: null,
    change: 15.1,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
  {
    title: "المساهمة في المبيعات",
    value: "7%",
    target: "5%",
    icon: null,
    change: 40.0,
    isPositive: true,
    reachedTarget: true,
    isLowerBetter: false,
  },
];

// إنشاء السياق
const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

// مزود السياق
export function MetricsProvider({ children }: { children: ReactNode }) {
  const [currentPeriod, setCurrentPeriod] = useState<"weekly" | "yearly">("weekly");
  
  // تخزين البيانات مع فصل بين الأسبوعي والسنوي
  const [periodData, setPeriodData] = useState<PeriodData>({
    weekly: {
      metrics: defaultMetrics,
      qualityData: defaultQualityData,
      npsData: defaultNpsData,
      callsData: defaultCallsData
    },
    yearly: {
      metrics: defaultYearlyMetrics,
      qualityData: defaultYearlyQualityData,
      npsData: defaultYearlyNpsData,
      callsData: defaultYearlyCallsData
    }
  });

  const [customerServiceData, setCustomerServiceData] = useState<CustomerServiceData>({
    calls: {
      complaints: 0,
      contactRequests: 0,
      maintenanceRequests: 0,
      inquiries: 0,
      officeInterested: 0,
      projectsInterested: 0,
      customersInterested: 0,
      total: 0
    },
    inquiries: {
      general: 0,
      documentRequests: 0,
      deedInquiries: 0,
      apartmentRentals: 0,
      soldProjects: 0
    },
    maintenance: {
      cancelled: 0,
      resolved: 0,
      inProgress: 0
    }
  });

  const [maintenanceSatisfaction, setMaintenanceSatisfaction] = useState<MaintenanceSatisfactionData>({
    serviceQuality: 0,
    closureTime: 0,
    firstTimeResolution: 0,
    comments: ""
  });

  // الحصول على البيانات الحالية (أسبوعي أو سنوي)
  const metrics = periodData[currentPeriod].metrics;
  const qualityData = periodData[currentPeriod].qualityData;
  const npsData = periodData[currentPeriod].npsData;
  const callsData = periodData[currentPeriod].callsData;

  // تحديث مؤشر موجود
  const updateMetric = (index: number, data: Partial<MetricData>) => {
    setPeriodData(prev => {
      const newData = { ...prev };
      newData[currentPeriod].metrics = [...prev[currentPeriod].metrics];
      newData[currentPeriod].metrics[index] = { 
        ...newData[currentPeriod].metrics[index], 
        ...data 
      };
      return newData;
    });
  };

  // تحديث بيانات الجودة
  const updateQualityData = (index: number, data: Partial<QualityData>) => {
    setPeriodData(prev => {
      const newData = { ...prev };
      newData[currentPeriod].qualityData = [...prev[currentPeriod].qualityData];
      newData[currentPeriod].qualityData[index] = { 
        ...newData[currentPeriod].qualityData[index], 
        ...data 
      };
      return newData;
    });
  };

  // تحديث بيانات الترشيح
  const updateNPSData = (index: number, data: Partial<NPSData>) => {
    setPeriodData(prev => {
      const newData = { ...prev };
      newData[currentPeriod].npsData = [...prev[currentPeriod].npsData];
      newData[currentPeriod].npsData[index] = { 
        ...newData[currentPeriod].npsData[index], 
        ...data 
      };
      return newData;
    });
  };

  // تحديث بيانات المكالمات
  const updateCallsData = (index: number, data: Partial<CallsData>) => {
    setPeriodData(prev => {
      const newData = { ...prev };
      newData[currentPeriod].callsData = [...prev[currentPeriod].callsData];
      newData[currentPeriod].callsData[index] = { 
        ...newData[currentPeriod].callsData[index], 
        ...data 
      };
      return newData;
    });
  };

  // إضافة مؤشر جديد
  const addMetric = (data: MetricData) => {
    setPeriodData(prev => {
      const newData = { ...prev };
      newData[currentPeriod].metrics = [...prev[currentPeriod].metrics, data];
      return newData;
    });
  };

  // إضافة بيانات جودة جديدة
  const addQualityData = (data: QualityData) => {
    setPeriodData(prev => {
      const newData = { ...prev };
      newData[currentPeriod].qualityData = [...prev[currentPeriod].qualityData, data];
      return newData;
    });
  };

  // إضافة بيانات ترشيح جديدة
  const addNPSData = (data: NPSData) => {
    setPeriodData(prev => {
      const newData = { ...prev };
      newData[currentPeriod].npsData = [...prev[currentPeriod].npsData, data];
      return newData;
    });
  };

  // إضافة بيانات مكالمات جديدة
  const addCallsData = (data: CallsData) => {
    setPeriodData(prev => {
      const newData = { ...prev };
      newData[currentPeriod].callsData = [...prev[currentPeriod].callsData, data];
      return newData;
    });
  };

  const updateCustomerServiceData = async (data: CustomerServiceData) => {
    try {
      // تحديث حالة خدمة العملاء
      setCustomerServiceData(data);
      
      // تحديث المؤشرات والرسوم البيانية
      const total = Object.values(data.calls).reduce((sum, val) => sum + val, 0) - data.calls.total;
      data.calls.total = total;

      setPeriodData(prev => ({
        ...prev,
        [currentPeriod]: {
          ...prev[currentPeriod],
          metrics: prev[currentPeriod].metrics.map(metric => {
            if (metric.title === "إجمالي المكالمات") {
              return { ...metric, value: String(total) };
            }
            if (metric.title === "طلبات الصيانة") {
              return { ...metric, value: String(data.maintenance.inProgress) };
            }
            return metric;
          }),
          callsData: [
            { category: "شكاوى", count: data.calls.complaints },
            { category: "طلبات تواصل", count: data.calls.contactRequests },
            { category: "طلبات صيانة", count: data.calls.maintenanceRequests },
            { category: "استفسارات", count: data.calls.inquiries },
            { category: "مهتمين مكاتب", count: data.calls.officeInterested },
            { category: "مهتمين مشاريع", count: data.calls.projectsInterested },
            { category: "عملاء مهتمين", count: data.calls.customersInterested }
          ]
        }
      }));
      
      setPeriodData(prev => ({
        ...prev,
        [currentPeriod]: {
          ...prev[currentPeriod],
          metrics: updatedMetrics,
          callsData: [
            { category: "شكاوى", count: data.calls.complaints },
            { category: "طلبات تواصل", count: data.calls.contactRequests },
            { category: "طلبات صيانة", count: data.calls.maintenanceRequests },
            { category: "استفسارات", count: data.calls.inquiries },
            { category: "مهتمين مكاتب", count: data.calls.officeInterested },
            { category: "مهتمين مشاريع", count: data.calls.projectsInterested },
            { category: "عملاء مهتمين", count: data.calls.customersInterested }
          ]
        }
      }));
      
      // تحديث البيانات ذات الصلة في المؤشرات الأخرى
      const newCallsData = [
        { category: "شكاوى", count: data.calls.complaints },
        { category: "طلبات تواصل", count: data.calls.contactRequests },
        { category: "طلبات صيانة", count: data.calls.maintenanceRequests },
        { category: "استفسارات", count: data.calls.inquiries },
        { category: "مهتمين مكاتب", count: data.calls.officeInterested },
        { category: "مهتمين مشاريع", count: data.calls.projectsInterested },
        { category: "عملاء مهتمين", count: data.calls.customersInterested },
      ];

      setPeriodData(prev => ({
        ...prev,
        [currentPeriod]: {
          ...prev[currentPeriod],
          callsData: newCallsData
        }
      }));
      
      // حفظ في قاعدة البيانات
      await prisma.customerServiceData.create({
        data: {
          period: currentPeriod,
          complaints: data.calls.complaints,
          contactRequests: data.calls.contactRequests,
          maintenanceRequests: data.calls.maintenanceRequests,
          inquiries: data.calls.inquiries,
          officeInterested: data.calls.officeInterested,
          projectsInterested: data.calls.projectsInterested,
          customersInterested: data.calls.customersInterested,
          generalInquiries: data.inquiries.general,
          documentRequests: data.inquiries.documentRequests,
          deedInquiries: data.inquiries.deedInquiries,
          apartmentRentals: data.inquiries.apartmentRentals,
          soldProjects: data.inquiries.soldProjects,
          maintenanceCancelled: data.maintenance.cancelled,
          maintenanceResolved: data.maintenance.resolved,
          maintenanceInProgress: data.maintenance.inProgress
        }
      });
    } catch (error) {
      console.error("خطأ في حفظ بيانات خدمة العملاء:", error);
      throw error;
    }
  };

  const updateMaintenanceSatisfactionData = (data: MaintenanceSatisfactionData) => {
    // تحديث حالة رضا العملاء
    setMaintenanceSatisfaction(data);

    // تحديث جميع المؤشرات ذات الصلة
    setPeriodData(prev => ({
      ...prev,
      [currentPeriod]: {
        ...prev[currentPeriod],
        metrics: prev[currentPeriod].metrics.map(metric => {
          if (metric.title === "الرضا عن خدمات الصيانة") {
            return {
              ...metric,
              value: `${data.serviceQuality}%`,
              change: ((data.serviceQuality - parseFloat(metric.target)) / parseFloat(metric.target)) * 100,
              isPositive: data.serviceQuality >= parseFloat(metric.target)
            };
          }
          if (metric.title === "الرضا عن مدة إغلاق الطلبات") {
            return {
              ...metric,
              value: `${data.closureTime}%`,
              change: ((data.closureTime - parseFloat(metric.target)) / parseFloat(metric.target)) * 100,
              isPositive: data.closureTime >= parseFloat(metric.target)
            };
          }
          if (metric.title === "نسبة الإغلاق من أول مرة") {
            return {
              ...metric,
              value: `${data.firstTimeResolution}%`,
              change: ((data.firstTimeResolution - parseFloat(metric.target)) / parseFloat(metric.target)) * 100,
              isPositive: data.firstTimeResolution >= parseFloat(metric.target)
            };
          }
          return metric;
        })
      }
    }));
      if (metric.title === "الرضا عن خدمات الصيانة") {
        return {
          ...metric,
          value: `${data.serviceQuality}%`
        };
      }
      if (metric.title === "الرضا عن مدة إغلاق الطلبات") {
        return {
          ...metric,
          value: `${data.closureTime}%`
        };
      }
      if (metric.title === "نسبة الإغلاق من أول مرة") {
        return {
          ...metric,
          value: `${data.firstTimeResolution}%`
        };
      }
      return metric;
    });

    setPeriodData(prev => ({
      ...prev,
      [currentPeriod]: {
        ...prev[currentPeriod],
        metrics: maintenanceMetrics
      }
    }));
  };

  return (
    <MetricsContext.Provider 
      value={{ 
        currentPeriod,
        setCurrentPeriod,
        metrics, 
        qualityData, 
        npsData, 
        callsData, 
        updateMetric, 
        updateQualityData, 
        updateNPSData, 
        updateCallsData,
        addMetric,
        addQualityData,
        addNPSData,
        addCallsData,
        updateCustomerServiceData,
        updateMaintenanceSatisfactionData,
        customerServiceData,
        maintenanceSatisfaction
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
}

// هوك لاستخدام السياق
export function useMetrics() {
  const context = useContext(MetricsContext);
  if (context === undefined) {
    throw new Error("useMetrics must be used within a MetricsProvider");
  }
  return context;
}
