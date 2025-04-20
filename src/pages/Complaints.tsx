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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Filter, Plus, Trash2, Edit, Eye } from "lucide-react";

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
    createdBy: "موظف خدمة العملاء",
    createdAt: "2025-04-15T10:30:00",
    updatedBy: null,
    updatedAt: null
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
    createdBy: "مدير النظام",
    createdAt: "2025-04-14T14:20:00", // Added missing required field
    updatedBy: null,
    updatedAt: null
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
    createdBy: "موظف خدمة العملاء",
    createdAt: "2025-04-13T09:15:00", // Added missing required field
    updatedBy: null,
    updatedAt: null
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
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string | null;
}

export default function Complaints() {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [complaints, setComplaints] = useState<Complaint[]>(complaintsDummyData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const [newComplaint, setNewComplaint] = useState<Omit<Complaint, "id" | "createdBy" | "duration" | "createdAt" | "updatedBy" | "updatedAt">>({
    date: new Date().toISOString().split("T")[0],
    customerName: "",
    project: "",
    unitNumber: "",
    source: "",
    status: "جديدة",
    description: "",
    action: ""
  });

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = 
      complaint.customerName.includes(searchTerm) || 
      complaint.project.includes(searchTerm) || 
      complaint.description.includes(searchTerm) ||
      complaint.id.includes(searchTerm);

    const matchesStatus = selectedStatus === "all" || complaint.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleNewComplaintChange = (field: string, value: string) => {
    setNewComplaint((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsViewDialogOpen(true);
  };

  const handleEditSetup = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setNewComplaint({
      date: complaint.date,
      customerName: complaint.customerName,
      project: complaint.project,
      unitNumber: complaint.unitNumber,
      source: complaint.source,
      status: complaint.status,
      description: complaint.description,
      action: complaint.action
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteSetup = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDeleteDialogOpen(true);
  };

  const handleAddComplaint = () => {
    const newId = (1000 + complaints.length + 1).toString();
    const now = new Date().toISOString();

    const complaint: Complaint = {
      ...newComplaint,
      id: newId,
      createdBy: user?.username || "مستخدم النظام",
      duration: 0,
      createdAt: now,
      updatedBy: null,
      updatedAt: null
    };

    setComplaints((prev) => [complaint, ...prev]);

    addNotification({
      title: "تمت الإضافة",
      message: `تم إضافة الشكوى رقم ${newId} بنجاح`,
      type: "success"
    });

    setIsAddDialogOpen(false);

    setNewComplaint({
      date: new Date().toISOString().split("T")[0],
      customerName: "",
      project: "",
      unitNumber: "",
      source: "",
      status: "جديدة",
      description: "",
      action: ""
    });
  };

  const handleUpdateComplaint = () => {
    if (!selectedComplaint) return;

    const now = new Date().toISOString();

    const updatedComplaints = complaints.map(complaint => {
      if (complaint.id === selectedComplaint.id) {
        return {
          ...complaint,
          ...newComplaint,
          updatedBy: user?.username || "مستخدم النظام",
          updatedAt: now
        };
      }
      return complaint;
    });

    setComplaints(updatedComplaints);
    setIsEditDialogOpen(false);

    addNotification({
      title: "تم التحديث",
      message: `تم تحديث الشكوى رقم ${selectedComplaint.id} بنجاح`,
      type: "success"
    });
  };

  const handleDeleteComplaint = () => {
    if (!selectedComplaint) return;

    const filteredComplaints = complaints.filter(
      complaint => complaint.id !== selectedComplaint.id
    );

    setComplaints(filteredComplaints);
    setIsDeleteDialogOpen(false);

    addNotification({
      title: "تم الحذف",
      message: `تم حذف الشكوى رقم ${selectedComplaint.id} بنجاح`,
      type: "success"
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
                  <Input
                    id="project"
                    value={newComplaint.project}
                    onChange={(e) => handleNewComplaintChange("project", e.target.value)}
                    placeholder="أدخل اسم المشروع"
                    required
                  />
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
                <Filter className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
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
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewComplaint(complaint)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditSetup(complaint)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteSetup(complaint)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
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

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle>تفاصيل الشكوى رقم {selectedComplaint.id}</DialogTitle>
                <DialogDescription>
                  تاريخ التسجيل: {formatDate(selectedComplaint.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">اسم العميل</h4>
                  <p className="p-2 bg-muted rounded-md">{selectedComplaint.customerName}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">المشروع</h4>
                  <p className="p-2 bg-muted rounded-md">{selectedComplaint.project}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">رقم الوحدة</h4>
                  <p className="p-2 bg-muted rounded-md">{selectedComplaint.unitNumber}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">مصدر الشكوى</h4>
                  <p className="p-2 bg-muted rounded-md">{selectedComplaint.source}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">الحالة</h4>
                  <div className={`p-2 rounded-md ${
                    selectedComplaint.status === "تم الحل" || selectedComplaint.status === "مغلقة"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : selectedComplaint.status === "قيد المعالجة"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                      : selectedComplaint.status === "معلقة"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}>
                    {selectedComplaint.status}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">المدة</h4>
                  <p className="p-2 bg-muted rounded-md">{selectedComplaint.duration} يوم</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <h4 className="font-medium text-sm">تفاصيل الشكوى</h4>
                  <p className="p-2 bg-muted rounded-md min-h-[80px]">{selectedComplaint.description}</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <h4 className="font-medium text-sm">الإجراء المتخذ</h4>
                  <p className="p-2 bg-muted rounded-md min-h-[80px]">{selectedComplaint.action}</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <h4 className="font-medium text-sm">معلومات الإنشاء والتحديث</h4>
                  <div className="p-3 bg-muted rounded-md space-y-2">
                    <p>تم الإنشاء بواسطة: <span className="font-medium">{selectedComplaint.createdBy}</span></p>
                    {selectedComplaint.updatedBy && (
                      <p>تم التحديث بواسطة: <span className="font-medium">{selectedComplaint.updatedBy}</span> بتاريخ {formatDate(selectedComplaint.updatedAt as string)}</p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>إغلاق</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>تعديل الشكوى رقم {selectedComplaint?.id}</DialogTitle>
            <DialogDescription>
              قم بتعديل بيانات الشكوى
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">التاريخ</Label>
              <Input
                id="edit-date"
                type="date"
                value={newComplaint.date}
                onChange={(e) => handleNewComplaintChange("date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-customerName">اسم العميل</Label>
              <Input
                id="edit-customerName"
                value={newComplaint.customerName}
                onChange={(e) => handleNewComplaintChange("customerName", e.target.value)}
                placeholder="أدخل اسم العميل"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-project">المشروع</Label>
              <Input
                id="edit-project"
                value={newComplaint.project}
                onChange={(e) => handleNewComplaintChange("project", e.target.value)}
                placeholder="أدخل اسم المشروع"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-unitNumber">رقم الوحدة / العمارة</Label>
              <Input
                id="edit-unitNumber"
                value={newComplaint.unitNumber}
                onChange={(e) => handleNewComplaintChange("unitNumber", e.target.value)}
                placeholder="أدخل رقم الوحدة"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-source">مصدر الشكوى</Label>
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
              <Label htmlFor="edit-status">الحالة</Label>
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
              <Label htmlFor="edit-description">تفاصيل الشكوى</Label>
              <Textarea
                id="edit-description"
                value={newComplaint.description}
                onChange={(e) => handleNewComplaintChange("description", e.target.value)}
                placeholder="أدخل تفاصيل الشكوى"
                required
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-action">الإجراء المتخذ</Label>
              <Textarea
                id="edit-action"
                value={newComplaint.action}
                onChange={(e) => handleNewComplaintChange("action", e.target.value)}
                placeholder="أدخل الإجراء المتخذ (إن وجد)"
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button type="button" onClick={handleUpdateComplaint}>
              حفظ التعديلات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه الشكوى؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الشكوى رقم {selectedComplaint?.id} نهائيًا. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteComplaint} className="bg-red-500 hover:bg-red-600">
              نعم، حذف الشكوى
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}