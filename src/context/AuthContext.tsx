import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface User {
  id: string;
  username: string;
  role: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<User, "id">) => Promise<void>;
  deleteUser: (id: string) => void;
  resetUserPassword: (id: string, newPassword: string) => void;
}

const AUTH_STORAGE_KEY = 'auth_user';
const USERS_STORAGE_KEY = 'auth_users';

// المستخدمين الافتراضيين إذا لم يكن هناك مستخدمين محفوظين
const DEFAULT_USERS: User[] = [
  { id: '1', username: 'admin', role: 'مدير النظام', password: 'admin' },
  { id: '2', username: 'موظف خدمة العملاء', role: 'موظف خدمة العملاء', password: 'staff123' }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // استرجاع المستخدمين والمستخدم الحالي من localStorage عند بدء التطبيق
  useEffect(() => {
    // استرجاع المستخدم الحالي
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('خطأ في استرجاع بيانات المستخدم:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }

    // استرجاع قائمة المستخدمين
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        console.log('استرجاع المستخدمين من التخزين المحلي:', parsedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error('خطأ في استرجاع قائمة المستخدمين:', error);
        // إذا حدث خطأ، استخدم المستخدمين الافتراضيين
        setUsers(DEFAULT_USERS);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      }
    } else {
      // إذا لم يكن هناك مستخدمين محفوظين، استخدم المستخدمين الافتراضيين
      console.log('لا يوجد مستخدمين محفوظين، استخدام المستخدمين الافتراضيين');
      setUsers(DEFAULT_USERS);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log('محاولة تسجيل الدخول باستخدام:', username, password);
    console.log('المستخدمون المتاحون:', users);

    // البحث عن المستخدم في قائمة المستخدمين المتاحة
    const foundUser = users.find(u => u.username === username && u.password === password);

    if (foundUser) {
      console.log('تم العثور على المستخدم، تسجيل الدخول:', foundUser);
      // إنشاء نسخة جديدة من المستخدم بدون كلمة المرور للأمان
      const userWithoutPassword = { ...foundUser };
      delete userWithoutPassword.password;

      setUser(userWithoutPassword);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return true;
    }
    console.log('المستخدم غير موجود أو كلمة المرور غير صحيحة');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // إضافة مستخدم جديد
  const addUser = async (userData: Omit<User, "id">) => {
    const newUser = await prisma.user.create({
      data: userData
    });
    setUsers(prev => [...prev, newUser]);
  };

  // حذف مستخدم
  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  };

  // إعادة تعيين كلمة مرور المستخدم
  const resetUserPassword = (id: string, newPassword: string) => {
    const updatedUsers = users.map(user => 
      user.id === id ? { ...user, password: newPassword } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, 
      isAuthenticated: !!user, 
      login, 
      logout,
      addUser,
      deleteUser,
      resetUserPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}