import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addUser: (userData: Omit<User, "id">) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  resetUserPassword: (id: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({
            id: firebaseUser.uid,
            ...userDoc.data() as Omit<User, 'id'>
          });
        }
      } else {
        setUser(null);
      }
    });

    loadUsers();

    return () => unsubscribe();
  }, []);

  const loadUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const usersList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User));
    setUsers(usersList);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!auth || !db) {
        throw new Error('Firebase services not initialized');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

      if (userDoc.exists()) {
        setUser({
          id: userCredential.user.uid,
          ...userDoc.data() as Omit<User, 'id'>
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        throw new Error(`Authentication failed: ${error.message}`);
      }
      throw new Error('Authentication failed');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addUser = async (userData: Omit<User, "id">) => {
    try {
      const userRef = doc(collection(db, 'users'));
      await setDoc(userRef, userData);
      await loadUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const resetUserPassword = async (id: string, newPassword: string) => {
    try {
      await updateDoc(doc(db, 'users', id), {
        password: newPassword
      });
      await loadUsers();
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
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