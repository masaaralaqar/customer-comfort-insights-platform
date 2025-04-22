import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useMetrics } from "@/context/MetricsContext";
import { useNotification } from "@/context/NotificationContext";
import { supabase } from "@/integrations/supabase/client";

export default function DataEntry() {
  const { 
    metrics, 
    qualityData, 
    npsData, 
    callsData, 
    updateMetric, 
    updateQualityData, 
    updateNPSData, 
    updateCallsData,
    updateCustomerServiceData,
    updateMaintenanceSatisfactionData,
    currentPeriod,
    setCurrentPeriod 
  } = useMetrics();
  
  const { addNotification } = useNotification();
  
  const [workingMetrics, setWorkingMetrics] = useState(metrics.map(metric => ({ ...metric })));
  const [workingQualityData, setWorkingQualityData] = useState(qualityData.map(item => ({ ...item })));
  const [workingNPSData, setWorkingNPSData] = useState(npsData.map(item => ({ ...item })));
  const [workingCallsData, setWorkingCallsData] = useState(callsData.map(item => ({ ...item })));
  const [customerServiceData, setCustomerServiceData] = useState({
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
  
  const [maintenanceSatisfaction, setMaintenanceSatisfaction] = useState({
    serviceQuality: {
      veryHappy: 0,
      happy: 0,
      neutral: 0,
      unhappy: 0,
      veryUnhappy: 0
    },
    closureTime: {
      veryHappy: 0,
      happy: 0,
      neutral: 0,
      unhappy: 0,
      veryUnhappy: 0
    },
    firstTimeResolution: {
      veryHappy: 0,
      happy: 0,
      neutral: 0,
      unhappy: 0,
      veryUnhappy: 0
    },
    comments: []
  });

  useEffect(() => {
    setWorkingMetrics(metrics.map(metric => ({ ...metric })));
    setWorkingQualityData(qualityData.map(item => ({ ...item })));
    setWorkingNPSData(npsData.map(item => ({ ...item })));
    setWorkingCallsData(callsData.map(item => ({ ...item })));
    
    loadCustomerServiceData();
    loadMaintenanceSatisfactionData();
  }, [metrics, qualityData, npsData, callsData, currentPeriod]);

  const loadCustomerServiceData = async () => {
    try {
      const { data: callsData, error: callsError } = await supabase
        .from('customer_service_metrics')
        .select('*')
        .eq('period', currentPeriod)
        .eq('category', 'calls');
        
      const { data: inquiriesData, error: inquiriesError } = await supabase
        .from('customer_service_metrics')
        .select('*')
        .eq('period', currentPeriod)
        .eq('category', 'inquiries');
        
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('customer_service_metrics')
        .select('*')
        .eq('period', currentPeriod)
        .eq('category', 'maintenance');
        
      if (callsError || inquiriesError || maintenanceError) {
        console.error('Error loading data:', callsError || inquiriesError || maintenanceError);
        return;
      }
      
      const newData = {
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
      };
      
      if (callsData) {
        callsData.forEach(item => {
          if (item.metric_name && item.metric_name in newData.calls) {
            newData.calls[item.metric_name as keyof typeof newData.calls] = item.value || 0;
          }
        });
      }
      
      if (inquiriesData) {
        inquiriesData.forEach(item => {
          if (item.metric_name && item.metric_name in newData.inquiries) {
            newData.inquiries[item.metric_name as keyof typeof newData.inquiries] = item.value || 0;
          }
        });
      }
      
      if (maintenanceData) {
        maintenanceData.forEach(item => {
          if (item.metric_name && item.metric_name in newData.maintenance) {
            newData.maintenance[item.metric_name as keyof typeof newData.maintenance] = item.value || 0;
          }
        });
      }
      
      newData.calls.total = Object.values(newData.calls).reduce((sum, val) => 
        typeof val === 'number' ? sum + val : sum, 0
      ) - newData.calls.total;
      
      setCustomerServiceData(newData);
    } catch (error) {
      console.error('Error loading customer service data:', error);
    }
  };

  const loadMaintenanceSatisfactionData = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_satisfaction')
        .select('*')
        .eq('period', currentPeriod);
        
      if (error) {
        console.error('Error loading maintenance satisfaction data:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const newData = {
          serviceQuality: {
            veryHappy: 0,
            happy: 0,
            neutral: 0,
            unhappy: 0,
            veryUnhappy: 0
          },
          closureTime: {
            veryHappy: 0,
            happy: 0,
            neutral: 0,
            unhappy: 0,
            veryUnhappy: 0
          },
          firstTimeResolution: {
            veryHappy: 0,
            happy: 0,
            neutral: 0,
            unhappy: 0,
            veryUnhappy: 0
          },
          comments: [] as string[]
        };
        
        data.forEach(item => {
          if (item.satisfaction_metric === 'serviceQuality' && item.rating) {
            newData.serviceQuality[item.rating as keyof typeof newData.serviceQuality] = item.percentage || 0;
          } else if (item.satisfaction_metric === 'closureTime' && item.rating) {
            newData.closureTime[item.rating as keyof typeof newData.closureTime] = item.percentage || 0;
          } else if (item.satisfaction_metric === 'firstTimeResolution' && item.rating) {
            newData.firstTimeResolution[item.rating as keyof typeof newData.firstTimeResolution] = item.percentage || 0;
          }
          
          if (item.notes) {
            newData.comments.push(item.notes);
          }
        });
        
        setMaintenanceSatisfaction(newData);
      }
    } catch (error) {
      console.error('Error loading maintenance satisfaction data:', error);
    }
  };

  const handleMetricChange = (index: number, field: string, value: string | number) => {
    setWorkingMetrics(prev => {
      const newMetrics = [...prev];
      if (field === 'value') {
        newMetrics[index].value = value.toString();
        const currentValue = parseFloat(value.toString());
        const targetValue = parseFloat(newMetrics[index].target);
        const changePercentage = ((currentValue - targetValue) / targetValue) * 100;
        newMetrics[index].change = Math.round(changePercentage * 10) / 10;
        newMetrics[index].isPositive = !newMetrics[index].isLowerBetter ? changePercentage > 0 : changePercentage < 0;
        newMetrics[index].reachedTarget = !newMetrics[index].isLowerBetter 
          ? currentValue >= targetValue 
          : currentValue <= targetValue;
      } else if (field === 'target') {
        newMetrics[index].target = value.toString();
      }
      return newMetrics;
    });
  };

  const handleQualityDataChange = (index: number, field: keyof typeof workingQualityData[0], value: number | string) => {
    setWorkingQualityData(prev => {
      const newData = [...prev];
      if (field === 'week') {
        newData[index][field] = value.toString();
      } else {
        newData[index][field as 'facilityManagement' | 'maintenance' | 'delivery'] = Number(value);
      }
      return newData;
    });
  };

  const handleNPSDataChange = (index: number, field: keyof typeof workingNPSData[0], value: number | string) => {
    setWorkingNPSData(prev => {
      const newData = [...prev];
      if (field === 'week') {
        newData[index][field] = value.toString();
      } else {
        newData[index][field as 'newCustomers' | 'afterFirstYear' | 'longTerm'] = Number(value);
      }
      return newData;
    });
  };

  const handleCallsDataChange = (index: number, field: keyof typeof workingCallsData[0], value: string | number) => {
    setWorkingCallsData(prev => {
      const newData = [...prev];
      if (field === 'count') {
        newData[index][field] = Number(value);
      } else if (field === 'category') {
        newData[index][field] = value.toString();
      }
      return newData;
    });
  };

  const saveChanges = async () => {
    try {
      workingMetrics.forEach((metric, index) => {
        if (metric.value !== metrics[index].value || metric.target !== metrics[index].target) {
          updateMetric(index, metric);
        }
      });
      
      workingQualityData.forEach((data, index) => {
        const original = qualityData[index];
        if (JSON.stringify(data) !== JSON.stringify(original)) {
          updateQualityData(index, data);
        }
      });
      
      workingNPSData.forEach((data, index) => {
        const original = npsData[index];
        if (JSON.stringify(data) !== JSON.stringify(original)) {
          updateNPSData(index, data);
        }
      });
      
      workingCallsData.forEach((data, index) => {
        const original = callsData[index];
        if (JSON.stringify(data) !== JSON.stringify(original)) {
          updateCallsData(index, data);
        }
      });

      if (customerServiceData && customerServiceData.calls.total > 0) {
        await updateCustomerServiceData(customerServiceData);
      }

      const serviceQualityHasValues = Object.values(maintenanceSatisfaction.serviceQuality).some(val => val > 0);
      const closureTimeHasValues = Object.values(maintenanceSatisfaction.closureTime).some(val => val > 0);
      const firstTimeResolutionHasValues = Object.values(maintenanceSatisfaction.firstTimeResolution).some(val => val > 0);
      
      if (maintenanceSatisfaction && 
         (serviceQualityHasValues || 
          closureTimeHasValues || 
          firstTimeResolutionHasValues)) {
        updateMaintenanceSatisfactionData(maintenanceSatisfaction);
      }
      
      const metricsToUpdate = workingMetrics.filter((metric, index) => 
        metric.value !== metrics[index].value || metric.target !== metrics[index].target
      );
      
      for (const metric of metricsToUpdate) {
        await supabase.from('metrics').upsert({
          title: metric.title,
          value: metric.value,
          target: metric.target,
          change: metric.change,
          ispositive: metric.isPositive,
          reachedtarget: metric.reachedTarget,
          islowerbetter: metric.isLowerBetter,
          _period: currentPeriod
        }, {
          onConflict: 'title,_period'
        });
      }
      
      addNotification({
        title: "تم الحفظ",
        message: `تم تحديث البيانات ${currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"} بنجاح`,
        type: "success"
      });

    } catch (error) {
      console.error("خطأ في حفظ البيانات:", error);
      addNotification({
        title: "خطأ",
        message: "حدث خطأ أثناء حفظ البيانات: " + (error as Error).message,
        type: "error"
      });
    }
  };

  const handleCustomerServiceChange = async () => {
    try {
      await updateCustomerServiceData(customerServiceData);
      addNotification({
        title: "تم التحديث",
        message: "تم تحديث بيانات خدمة العملاء بنجاح",
        type: "success"
      });
    } catch (error) {
      console.error("خطأ في تحديث بيانات خدمة العملاء:", error);
      addNotification({
        title: "خطأ",
        message: "حدث خطأ أثناء تحديث البيانات",
        type: "error"
      });
    }
  };

  const handleMaintenanceSatisfactionChange = async () => {
    try {
      await updateMaintenanceSatisfactionData(maintenanceSatisfaction);
      
      try {
        for (const [rating, percentage] of Object.entries(maintenanceSatisfaction.serviceQuality)) {
          await supabase.from('maintenance_satisfaction').upsert({
            period: currentPeriod,
            satisfaction_metric: 'serviceQuality',
            rating: rating,
            percentage: percentage
          }, {
            onConflict: 'period,satisfaction_metric,rating'
          });
        }
        
        for (const [rating, percentage] of Object.entries(maintenanceSatisfaction.closureTime)) {
          await supabase.from('maintenance_satisfaction').upsert({
            period: currentPeriod,
            satisfaction_metric: 'closureTime',
            rating: rating,
            percentage: percentage
          }, {
            onConflict: 'period,satisfaction_metric,rating'
          });
        }
        
        for (const [rating, percentage] of Object.entries(maintenanceSatisfaction.firstTimeResolution)) {
          await supabase.from('maintenance_satisfaction').upsert({
            period: currentPeriod,
            satisfaction_metric: 'firstTimeResolution',
            rating: rating,
            percentage: percentage
          }, {
            onConflict: 'period,satisfaction_metric,rating'
          });
        }
        
        if (maintenanceSatisfaction.comments.length > 0) {
          for (const comment of maintenanceSatisfaction.comments) {
            await supabase.from('maintenance_satisfaction').insert({
              period: currentPeriod,
              satisfaction_metric: 'comment',
              notes: comment
            });
          }
        }
      } catch (error) {
        console.error('Error saving to Supabase:', error);
      }
      
      addNotification({
        title: "تم التحديث",
        message: "تم تحديث بيانات رضا العملاء عن الصيانة بنجاح",
        type: "success"
      });
    } catch (error) {
      console.error("خطأ في تحديث بيانات رضا العملاء:", error);
      addNotification({
        title: "خطأ",
        message: "حدث خطأ أثناء تحديث البيانات",
        type: "error"
      });
    }
  };

  const updateSatisfactionValue = (category: 'serviceQuality' | 'closureTime' | 'firstTimeResolution', rating: keyof typeof maintenanceSatisfaction.serviceQuality, value: number) => {
    setMaintenanceSatisfaction(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [rating]: value
      }
    }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدخال البيانات والمؤشرات</h1>
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

        <Tabs defaultValue="metrics" className="space-y-4">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="metrics">مؤشرات الأداء</TabsTrigger>
            <TabsTrigger value="quality">بيانات الجودة</TabsTrigger>
            <TabsTrigger value="nps">بيانات الترشيح</TabsTrigger>
            <TabsTrigger value="calls">بيانات المكالمات</TabsTrigger>
            <TabsTrigger value="customer-service">خدمة العملاء</TabsTrigger>
            <TabsTrigger value="maintenance-satisfaction">رضا العملاء عن الصيانة</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics">
            <Card>
              <CardHeader>
                <CardTitle>تحديث مؤشرات الأداء {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {workingMetrics.map((metric, index) => (
                    <div key={index} className="space-y-4 border rounded-lg p-4">
                      <h3 className="font-medium">{metric.title}</h3>
                      <div className="space-y-4">
                        <div>
                          <Label>القيمة الحالية</Label>
                          <Input
                            type="number"
                            value={metric.value.replace(/[^0-9.]/g, '')}
                            onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>القيمة المستهدفة</Label>
                          <Input
                            type="number"
                            value={metric.target.replace(/[^0-9.]/g, '')}
                            onChange={(e) => handleMetricChange(index, 'target', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality">
            <Card>
              <CardHeader>
                <CardTitle>تحديث بيانات الجودة {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {workingQualityData.map((data, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>{currentPeriod === "weekly" ? "الأسبوع" : "الفترة"}</Label>
                          <Input
                            value={data.week}
                            onChange={(e) => handleQualityDataChange(index, 'week', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>جودة إدارة المرافق (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={data.facilityManagement}
                            onChange={(e) => handleQualityDataChange(index, 'facilityManagement', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>جودة الصيانة (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={data.maintenance}
                            onChange={(e) => handleQualityDataChange(index, 'maintenance', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>جودة التسليم (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={data.delivery}
                            onChange={(e) => handleQualityDataChange(index, 'delivery', Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nps">
            <Card>
              <CardHeader>
                <CardTitle>تحديث بيانات الترشيح {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {workingNPSData.map((data, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>{currentPeriod === "weekly" ? "الأسبوع" : "الفترة"}</Label>
                          <Input
                            value={data.week}
                            onChange={(e) => handleNPSDataChange(index, 'week', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>نسبة الترشيح للعملاء الجدد (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={data.newCustomers}
                            onChange={(e) => handleNPSDataChange(index, 'newCustomers', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>نسبة الترشيح بعد السنة (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={data.afterFirstYear}
                            onChange={(e) => handleNPSDataChange(index, 'afterFirstYear', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>نسبة الترشيح للعملاء القدامى (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={data.longTerm}
                            onChange={(e) => handleNPSDataChange(index, 'longTerm', Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls">
            <Card>
              <CardHeader>
                <CardTitle>تحديث بيانات المكالمات {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {workingCallsData.map((data, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>نوع المكالمة</Label>
                          <Input
                            value={data.category}
                            onChange={(e) => handleCallsDataChange(index, 'category', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>عدد المكالمات</Label>
                          <Input
                            type="number"
                            min="0"
                            value={data.count}
                            onChange={(e) => handleCallsDataChange(index, 'count', Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer-service">
            <Card>
              <CardHeader>
                <CardTitle>إدخال بيانات خدمة العملاء {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">فئة المكالمات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label>شكاوى</Label>
                        <Input
                          type="number"
                          value={customerServiceData.calls.complaints}
                          onChange={(e) => setCustomerServiceData(prev => ({
                            ...prev,
                            calls: { ...prev.calls, complaints: Number(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>طلبات تواصل</Label>
                        <Input
                          type="number"
                          value={customerServiceData.calls.contactRequests}
                          onChange={(e) => setCustomerServiceData(prev => ({
                            ...prev,
                            calls: { ...prev.calls, contactRequests: Number(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>طلبات صيانة</Label>
                        <Input
                          type="number"
                          value={customerServiceData.calls.maintenanceRequests}
                          onChange={(e) => setCustomerServiceData(prev => ({
                            ...prev,
                            calls: { ...prev.calls, maintenanceRequests: Number(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>استفسارات</Label>
                        <Input
                          type="number"
                          value={customerServiceData.calls.inquiries}
                          onChange={(e) => setCustomerServiceData(prev => ({
                            ...prev,
                            calls: { ...prev.calls, inquiries: Number(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>مهتمين مكاتب</Label>
                        <Input
                          type="number"
                          value={customerServiceData.calls.officeInterested}
                          onChange={(e) => setCustomerServiceData(prev => ({
                            ...prev,
                            calls: { ...prev.calls, officeInterested: Number(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>مهتمين مشاريع قادمة</Label>
                        <Input
                          type="number"
                          value={customerServiceData.calls.projectsInterested}
                          onChange={(e) => setCustomerServiceData(prev => ({
                            ...prev,
                            calls: { ...prev.calls, projectsInterested: Number(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>عملاء مهتمين</Label>
                        <Input
                          type="number"
                          value={customerServiceData.calls.customersInterested}
                          onChange={(e) => setCustomerServiceData(prev => ({
                            ...prev,
                            calls: { ...prev.calls, customersInterested: Number(e.target.value) }
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">فئة الاستفسارات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label>استفسارات عامة</Label>
                        <Input
                          type="number"
                          value={customerServiceData.inquiries.general}
                          onChange={(e) => setCustomerServiceData(prev => ({
                            ...prev,
                            inquiries: { ...prev.inquiries, general: Number(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>طلب أوراق للأهمية</Label>
                        <Input
                          type="number"
                          value={customerServiceData.inquiries.documentRequests}
                          onChange={(e) => setCustomerServiceData(prev => ({
                            ...prev,
                            inquiries: { ...prev.inquiries, documentRequests: Number(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>استفسارات عن الصكوك</Label>
                        <Input
                          type="number"
                          value={customerServiceData.inquiries.deedInquiries}
                          onChange={(e) => setCustomerServiceData(prev => ({
                            ...prev,
                            inquiries: { ...prev.inquiries, deedInquiries: Number(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>إيجارات شقق</Label>
                        <Input
                          type="number"
                          value={customerServiceData.inquiries.apartmentRentals}
                          onChange={(e) => setCustomerServiceData(prev => ({
                            ...prev,
                            inquiries: { ...prev.inquiries, apartmentRentals: Number(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>مشاريع مباعة</Label>
                        <Input
                          type="number"
                          value={customerServiceData.inquiries.soldProjects}
                          onChange={(e) => setCustomerServiceData(prev => ({
                            ...prev,
                            inquiries: { ...prev.inquiries, soldProjects: Number(e.target.value) }
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">فئة طلبات الصيانة</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>تم الإلغاء</Label>
                        <Input
                          type="number"
                          value={customerServiceData.maintenance.cancelled}
                          onChange={(e) => setCustomerServiceData(prev => ({
                            ...prev,
                            maintenance: { ...prev.maintenance, cancelled: Number(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>تم الحل</Label>
                        <Input
                          type="number"
                          value={customerServiceData.maintenance.resolved}
                          onChange={(e) => setCustomerServiceData(prev => ({
                            ...prev,
                            maintenance: { ...prev.maintenance, resolved: Number(e.target.value) }
                          }))}
                        />
                      </div>
                      <div>
                        <Label>قيد المعالجة</Label>
                        <Input
                          type="number"
                          value={customerServiceData.maintenance.inProgress}
                          onChange={(e) => setCustomerServiceData(prev => ({
                            ...prev,
                            maintenance: { ...prev.maintenance, inProgress: Number(e.target.value) }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={handleCustomerServiceChange}>
                    حفظ بيانات خدمة العملاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance-satisfaction">
            <Card>
              <CardHeader>
                <CardTitle>إدخال بيانات رضا العملاء عن الصيانة {currentPeriod === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">الرضا عن خدمات الصيانة</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <Label>راضي جدًا (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={maintenanceSatisfaction.serviceQuality.veryHappy}
                          onChange={(e) => updateSatisfactionValue('serviceQuality', 'veryHappy', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>راضي (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={maintenanceSatisfaction.serviceQuality.happy}
                          onChange={(e) => updateSatisfactionValue('serviceQuality', 'happy', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>محايد (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={maintenanceSatisfaction.serviceQuality.neutral}
                          onChange={(e) => updateSatisfactionValue('serviceQuality', 'neutral', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>غير راضي (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={maintenanceSatisfaction.serviceQuality.unhappy}
                          onChange={(e) => updateSatisfactionValue('serviceQuality', 'unhappy', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>غير راضي تمامًا (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={maintenanceSatisfaction.serviceQuality.veryUnhappy}
                          onChange={(e) => updateSatisfactionValue('serviceQuality', 'veryUnhappy', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">الرضا عن مدة إغلاق الطلبات</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <Label>راضي جدًا (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={maintenanceSatisfaction.closureTime.veryHappy}
                          onChange={(e) => updateSatisfactionValue('closureTime', 'veryHappy', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>راضي (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={maintenanceSatisfaction.closureTime.happy}
                          onChange={(e) => updateSatisfactionValue('closureTime', 'happy', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>محايد (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={maintenanceSatisfaction.closureTime.neutral}
                          onChange={(e) => updateSatisfactionValue('closureTime', 'neutral', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>غير راضي (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={maintenanceSatisfaction.closureTime.unhappy}
                          onChange={(e) => updateSatisfactionValue('closureTime', 'unhappy', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>غير راضي تمامًا (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={maintenanceSatisfaction.closureTime.veryUnhappy}
                          onChange={(e) => updateSatisfactionValue('closureTime', 'veryUnhappy', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">هل تم إغلاق الطلب من أول مرة؟</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <Label>راضي جدًا (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={maintenanceSatisfaction.firstTimeResolution.veryHappy}
                          onChange={(e) => updateSatisfactionValue('firstTimeResolution', 'veryHappy', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>راضي (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={maintenanceSatisfaction.firstTimeResolution.happy}
                          onChange={(e) => updateSatisfactionValue('firstTimeResolution', 'happy', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>محايد (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={maintenanceSatisfaction.firstTimeResolution.neutral}
                          onChange={(e) => updateSatisfactionValue('firstTimeResolution', 'neutral', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>غير راضي (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={maintenanceSatisfaction.firstTimeResolution.unhappy}
                          onChange={(e) => updateSatisfactionValue('firstTimeResolution', 'unhappy', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>غير راضي تمامًا (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={maintenanceSatisfaction.firstTimeResolution.veryUnhappy}
                          onChange={(e) => updateSatisfactionValue('firstTimeResolution', 'veryUnhappy', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">ملاحظات</h3>
                    <Textarea
                      placeholder="أضف ملاحظات العملاء هنا..."
                      value={maintenanceSatisfaction.comments.join('\n')}
                      onChange={(e) => setMaintenanceSatisfaction(prev => ({
                        ...prev,
                        comments: e.target.value.split('\n')
                      }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={handleMaintenanceSatisfactionChange}>
                    حفظ بيانات رضا العملاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button onClick={saveChanges} size="lg" className="px-8">
            حفظ جميع التغييرات
          </Button>
        </div>
      </div>
    </Layout>
  );
}
