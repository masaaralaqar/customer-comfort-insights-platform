
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

interface MetricsContextType {
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

const defaultNpsData = [
  { week: "الأسبوع 1", newCustomers: 60, afterFirstYear: 61, longTerm: 30 },
  { week: "الأسبوع 2", newCustomers: 63, afterFirstYear: 64, longTerm: 32 },
  { week: "الأسبوع 3", newCustomers: 65, afterFirstYear: 66, longTerm: 36 },
  { week: "الأسبوع 4", newCustomers: 67, afterFirstYear: 68, longTerm: 37 },
];

const defaultCallsData = [
  { category: "مهتمين", count: 42 },
  { category: "مهتمين مشاريع", count: 38 },
  { category: "طلبات صيانة", count: 65 },
  { category: "استفسارات", count: 58 },
  { category: "مهتمين مكاتب", count: 34 },
  { category: "شكاوى", count: 28 },
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

// إنشاء السياق
const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

// مزود السياق
export function MetricsProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<MetricData[]>(defaultMetrics);
  const [qualityData, setQualityData] = useState<QualityData[]>(defaultQualityData);
  const [npsData, setNpsData] = useState<NPSData[]>(defaultNpsData);
  const [callsData, setCallsData] = useState<CallsData[]>(defaultCallsData);

  // تحديث مؤشر موجود
  const updateMetric = (index: number, data: Partial<MetricData>) => {
    setMetrics(prev => {
      const newMetrics = [...prev];
      newMetrics[index] = { ...newMetrics[index], ...data };
      return newMetrics;
    });
  };

  // تحديث بيانات الجودة
  const updateQualityData = (index: number, data: Partial<QualityData>) => {
    setQualityData(prev => {
      const newData = [...prev];
      newData[index] = { ...newData[index], ...data };
      return newData;
    });
  };

  // تحديث بيانات الترشيح
  const updateNPSData = (index: number, data: Partial<NPSData>) => {
    setNpsData(prev => {
      const newData = [...prev];
      newData[index] = { ...newData[index], ...data };
      return newData;
    });
  };

  // تحديث بيانات المكالمات
  const updateCallsData = (index: number, data: Partial<CallsData>) => {
    setCallsData(prev => {
      const newData = [...prev];
      newData[index] = { ...newData[index], ...data };
      return newData;
    });
  };

  // إضافة مؤشر جديد
  const addMetric = (data: MetricData) => {
    setMetrics(prev => [...prev, data]);
  };

  // إضافة بيانات جودة جديدة
  const addQualityData = (data: QualityData) => {
    setQualityData(prev => [...prev, data]);
  };

  // إضافة بيانات ترشيح جديدة
  const addNPSData = (data: NPSData) => {
    setNpsData(prev => [...prev, data]);
  };

  // إضافة بيانات مكالمات جديدة
  const addCallsData = (data: CallsData) => {
    setCallsData(prev => [...prev, data]);
  };

  return (
    <MetricsContext.Provider 
      value={{ 
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
        addCallsData
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
