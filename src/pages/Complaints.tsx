
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, Plus, Search } from "lucide-react";

// بيانات تجريبية للشكاوى
const complaintsDummyData = [
  {
    id: "1001",
    date: "2025-04-15",
    customerName: "أحمد محمد",
    project: "برج الشمس",
    unitNumber: "A-203",
    source: "مكالمة هاتفية",
    status: "تم الحل",
    description: "مشكلة في تسرب المياه من السقف",
    action: "تم إصلاح التسرب وإعادة دهان السقف",
    duration: 2,
    createdBy: "موظف خدمة العملاء"
  },
  {
    id: "1002",
    date: "2025-04-14",
    customerName: "سارة عبدالله",
    project: "واحة الزهور",
    unitNumber: "B-105",
    source: "البريد الإلكتروني",
    status: "قيد المعالجة",
    description: "تعطل في نظام التكييف المركزي",
    action: "تم جدولة زيارة فني التكييف",
    duration: 1,
    createdBy: "مدير النظام"
  },
  {
    id: "1003",
    date: "2025-04-13",
    customerName: "خالد سعيد",
    project: "جنائن الروضة",
    unitNumber: "C-310",
    source: "زيارة شخصية",
    status: "معلقة",
    description: "مشكلة في بوابة الجراج لا تفتح بالريموت",
    action: "بانتظار وصول قطع الغيار",
    duration: 3,
    createdBy: "موظف خدمة العملاء"
  }
];

// حالات الشكاوى
const complaintStatuses = [
  { value: "new", label: "جديدة" },
  { value: "in_progress", label: "قيد المعالجة" },
  { value: "pending", label: "معلقة" },
  { value: "resolved", label: "تم الحل" },
  { value: "closed", label: "مغلقة" }
];

// مصادر الشكاوى
const complaintSources = [
  { value: "phone", label: "مكالمة هاتفية" },
  { value: "email", label: "البريد الإلكتروني" },
  { value: "visit", label: "زيارة شخصية" },
  { value: "social_media", label: "وسائل التواصل الاجتماعي" },
  { value: "website", label: "الموقع الإلكتروني" }
];

// أسماء المشاريع
const projects = [
  { value: "tower", label: "برج الشمس" },
  { value: "oasis", label: "واحة الزهور" },
  { value: "gardens", label: "جنائن الروضة" },
  { value: "residences", label: "إقامات الفخامة" }
];

interface Complaint {
  id: string;
  date: string;
  customerName: string;
  project: string;
  unitNumber: string;
  source: string;
  status: string;
  description: string;
  action: string;
  duration: number;
  createdBy: string;
}

export default function Complaints() {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [complaints, setComplaints] = useState<Complaint[]>(complaintsDummyData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // بيانات الشكوى الجديدة
  const [newComplaint, setNewComplaint] = useState<Omit<Complaint, "id" | "createdBy" | "duration">>({
    date: new Date().toISOString().split("T")[0],
    customerName: "",
    project: "",
    unitNumber: "",
    source: "",
    status: "new",
    description: "",
    action: ""
  });

  // تصفية الشكاوى
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = 
      complaint.customerName.includes(searchTerm) || 
      complaint.project.includes(searchTerm) || 
      complaint.description.includes(searchTerm) ||
      complaint.id.includes(searchTerm);
    
    const matchesStatus = selectedStatus === "all" || complaint.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // معالجة تغيير بيانات الشكوى الجديدة
  const handleNewComplaintChange = (field: string, value: string) => {
    setNewComplaint((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // إضافة شكوى جديدة
  const handleAddComplaint = () => {
    // توليد رقم تذكرة جديد
    const newId = (1000 + complaints.length + 1).toString();
    
    const complaint: Complaint = {
      ...newComplaint,
      id: newId,
      createdBy: user?.username || "مستخدم النظام",
      duration: 0
    };
    
    setComplaints((prev) => [complaint, ...prev]);
    
    addNotification({
      title: "تمت الإضافة",
      message: `تم إضافة الشكوى رقم ${newId} بنجاح`,
      type: "success"
    });
    
    setIsAddDialogOpen(false);
    
    // إعادة تعيين نموذج الشكوى الجديدة
    setNewComplaint({
      date: new Date().toISOString().split("T")[0],
      customerName: "",
      project: "",
      unitNumber: "",
      source: "",
      status: "new",
      description: "",
      action: ""
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">سجل الشكاوى</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="ml-2 h-4 w-4" />
                إضافة شكوى جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>إضافة شكوى جديدة</DialogTitle>
                <DialogDescription>
                  أدخل بيانات الشكوى لإضافتها إلى السجل وتعيين رقم تذكرة جديد
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="date">التاريخ</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newComplaint.date}
                    onChange={(e) => handleNewComplaintChange("date", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customerName">اسم العميل</Label>
                  <Input
                    id="customerName"
                    value={newComplaint.customerName}
                    onChange={(e) => handleNewComplaintChange("customerName", e.target.value)}
                    placeholder="أدخل اسم العميل"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project">المشروع</Label>
                  <Select
                    value={newComplaint.project}
                    onValueChange={(value) => handleNewComplaintChange("project", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المشروع" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.value} value={project.label}>
                          {project.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unitNumber">رقم الوحدة / العمارة</Label>
                  <Input
                    id="unitNumber"
                    value={newComplaint.unitNumber}
                    onChange={(e) => handleNewComplaintChange("unitNumber", e.target.value)}
                    placeholder="أدخل رقم الوحدة"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="source">مصدر الشكوى</Label>
                  <Select
                    value={newComplaint.source}
                    onValueChange={(value) => handleNewComplaintChange("source", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر مصدر الشكوى" />
                    </SelectTrigger>
                    <SelectContent>
                      {complaintSources.map((source) => (
                        <SelectItem key={source.value} value={source.label}>
                          {source.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select
                    value={newComplaint.status}
                    onValueChange={(value) => handleNewComplaintChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر حالة الشكوى" />
                    </SelectTrigger>
                    <SelectContent>
                      {complaintStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.label}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">تفاصيل الشكوى</Label>
                  <Textarea
                    id="description"
                    value={newComplaint.description}
                    onChange={(e) => handleNewComplaintChange("description", e.target.value)}
                    placeholder="أدخل تفاصيل الشكوى"
                    required
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="action">الإجراء المتخذ</Label>
                  <Textarea
                    id="action"
                    value={newComplaint.action}
                    onChange={(e) => handleNewComplaintChange("action", e.target.value)}
                    placeholder="أدخل الإجراء المتخذ (إن وجد)"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="button" onClick={handleAddComplaint}>
                  إضافة الشكوى
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>سجل الشكاوى والطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث عن عميل، مشروع، أو شكوى..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="جميع الحالات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    {complaintStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.label}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم التذكرة</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">اسم العميل</TableHead>
                    <TableHead className="text-right">المشروع</TableHead>
                    <TableHead className="text-right">المدة (أيام)</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        لا توجد شكاوى متطابقة مع معايير البحث
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredComplaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-medium">{complaint.id}</TableCell>
                        <TableCell>{complaint.date}</TableCell>
                        <TableCell>{complaint.customerName}</TableCell>
                        <TableCell>{complaint.project}</TableCell>
                        <TableCell>{complaint.duration} يوم</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            complaint.status === "تم الحل" || complaint.status === "مغلقة"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : complaint.status === "قيد المعالجة"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                              : complaint.status === "معلقة"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}>
                            {complaint.status}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            عرض التفاصيل
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
