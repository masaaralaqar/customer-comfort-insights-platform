
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import { useNotification } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Trash2, UserPlus } from "lucide-react";

export default function Settings() {
  const { addNotification } = useNotification();
  const { users, addUser, deleteUser, resetUserPassword } = useAuth();
  
  // بيانات المستخدم الجديد
  const [newUser, setNewUser] = useState<{
    username: string;
    role: string;
    password: string;
  }>({
    username: "",
    role: "",
    password: ""
  });

  // معالجة تغيير بيانات المستخدم الجديد
  const handleNewUserChange = (field: string, value: string) => {
    setNewUser((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // إضافة مستخدم جديد
  const handleAddUser = () => {
    if (!newUser.username || !newUser.role || !newUser.password) {
      addNotification({
        title: "تنبيه",
        message: "يرجى تعبئة جميع الحقول المطلوبة",
        type: "warning"
      });
      return;
    }
    
    // التحقق من عدم وجود مستخدم باسم المستخدم نفسه
    if (users.some(user => user.username === newUser.username)) {
      addNotification({
        title: "خطأ",
        message: "اسم المستخدم موجود بالفعل، يرجى اختيار اسم آخر",
        type: "error"
      });
      return;
    }
    
    addUser(newUser);
    
    addNotification({
      title: "تمت الإضافة",
      message: `تم إضافة المستخدم ${newUser.username} بنجاح`,
      type: "success"
    });
    
    console.log("تمت إضافة مستخدم جديد:", newUser.username);
    
    // التحقق من أن المستخدم قد تمت إضافته بنجاح
    const savedUsers = localStorage.getItem('auth_users');
    if (savedUsers) {
      console.log('المستخدمون المحفوظون في localStorage بعد الإضافة:', JSON.parse(savedUsers));
    }
    
    // إعادة تعيين نموذج المستخدم الجديد
    setNewUser({
      username: "",
      role: "",
      password: ""
    });
  };

  // حذف مستخدم
  const handleDeleteUser = (id: string) => {
    const userToDelete = users.find(user => user.id === id);
    if (!userToDelete) return;
    
    deleteUser(id);
    
    addNotification({
      title: "تم الحذف",
      message: `تم حذف المستخدم ${userToDelete.username} بنجاح`,
      type: "success"
    });
  };

  // تعديل كلمة مرور المستخدم
  const handleResetPassword = (id: string) => {
    const userToReset = users.find(user => user.id === id);
    if (!userToReset) return;
    
    // إنشاء كلمة مرور جديدة للمستخدم
    const newPassword = prompt("أدخل كلمة المرور الجديدة:", "");
    
    if (newPassword) {
      resetUserPassword(id, newPassword);
      
      addNotification({
        title: "تم التحديث",
        message: `تم إعادة تعيين كلمة مرور المستخدم ${userToReset.username} بنجاح`,
        type: "success"
      });
    }
  };

  // طباعة حالة المستخدمين في كل مرة يتغير فيها المستخدمون
  useEffect(() => {
    console.log('قائمة المستخدمين الحالية في الإعدادات:', users);
  }, [users]);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">إعدادات النظام</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>إدارة المستخدمين</CardTitle>
            <CardDescription>إضافة وتعديل وحذف مستخدمي النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">المستخدمون الحاليون</h3>
            
            <div className="rounded-md border mb-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم المستخدم</TableHead>
                    <TableHead className="text-right">الصلاحية</TableHead>
                    <TableHead className="text-right">رمز الدخول</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>••••••••</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleResetPassword(user.id)}
                            title="تعديل كلمة المرور"
                          >
                            <Edit2 className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                            title="حذف المستخدم"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">إضافة مستخدم جديد</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <Input
                    id="username"
                    placeholder="أدخل اسم المستخدم"
                    value={newUser.username}
                    onChange={(e) => handleNewUserChange("username", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">الصلاحية</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => handleNewUserChange("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الصلاحية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="مدير النظام">مدير النظام</SelectItem>
                      <SelectItem value="موظف خدمة العملاء">موظف خدمة العملاء</SelectItem>
                      <SelectItem value="مدخل بيانات فقط">مدخل بيانات فقط</SelectItem>
                      <SelectItem value="مشاهد فقط">مشاهد فقط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">رمز الدخول</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="أدخل رمز الدخول"
                    value={newUser.password}
                    onChange={(e) => handleNewUserChange("password", e.target.value)}
                  />
                </div>
              </div>
              
              <Button
                onClick={handleAddUser}
                className="flex items-center"
              >
                <UserPlus className="ml-2 h-4 w-4" />
                إضافة المستخدم
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
