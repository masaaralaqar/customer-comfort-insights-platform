
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useNotification } from "@/context/NotificationContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function DataEntry() {
  const [periodType, setPeriodType] = useState<"weekly" | "yearly">("weekly");
  const { addNotification } = useNotification();
  
  // بيانات NPS
  const [npsData, setNpsData] = useState({
    newCustomersNPS: "",
    firstYearNPS: "",
    longTermNPS: "",
    deliveryQuality: "",
    maintenanceQuality: "",
    responseTime: "",
    callResponseRate: "",
    customerSatisfaction: "",
    closingSpeed: "",
    salesContribution: "",
    conversionRate: "",
    facilityManagement: "",
    reopenRequests: "",
    deliverySatisfaction: "",
    recommendedCustomers: "",
  });

  // بيانات خدمة العملاء
  const [customerServiceData, setCustomerServiceData] = useState({
    interestedCustomers: "",
    futureProjectsInterested: "",
    officeInterested: "",
    inquiries: "",
    maintenanceRequests: "",
    contactRequests: "",
    complaints: "",
    totalCalls: "",
  });
  
  // بيانات استفسارات العملاء
  const [inquiryData, setInquiryData] = useState({
    soldProjects: "",
    apartmentRentals: "",
    deedInquiries: "",
    documentRequests: "",
    generalInquiries: "",
  });
  
  // بيانات طلبات الصيانة
  const [maintenanceRequestsData, setMaintenanceRequestsData] = useState({
    cancelled: "",
    resolved: "",
    inProgress: "",
  });
  
  // بيانات رضا العملاء عن الصيانة
  const [maintenanceSatisfactionData, setMaintenanceSatisfactionData] = useState({
    servicesSatisfaction: "",
    closingTimeSatisfaction: "",
    firstTimeResolution: "",
    feedback: "",
  });

  // معالجة تغيير القيم في النماذج
  const handleNPSChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNpsData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerServiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInquiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInquiryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaintenanceRequestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMaintenanceRequestsData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaintenanceSatisfactionChange = (
    name: string,
    value: string
  ) => {
    setMaintenanceSatisfactionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMaintenanceSatisfactionData((prev) => ({ ...prev, feedback: e.target.value }));
  };

  const handleNPSSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا يتم إرسال البيانات إلى قاعدة البيانات
    addNotification({
      title: "تم حفظ البيانات",
      message: `تم حفظ بيانات مقاييس NPS والجودة بنجاح (${periodType})`,
      type: "success",
    });
  };

  const handleCustomerServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا يتم إرسال بيانات خدمة العملاء إلى قاعدة البيانات
    addNotification({
      title: "تم حفظ البيانات",
      message: `تم حفظ بيانات خدمة العملاء بنجاح (${periodType})`,
      type: "success",
    });
  };

  const handleMaintenanceSatisfactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا يتم إرسال بيانات رضا العملاء عن الصيانة إلى قاعدة البيانات
    addNotification({
      title: "تم حفظ البيانات",
      message: `تم حفظ بيانات رضا العملاء عن الصيانة بنجاح (${periodType})`,
      type: "success",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدخال البيانات</h1>
          <div className="flex gap-2">
            <Button
              variant={periodType === "weekly" ? "default" : "outline"}
              onClick={() => setPeriodType("weekly")}
              className="min-w-[120px]"
            >
              بيانات أسبوعية
            </Button>
            <Button
              variant={periodType === "yearly" ? "default" : "outline"}
              onClick={() => setPeriodType("yearly")}
              className="min-w-[120px]"
            >
              بيانات سنوية
            </Button>
          </div>
        </div>

        <Tabs defaultValue="nps" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nps">مقاييس NPS والجودة</TabsTrigger>
            <TabsTrigger value="customer-service">خدمة العملاء</TabsTrigger>
            <TabsTrigger value="maintenance">رضا العملاء عن الصيانة</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nps" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>مقاييس NPS والجودة ({periodType === "weekly" ? "أسبوعية" : "سنوية"})</CardTitle>
                <CardDescription>أدخل قيم مقاييس الأداء لهذه الفترة</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNPSSubmit} className="space-y-6">
                  <div className="form-grid">
                    <div className="space-y-2">
                      <Label htmlFor="newCustomersNPS">نسبة الترشيح للعملاء الجدد</Label>
                      <div className="flex items-center">
                        <Input
                          id="newCustomersNPS"
                          name="newCustomersNPS"
                          type="number"
                          value={npsData.newCustomersNPS}
                          onChange={handleNPSChange}
                          required
                        />
                        <span className="mx-2 text-muted-foreground">الهدف: 65%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="firstYearNPS">نسبة الترشيح بعد السنة الأولى</Label>
                      <div className="flex items-center">
                        <Input
                          id="firstYearNPS"
                          name="firstYearNPS"
                          type="number"
                          value={npsData.firstYearNPS}
                          onChange={handleNPSChange}
                          required
                        />
                        <span className="mx-2 text-muted-foreground">الهدف: 65%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="longTermNPS">نسبة الترشيح للعملاء القدامى</Label>
                      <div className="flex items-center">
                        <Input
                          id="longTermNPS"
                          name="longTermNPS"
                          type="number"
                          value={npsData.longTermNPS}
                          onChange={handleNPSChange}
                          required
                        />
                        <span className="mx-2 text-muted-foreground">الهدف: 30%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deliveryQuality">جودة التسليم</Label>
                      <div className="flex items-center">
                        <Input
                          id="deliveryQuality"
                          name="deliveryQuality"
                          type="number"
                          value={npsData.deliveryQuality}
                          onChange={handleNPSChange}
                          required
                        />
                        <span className="mx-2 text-muted-foreground">الهدف: 100%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maintenanceQuality">جودة الصيانة</Label>
                      <div className="flex items-center">
                        <Input
                          id="maintenanceQuality"
                          name="maintenanceQuality"
                          type="number"
                          value={npsData.maintenanceQuality}
                          onChange={handleNPSChange}
                          required
                        />
                        <span className="mx-2 text-muted-foreground">الهدف: 100%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="responseTime">عدد الثواني للرد</Label>
                      <div className="flex items-center">
                        <Input
                          id="responseTime"
                          name="responseTime"
                          type="number"
                          step="0.1"
                          value={npsData.responseTime}
                          onChange={handleNPSChange}
                          required
                        />
                        <span className="mx-2 text-muted-foreground">الهدف: 3 ثواني</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="callResponseRate">معدل الرد على المكالمات</Label>
                      <div className="flex items-center">
                        <Input
                          id="callResponseRate"
                          name="callResponseRate"
                          type="number"
                          value={npsData.callResponseRate}
                          onChange={handleNPSChange}
                          required
                        />
                        <span className="mx-2 text-muted-foreground">الهدف: 20%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customerSatisfaction">راحة العميل (CSAT)</Label>
                      <div className="flex items-center">
                        <Input
                          id="customerSatisfaction"
                          name="customerSatisfaction"
                          type="number"
                          value={npsData.customerSatisfaction}
                          onChange={handleNPSChange}
                          required
                        />
                        <span className="mx-2 text-muted-foreground">الهدف: 70%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="closingSpeed">سرعة إغلاق الطلبات (أيام)</Label>
                      <div className="flex items-center">
                        <Input
                          id="closingSpeed"
                          name="closingSpeed"
                          type="number"
                          step="0.1"
                          value={npsData.closingSpeed}
                          onChange={handleNPSChange}
                          required
                        />
                        <span className="mx-2 text-muted-foreground">الهدف: 3 أيام</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="salesContribution">نسبة المساهمة في المبيعات</Label>
                      <div className="flex items-center">
                        <Input
                          id="salesContribution"
                          name="salesContribution"
                          type="number"
                          value={npsData.salesContribution}
                          onChange={handleNPSChange}
                          required
                        />
                        <span className="mx-2 text-muted-foreground">الهدف: 5%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="conversionRate">معدل التحول</Label>
                      <div className="flex items-center">
                        <Input
                          id="conversionRate"
                          name="conversionRate"
                          type="number"
                          value={npsData.conversionRate}
                          onChange={handleNPSChange}
                          required
                        />
                        <span className="mx-2 text-muted-foreground">الهدف: 2%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="facilityManagement">جودة إدارة المرافق</Label>
                      <div className="flex items-center">
                        <Input
                          id="facilityManagement"
                          name="facilityManagement"
                          type="number"
                          value={npsData.facilityManagement}
                          onChange={handleNPSChange}
                          required
                        />
                        <span className="mx-2 text-muted-foreground">الهدف: 80%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reopenRequests">عدد إعادة فتح طلب</Label>
                      <div className="flex items-center">
                        <Input
                          id="reopenRequests"
                          name="reopenRequests"
                          type="number"
                          value={npsData.reopenRequests}
                          onChange={handleNPSChange}
                          required
                        />
                        <span className="mx-2 text-muted-foreground">الهدف: 0</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deliverySatisfaction">رضا التسليم</Label>
                      <div className="flex items-center">
                        <Input
                          id="deliverySatisfaction"
                          name="deliverySatisfaction"
                          type="number"
                          value={npsData.deliverySatisfaction}
                          onChange={handleNPSChange}
                          required
                        />
                        <span className="mx-2 text-muted-foreground">الهدف: 80%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recommendedCustomers">عدد العملاء المرشحين</Label>
                      <div className="flex items-center">
                        <Input
                          id="recommendedCustomers"
                          name="recommendedCustomers"
                          type="number"
                          value={npsData.recommendedCustomers}
                          onChange={handleNPSChange}
                          required
                        />
                        <span className="mx-2 text-muted-foreground">الهدف: 584</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">حفظ بيانات NPS والجودة</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customer-service" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>بيانات خدمة العملاء ({periodType === "weekly" ? "أسبوعية" : "سنوية"})</CardTitle>
                <CardDescription>أدخل بيانات خدمة العملاء لهذه الفترة</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCustomerServiceSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">فئة المكالمات</h3>
                    <div className="form-grid">
                      <div className="space-y-2">
                        <Label htmlFor="interestedCustomers">عملاء مهتمين</Label>
                        <Input
                          id="interestedCustomers"
                          name="interestedCustomers"
                          type="number"
                          value={customerServiceData.interestedCustomers}
                          onChange={handleCustomerServiceChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="futureProjectsInterested">مهتمين مشاريع قادمة</Label>
                        <Input
                          id="futureProjectsInterested"
                          name="futureProjectsInterested"
                          type="number"
                          value={customerServiceData.futureProjectsInterested}
                          onChange={handleCustomerServiceChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="officeInterested">مهتمين مكاتب</Label>
                        <Input
                          id="officeInterested"
                          name="officeInterested"
                          type="number"
                          value={customerServiceData.officeInterested}
                          onChange={handleCustomerServiceChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="inquiries">استفسارات</Label>
                        <Input
                          id="inquiries"
                          name="inquiries"
                          type="number"
                          value={customerServiceData.inquiries}
                          onChange={handleCustomerServiceChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maintenanceRequests">طلبات صيانة</Label>
                        <Input
                          id="maintenanceRequests"
                          name="maintenanceRequests"
                          type="number"
                          value={customerServiceData.maintenanceRequests}
                          onChange={handleCustomerServiceChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contactRequests">طلبات تواصل</Label>
                        <Input
                          id="contactRequests"
                          name="contactRequests"
                          type="number"
                          value={customerServiceData.contactRequests}
                          onChange={handleCustomerServiceChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="complaints">شكاوى</Label>
                        <Input
                          id="complaints"
                          name="complaints"
                          type="number"
                          value={customerServiceData.complaints}
                          onChange={handleCustomerServiceChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="totalCalls">إجمالي المكالمات</Label>
                        <Input
                          id="totalCalls"
                          name="totalCalls"
                          type="number"
                          value={customerServiceData.totalCalls}
                          onChange={handleCustomerServiceChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">فئة الاستفسارات</h3>
                    <div className="form-grid">
                      <div className="space-y-2">
                        <Label htmlFor="soldProjects">مشاريع مباعة</Label>
                        <Input
                          id="soldProjects"
                          name="soldProjects"
                          type="number"
                          value={inquiryData.soldProjects}
                          onChange={handleInquiryChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="apartmentRentals">إيجارات شقق</Label>
                        <Input
                          id="apartmentRentals"
                          name="apartmentRentals"
                          type="number"
                          value={inquiryData.apartmentRentals}
                          onChange={handleInquiryChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="deedInquiries">استفسارات الصكوك</Label>
                        <Input
                          id="deedInquiries"
                          name="deedInquiries"
                          type="number"
                          value={inquiryData.deedInquiries}
                          onChange={handleInquiryChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="documentRequests">طلب أوراق</Label>
                        <Input
                          id="documentRequests"
                          name="documentRequests"
                          type="number"
                          value={inquiryData.documentRequests}
                          onChange={handleInquiryChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="generalInquiries">استفسارات عامة</Label>
                        <Input
                          id="generalInquiries"
                          name="generalInquiries"
                          type="number"
                          value={inquiryData.generalInquiries}
                          onChange={handleInquiryChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">فئة طلبات الصيانة</h3>
                    <div className="form-grid">
                      <div className="space-y-2">
                        <Label htmlFor="cancelled">تم الإلغاء</Label>
                        <Input
                          id="cancelled"
                          name="cancelled"
                          type="number"
                          value={maintenanceRequestsData.cancelled}
                          onChange={handleMaintenanceRequestsChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="resolved">تم الحل</Label>
                        <Input
                          id="resolved"
                          name="resolved"
                          type="number"
                          value={maintenanceRequestsData.resolved}
                          onChange={handleMaintenanceRequestsChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="inProgress">قيد المعالجة</Label>
                        <Input
                          id="inProgress"
                          name="inProgress"
                          type="number"
                          value={maintenanceRequestsData.inProgress}
                          onChange={handleMaintenanceRequestsChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">حفظ بيانات خدمة العملاء</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>رضا العملاء عن الصيانة ({periodType === "weekly" ? "أسبوعية" : "سنوية"})</CardTitle>
                <CardDescription>سجل مستوى رضا العملاء عن خدمات الصيانة</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMaintenanceSatisfactionSubmit} className="space-y-6">
                  <div className="form-grid">
                    <div className="space-y-2">
                      <Label htmlFor="servicesSatisfaction">الرضا عن الخدمات</Label>
                      <Select
                        value={maintenanceSatisfactionData.servicesSatisfaction}
                        onValueChange={(value) => handleMaintenanceSatisfactionChange("servicesSatisfaction", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مستوى الرضا" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="very_satisfied">راضي جداً</SelectItem>
                          <SelectItem value="satisfied">راضي</SelectItem>
                          <SelectItem value="neutral">محايد</SelectItem>
                          <SelectItem value="dissatisfied">غير راضي</SelectItem>
                          <SelectItem value="very_dissatisfied">غير راضي جداً</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="closingTimeSatisfaction">الرضا عن مدة الإغلاق</Label>
                      <Select
                        value={maintenanceSatisfactionData.closingTimeSatisfaction}
                        onValueChange={(value) => handleMaintenanceSatisfactionChange("closingTimeSatisfaction", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مستوى الرضا" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="very_satisfied">راضي جداً</SelectItem>
                          <SelectItem value="satisfied">راضي</SelectItem>
                          <SelectItem value="neutral">محايد</SelectItem>
                          <SelectItem value="dissatisfied">غير راضي</SelectItem>
                          <SelectItem value="very_dissatisfied">غير راضي جداً</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="firstTimeResolution">هل تم الحل من أول مرة</Label>
                      <Select
                        value={maintenanceSatisfactionData.firstTimeResolution}
                        onValueChange={(value) => handleMaintenanceSatisfactionChange("firstTimeResolution", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الإجابة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">نعم</SelectItem>
                          <SelectItem value="no">لا</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="feedback">أبرز الملاحظات</Label>
                    <Textarea
                      id="feedback"
                      placeholder="أدخل أهم الملاحظات حول رضا العملاء عن الصيانة"
                      value={maintenanceSatisfactionData.feedback}
                      onChange={handleFeedbackChange}
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">حفظ بيانات رضا العملاء عن الصيانة</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
