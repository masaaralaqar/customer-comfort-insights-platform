
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMetrics } from "@/context/MetricsContext";
import { useNotification } from "@/context/NotificationContext";

export default function DataEntry() {
  const { metrics, qualityData, npsData, callsData, updateMetric, updateQualityData, updateNPSData, updateCallsData } = useMetrics();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState("metrics");
  
  // نسخة عمل للتعديلات
  const [workingMetrics, setWorkingMetrics] = useState(metrics.map(metric => ({ ...metric })));
  const [workingQualityData, setWorkingQualityData] = useState(qualityData.map(item => ({ ...item })));
  const [workingNPSData, setWorkingNPSData] = useState(npsData.map(item => ({ ...item })));
  const [workingCallsData, setWorkingCallsData] = useState(callsData.map(item => ({ ...item })));

  // تعديل المؤشرات
  const handleMetricChange = (index: number, field: keyof typeof workingMetrics[0], value: string | number | boolean) => {
    setWorkingMetrics(prev => {
      const newMetrics = [...prev];
      // @ts-ignore - تجاهل خطأ TypeScript هنا لأننا نعلم أن الحقل موجود
      newMetrics[index][field] = value;
      
      // التحقق من تحقيق الهدف
      if (field === 'value' || field === 'target') {
        const metricValue = parseFloat(newMetrics[index].value.toString().replace('%', '').replace(' ثانية', '').replace(' يوم', ''));
        const targetValue = parseFloat(newMetrics[index].target.toString().replace('%', '').replace(' ثانية', '').replace(' يوم', ''));
        
        if (!isNaN(metricValue) && !isNaN(targetValue)) {
          const isLowerBetter = newMetrics[index].isLowerBetter;
          newMetrics[index].reachedTarget = isLowerBetter 
            ? metricValue <= targetValue 
            : metricValue >= targetValue;
        }
      }
      
      return newMetrics;
    });
  };

  // تعديل بيانات الجودة
  const handleQualityDataChange = (index: number, field: keyof typeof workingQualityData[0], value: string | number) => {
    setWorkingQualityData(prev => {
      const newData = [...prev];
      // @ts-ignore
      newData[index][field] = field === 'week' ? value : Number(value);
      return newData;
    });
  };

  // تعديل بيانات الترشيح
  const handleNPSDataChange = (index: number, field: keyof typeof workingNPSData[0], value: string | number) => {
    setWorkingNPSData(prev => {
      const newData = [...prev];
      // @ts-ignore
      newData[index][field] = field === 'week' ? value : Number(value);
      return newData;
    });
  };

  // تعديل بيانات المكالمات
  const handleCallsDataChange = (index: number, field: keyof typeof workingCallsData[0], value: string | number) => {
    setWorkingCallsData(prev => {
      const newData = [...prev];
      // @ts-ignore
      newData[index][field] = field === 'category' ? value : Number(value);
      return newData;
    });
  };

  // حفظ التغييرات
  const saveMetrics = () => {
    workingMetrics.forEach((metric, index) => {
      updateMetric(index, metric);
    });
    
    addNotification({
      title: "تم الحفظ",
      message: "تم حفظ تغييرات المؤشرات بنجاح",
      type: "success"
    });
  };

  const saveQualityData = () => {
    workingQualityData.forEach((data, index) => {
      updateQualityData(index, data);
    });
    
    addNotification({
      title: "تم الحفظ",
      message: "تم حفظ تغييرات بيانات الجودة بنجاح",
      type: "success"
    });
  };

  const saveNPSData = () => {
    workingNPSData.forEach((data, index) => {
      updateNPSData(index, data);
    });
    
    addNotification({
      title: "تم الحفظ",
      message: "تم حفظ تغييرات بيانات الترشيح بنجاح",
      type: "success"
    });
  };

  const saveCallsData = () => {
    workingCallsData.forEach((data, index) => {
      updateCallsData(index, data);
    });
    
    addNotification({
      title: "تم الحفظ",
      message: "تم حفظ تغييرات بيانات المكالمات بنجاح",
      type: "success"
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدخال البيانات والمؤشرات</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="metrics">مؤشرات الأداء</TabsTrigger>
            <TabsTrigger value="quality">بيانات الجودة</TabsTrigger>
            <TabsTrigger value="nps">بيانات الترشيح</TabsTrigger>
            <TabsTrigger value="calls">بيانات المكالمات</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تحديث مؤشرات الأداء</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-md mb-4">
                  <p className="text-sm text-muted-foreground">قم بتحديث قيم المؤشرات. كل التغييرات ستنعكس في لوحة التحكم الرئيسية بعد الحفظ.</p>
                </div>
                
                <div className="space-y-6">
                  {workingMetrics.map((metric, index) => (
                    <div key={index} className="border rounded-md p-4 space-y-3">
                      <h3 className="font-medium text-lg">{metric.title}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`value-${index}`}>القيمة الحالية</Label>
                          <Input
                            id={`value-${index}`}
                            value={metric.value}
                            onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`target-${index}`}>القيمة المستهدفة</Label>
                          <Input
                            id={`target-${index}`}
                            value={metric.target}
                            onChange={(e) => handleMetricChange(index, 'target', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`change-${index}`}>نسبة التغيير</Label>
                          <Input
                            id={`change-${index}`}
                            type="number"
                            step="0.1"
                            value={metric.change}
                            onChange={(e) => handleMetricChange(index, 'change', parseFloat(e.target.value))}
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-3">
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`isPositive-${index}`}
                                checked={metric.isPositive}
                                onChange={(e) => handleMetricChange(index, 'isPositive', e.target.checked)}
                                className="h-4 w-4"
                              />
                              <Label htmlFor={`isPositive-${index}`}>التغيير إيجابي</Label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`isLowerBetter-${index}`}
                                checked={metric.isLowerBetter}
                                onChange={(e) => handleMetricChange(index, 'isLowerBetter', e.target.checked)}
                                className="h-4 w-4"
                              />
                              <Label htmlFor={`isLowerBetter-${index}`}>القيمة الأقل أفضل</Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button onClick={saveMetrics} className="mt-6">حفظ التغييرات</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تحديث بيانات الجودة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-md mb-4">
                  <p className="text-sm text-muted-foreground">تحديث بيانات الجودة للرسوم البيانية</p>
                </div>
                
                <div className="space-y-6">
                  {workingQualityData.map((item, index) => (
                    <div key={index} className="border rounded-md p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`week-quality-${index}`}>الأسبوع</Label>
                          <Input
                            id={`week-quality-${index}`}
                            value={item.week}
                            onChange={(e) => handleQualityDataChange(index, 'week', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`facilityManagement-${index}`}>جودة إدارة المرافق (%)</Label>
                          <Input
                            id={`facilityManagement-${index}`}
                            type="number"
                            min="0"
                            max="100"
                            value={item.facilityManagement}
                            onChange={(e) => handleQualityDataChange(index, 'facilityManagement', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`maintenance-${index}`}>جودة الصيانة (%)</Label>
                          <Input
                            id={`maintenance-${index}`}
                            type="number"
                            min="0"
                            max="100"
                            value={item.maintenance}
                            onChange={(e) => handleQualityDataChange(index, 'maintenance', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`delivery-${index}`}>جودة التسليم (%)</Label>
                          <Input
                            id={`delivery-${index}`}
                            type="number"
                            min="0"
                            max="100"
                            value={item.delivery}
                            onChange={(e) => handleQualityDataChange(index, 'delivery', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button onClick={saveQualityData} className="mt-6">حفظ التغييرات</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تحديث بيانات الترشيح</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-md mb-4">
                  <p className="text-sm text-muted-foreground">تحديث بيانات نسب الترشيح للرسوم البيانية</p>
                </div>
                
                <div className="space-y-6">
                  {workingNPSData.map((item, index) => (
                    <div key={index} className="border rounded-md p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`week-nps-${index}`}>الأسبوع</Label>
                          <Input
                            id={`week-nps-${index}`}
                            value={item.week}
                            onChange={(e) => handleNPSDataChange(index, 'week', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`newCustomers-${index}`}>نسبة الترشيح للعملاء الجدد (%)</Label>
                          <Input
                            id={`newCustomers-${index}`}
                            type="number"
                            min="0"
                            max="100"
                            value={item.newCustomers}
                            onChange={(e) => handleNPSDataChange(index, 'newCustomers', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`afterFirstYear-${index}`}>نسبة الترشيح بعد السنة (%)</Label>
                          <Input
                            id={`afterFirstYear-${index}`}
                            type="number"
                            min="0"
                            max="100"
                            value={item.afterFirstYear}
                            onChange={(e) => handleNPSDataChange(index, 'afterFirstYear', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`longTerm-${index}`}>نسبة الترشيح للعملاء القدامى (%)</Label>
                          <Input
                            id={`longTerm-${index}`}
                            type="number"
                            min="0"
                            max="100"
                            value={item.longTerm}
                            onChange={(e) => handleNPSDataChange(index, 'longTerm', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button onClick={saveNPSData} className="mt-6">حفظ التغييرات</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تحديث بيانات المكالمات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-md mb-4">
                  <p className="text-sm text-muted-foreground">تحديث بيانات أنواع المكالمات للرسوم البيانية</p>
                </div>
                
                <div className="space-y-6">
                  {workingCallsData.map((item, index) => (
                    <div key={index} className="border rounded-md p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`category-${index}`}>فئة المكالمة</Label>
                          <Input
                            id={`category-${index}`}
                            value={item.category}
                            onChange={(e) => handleCallsDataChange(index, 'category', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`count-${index}`}>عدد المكالمات</Label>
                          <Input
                            id={`count-${index}`}
                            type="number"
                            min="0"
                            value={item.count}
                            onChange={(e) => handleCallsDataChange(index, 'count', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button onClick={saveCallsData} className="mt-6">حفظ التغييرات</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
