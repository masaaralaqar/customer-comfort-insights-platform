
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useMetrics } from "@/context/MetricsContext";
import { useNotification } from "@/context/NotificationContext";

export default function DataEntry() {
  const { metrics, qualityData, npsData, callsData, updateMetric, updateQualityData, updateNPSData, updateCallsData } = useMetrics();
  const { addNotification } = useNotification();
  const [period, setPeriod] = useState<"weekly" | "yearly">("weekly");
  
  // نسخة عمل للتعديلات
  const [workingMetrics, setWorkingMetrics] = useState(metrics.map(metric => ({ ...metric })));
  const [workingQualityData, setWorkingQualityData] = useState(qualityData.map(item => ({ ...item })));
  const [workingNPSData, setWorkingNPSData] = useState(npsData.map(item => ({ ...item })));
  const [workingCallsData, setWorkingCallsData] = useState(callsData.map(item => ({ ...item })));

  const handleMetricChange = (index: number, field: string, value: string | number) => {
    setWorkingMetrics(prev => {
      const newMetrics = [...prev];
      if (field === 'value') {
        newMetrics[index].value = value.toString();
        // حساب نسبة التغيير
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

  const handleQualityDataChange = (index: number, field: keyof typeof workingQualityData[0], value: number) => {
    setWorkingQualityData(prev => {
      const newData = [...prev];
      newData[index][field] = field === 'week' ? value.toString() : value;
      return newData;
    });
  };

  const handleNPSDataChange = (index: number, field: keyof typeof workingNPSData[0], value: number) => {
    setWorkingNPSData(prev => {
      const newData = [...prev];
      newData[index][field] = field === 'week' ? value.toString() : value;
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

  const saveChanges = () => {
    // حفظ كل التغييرات
    workingMetrics.forEach((metric, index) => {
      updateMetric(index, metric);
    });
    
    workingQualityData.forEach((data, index) => {
      updateQualityData(index, data);
    });
    
    workingNPSData.forEach((data, index) => {
      updateNPSData(index, data);
    });
    
    workingCallsData.forEach((data, index) => {
      updateCallsData(index, data);
    });
    
    addNotification({
      title: "تم الحفظ",
      message: "تم حفظ جميع البيانات بنجاح",
      type: "success"
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدخال البيانات والمؤشرات</h1>
          <div className="flex gap-2">
            <Button
              variant={period === "weekly" ? "default" : "outline"}
              onClick={() => setPeriod("weekly")}
            >
              أسبوعي
            </Button>
            <Button
              variant={period === "yearly" ? "default" : "outline"}
              onClick={() => setPeriod("yearly")}
            >
              سنوي
            </Button>
          </div>
        </div>

        <Tabs defaultValue="metrics" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="metrics">مؤشرات الأداء</TabsTrigger>
            <TabsTrigger value="quality">بيانات الجودة</TabsTrigger>
            <TabsTrigger value="nps">بيانات الترشيح</TabsTrigger>
            <TabsTrigger value="calls">بيانات المكالمات</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics">
            <Card>
              <CardHeader>
                <CardTitle>تحديث مؤشرات الأداء {period === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
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
                <CardTitle>تحديث بيانات الجودة {period === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {workingQualityData.map((data, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <CardTitle>تحديث بيانات الترشيح {period === "weekly" ? "الأسبوعية" : "السنوية"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {workingNPSData.map((data, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <CardTitle>تحديث بيانات المكالمات</CardTitle>
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
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={saveChanges} size="lg">
            حفظ جميع التغييرات
          </Button>
        </div>
      </div>
    </Layout>
  );
}
