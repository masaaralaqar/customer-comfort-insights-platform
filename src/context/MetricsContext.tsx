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
  serviceQuality: {
    veryHappy: number;
    happy: number;
    neutral: number;
    unhappy: number;
    veryUnhappy: number;
  };
  closureTime: {
    veryHappy: number;
    happy: number;
    neutral: number;
    unhappy: number;
    veryUnhappy: number;
  };
  firstTimeResolution: {
    veryHappy: number;
    happy: number;
    neutral: number;
    unhappy: number;
    veryUnhappy: number;
  };
  comments: string[];
}

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
  customerServiceData: CustomerServiceData;
  maintenanceSatisfaction: MaintenanceSatisfactionData;
  updateMetric: (index: number, data: Partial<MetricData>) => void;
  updateQualityData: (index: number, data: Partial<QualityData>) => void;
  updateNPSData: (index: number, data: Partial<NPSData>) => void;
  updateCallsData: (index: number, data: Partial<CallsData>) => void;
  addMetric: (data: MetricData) => void;
  addQualityData: (data: QualityData) => void;
  addNPSData: (data: NPSData) => void;
  addCallsData: (data: CallsData) => void;
  updateCustomerServiceData: (data: CustomerServiceData) => Promise<void>;
  updateMaintenanceSatisfactionData: (data: MaintenanceSatisfactionData) => void;
}

// البيانات الافتراضية
const defaultMetrics = [
  {
    title: "نسبة الترشيح للعملاء الجدد",
    value: "65%",
    target: "65%",
    icon: null,
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

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export function MetricsProvider({ children }: { children: ReactNode }) {
  const [currentPeriod, setCurrentPeriod] = useState<"weekly" | "yearly">("weekly");
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

  const [customerServiceData, setCustomerServiceData] = useState<{
    weekly: CustomerServiceData;
    yearly: CustomerServiceData;
  }>({
    weekly: {
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
    },
    yearly: {
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
    }
  });

  const [maintenanceSatisfaction, setMaintenanceSatisfaction] = useState<{
    weekly: MaintenanceSatisfactionData;
    yearly: MaintenanceSatisfactionData;
  }>({
    weekly: {
      serviceQuality: { veryHappy: 0, happy: 0, neutral: 0, unhappy: 0, veryUnhappy: 0 },
      closureTime: { veryHappy: 0, happy: 0, neutral: 0, unhappy: 0, veryUnhappy: 0 },
      firstTimeResolution: { veryHappy: 0, happy: 0, neutral: 0, unhappy: 0, veryUnhappy: 0 },
      comments: []
    },
    yearly: {
      serviceQuality: { veryHappy: 0, happy: 0, neutral: 0, unhappy: 0, veryUnhappy: 0 },
      closureTime: { veryHappy: 0, happy: 0, neutral: 0, unhappy: 0, veryUnhappy: 0 },
      firstTimeResolution: { veryHappy: 0, happy: 0, neutral: 0, unhappy: 0, veryUnhappy: 0 },
      comments: []
    }
  });

  const metrics = periodData[currentPeriod].metrics;
  const qualityData = periodData[currentPeriod].qualityData;
  const npsData = periodData[currentPeriod].npsData;
  const callsData = periodData[currentPeriod].callsData;

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

  const addMetric = (data: MetricData) => {
    setPeriodData(prev => ({
      ...prev,
      [currentPeriod]: {
        ...prev[currentPeriod],
        metrics: [...prev[currentPeriod].metrics, data]
      }
    }));
  };

  const addQualityData = (data: QualityData) => {
    setPeriodData(prev => ({
      ...prev,
      [currentPeriod]: {
        ...prev[currentPeriod],
        qualityData: [...prev[currentPeriod].qualityData, data]
      }
    }));
  };

  const addNPSData = (data: NPSData) => {
    setPeriodData(prev => ({
      ...prev,
      [currentPeriod]: {
        ...prev[currentPeriod],
        npsData: [...prev[currentPeriod].npsData, data]
      }
    }));
  };

  const addCallsData = (data: CallsData) => {
    setPeriodData(prev => ({
      ...prev,
      [currentPeriod]: {
        ...prev[currentPeriod],
        callsData: [...prev[currentPeriod].callsData, data]
      }
    }));
  };

  const updateCustomerServiceData = async (data: CustomerServiceData) => {
    try {
      // حساب الإجمالي بشكل صحيح
      const total = Object.values(data.calls).reduce((sum, val) => 
        typeof val === 'number' && !isNaN(val) && val >= 0 ? sum + val : sum, 0
      ) - (data.calls.total || 0); // استثناء الإجمالي من الحساب

      const updatedData = {
        ...data,
        calls: {
          ...data.calls,
          total: total
        }
      };

      // تحديث حالة الصفحات المرتبطة
      setPeriodData(prev => ({
        ...prev,
        [currentPeriod]: {
          ...prev[currentPeriod],
          metrics: prev[currentPeriod].metrics.map(metric => {
            if (metric.title === "إجمالي المكالمات") {
              return {
                ...metric,
                value: total.toString(),
                change: ((total - parseFloat(metric.target)) / parseFloat(metric.target)) * 100,
                isPositive: total >= parseFloat(metric.target)
              };
            }
            return metric;
          })
        }
      }));

      // Update local state and metrics simultaneously
      setPeriodData(prev => {
        const newMetrics = [...prev[currentPeriod].metrics];
        
        // Update total calls metric
        const totalCallsIndex = newMetrics.findIndex(m => m.title === "معدل الرد على المكالمات");
        if (totalCallsIndex !== -1) {
          const target = parseFloat(newMetrics[totalCallsIndex].target);
          newMetrics[totalCallsIndex] = {
            ...newMetrics[totalCallsIndex],
            value: `${total}`,
            change: ((total - target) / target) * 100,
            isPositive: total >= target
          };
        }

        // Update maintenance requests metric
        const maintenanceIndex = newMetrics.findIndex(m => m.title === "طلبات الصيانة");
        if (maintenanceIndex !== -1) {
          const maintenanceTotal = updatedData.maintenance.resolved + 
                                 updatedData.maintenance.inProgress + 
                                 updatedData.maintenance.cancelled;
          const target = parseFloat(newMetrics[maintenanceIndex].target);
          newMetrics[maintenanceIndex] = {
            ...newMetrics[maintenanceIndex],
            value: `${maintenanceTotal}`,
            change: ((maintenanceTotal - target) / target) * 100,
            isPositive: maintenanceTotal >= target
          };
        }

        return {
          ...prev,
          [currentPeriod]: {
            ...prev[currentPeriod],
            metrics: newMetrics
          }
        };
      });

      // Update customer service data
      setCustomerServiceData(prev => ({
        ...prev,
        [currentPeriod]: updatedData
      }));

      return updatedData;
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
      throw new Error('فشل في حفظ البيانات');
    }
  };

  const calculateSatisfactionPercentage = (data: Record<string, number>) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    const weightedSum = (
      data.veryHappy * 100 +
      data.happy * 75 +
      data.neutral * 50 +
      data.unhappy * 25 +
      data.veryUnhappy * 0
    );
    return total > 0 ? weightedSum / total : 0;
  };

  const updateMaintenanceSatisfactionData = (data: MaintenanceSatisfactionData) => {
    try {
      const serviceQualityPercentage = calculateSatisfactionPercentage(data.serviceQuality);
      const closureTimePercentage = calculateSatisfactionPercentage(data.closureTime);
      const firstTimeResolutionPercentage = calculateSatisfactionPercentage(data.firstTimeResolution);

      // تحديث بيانات الرضا
      setMaintenanceSatisfaction(prev => ({
        ...prev,
        [currentPeriod]: {
          ...data,
          comments: Array.isArray(data.comments) ? data.comments : [data.comments]
        }
      }));

      // تحديث المؤشرات المرتبطة
      setPeriodData(prev => ({
        ...prev,
        [currentPeriod]: {
          ...prev[currentPeriod],
          metrics: prev[currentPeriod].metrics.map(metric => {
            switch (metric.title) {
              case "جودة الصيانة":
                return {
                  ...metric,
                  value: `${serviceQualityPercentage.toFixed(1)}%`,
                  change: serviceQualityPercentage - parseFloat(metric.target),
                  isPositive: serviceQualityPercentage >= parseFloat(metric.target)
                };
              case "سرعة إغلاق طلبات الصيانة":
                return {
                  ...metric,
                  value: `${closureTimePercentage.toFixed(1)}%`,
                  change: closureTimePercentage - parseFloat(metric.target),
                  isPositive: closureTimePercentage >= parseFloat(metric.target)
                };
              case "نسبة الإغلاق من أول مرة":
                return {
                  ...metric,
                  value: `${firstTimeResolutionPercentage.toFixed(1)}%`,
                  change: firstTimeResolutionPercentage - parseFloat(metric.target),
                  isPositive: firstTimeResolutionPercentage >= parseFloat(metric.target)
                };
              default:
                return metric;
            }
          }),
          qualityData: prev[currentPeriod].qualityData.map(item => ({
            ...item,
            maintenance: serviceQualityPercentage
          }))
        }
      }));

    // Update both states simultaneously
    setPeriodData(prev => {
      const newMetrics = [...prev[currentPeriod].metrics];
      
      // Update satisfaction metrics
      newMetrics.forEach((metric, index) => {
        switch (metric.title) {
          case "جودة الصيانة":
            newMetrics[index] = {
              ...metric,
              value: `${serviceQualityPercentage.toFixed(1)}%`,
              change: serviceQualityPercentage - parseFloat(metric.target),
              isPositive: serviceQualityPercentage >= parseFloat(metric.target)
            };
            break;
          case "سرعة إغلاق طلبات الصيانة":
            newMetrics[index] = {
              ...metric,
              value: `${closureTimePercentage.toFixed(1)}%`,
              change: closureTimePercentage - parseFloat(metric.target),
              isPositive: closureTimePercentage >= parseFloat(metric.target)
            };
            break;
          case "نسبة الإغلاق من أول مرة":
            newMetrics[index] = {
              ...metric,
              value: `${firstTimeResolutionPercentage.toFixed(1)}%`,
              change: firstTimeResolutionPercentage - parseFloat(metric.target),
              isPositive: firstTimeResolutionPercentage >= parseFloat(metric.target)
            };
            break;
        }
      });

      return {
        ...prev,
        [currentPeriod]: {
          ...prev[currentPeriod],
          metrics: newMetrics,
          qualityData: prev[currentPeriod].qualityData.map(item => ({
            ...item,
            maintenance: serviceQualityPercentage
          }))
        }
      };
    });

    setMaintenanceSatisfaction(prev => ({
      ...prev,
      [currentPeriod]: {
        ...data,
        comments: Array.isArray(data.comments) ? data.comments : [data.comments]
      }
    }));

    // Update related metrics
    setPeriodData(prev => ({
      ...prev,
      [currentPeriod]: {
        ...prev[currentPeriod],
        metrics: prev[currentPeriod].metrics.map(metric => {
          switch (metric.title) {
            case "الرضا عن خدمات الصيانة":
              return {
                ...metric,
                value: `${calculateSatisfactionPercentage(data.serviceQuality).toFixed(1)}%`,
                change: calculateSatisfactionPercentage(data.serviceQuality) - parseFloat(metric.target),
                isPositive: calculateSatisfactionPercentage(data.serviceQuality) >= parseFloat(metric.target)
              };
            case "الرضا عن مدة إغلاق الطلبات":
              return {
                ...metric,
                value: `${calculateSatisfactionPercentage(data.closureTime).toFixed(1)}%`,
                change: calculateSatisfactionPercentage(data.closureTime) - parseFloat(metric.target),
                isPositive: calculateSatisfactionPercentage(data.closureTime) >= parseFloat(metric.target)
              };
            case "نسبة الإغلاق من أول مرة":
              return {
                ...metric,
                value: `${calculateSatisfactionPercentage(data.firstTimeResolution).toFixed(1)}%`,
                change: calculateSatisfactionPercentage(data.firstTimeResolution) - parseFloat(metric.target),
                isPositive: calculateSatisfactionPercentage(data.firstTimeResolution) >= parseFloat(metric.target)
              };
            default:
              return metric;
          }
        })
      }
    }));
  };

  return (
    <MetricsContext.Provider 
      value={{ 
        currentPeriod,
        setCurrentPeriod,
        metrics: periodData[currentPeriod].metrics,
        qualityData: periodData[currentPeriod].qualityData,
        npsData: periodData[currentPeriod].npsData,
        callsData: periodData[currentPeriod].callsData,
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
        customerServiceData: customerServiceData[currentPeriod],
        maintenanceSatisfaction: maintenanceSatisfaction[currentPeriod]
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
}

export function useMetrics() {
  const context = useContext(MetricsContext);
  if (context === undefined) {
    throw new Error("useMetrics must be used within a MetricsProvider");
  }
  return context;
}