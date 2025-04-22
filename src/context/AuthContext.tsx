
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: UserProfile | null;
  users: UserProfile[];
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addUser: (userData: Omit<UserProfile, "id">) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  resetUserPassword: (id: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setUser({
            id: session.user.id,
            username: profile.username || '',
            role: profile.role || 'user'
          });
        }
      } else {
        setUser(null);
      }
    });

    // Initial session check
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setUser({
            id: session.user.id,
            username: profile.username || '',
            role: profile.role || 'user'
          });
        }
      }
    };

    checkUser();
    loadUsers();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      
      const usersList = data.map(userData => ({
        id: userData.id.toString(),
        username: userData.username || '',
        role: userData.role || 'user'
      }));
      
      setUsers(usersList);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // First try to find the user by username
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
        
      if (userData && userData.password === password) {
        setUser({
          id: userData.id.toString(),
          username: userData.username || '',
          role: userData.role || 'user'
        });
        return true;
      }
      
      // If not found or password doesn't match, try local storage as fallback
      const localUsers = JSON.parse(localStorage.getItem('auth_users') || '[]');
      const localUser = localUsers.find((u: any) => 
        u.username === username && u.password === password
      );
      
      if (localUser) {
        setUser({
          id: localUser.id,
          username: localUser.username,
          role: localUser.role
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addUser = async (userData: Omit<UserProfile, "id">) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select();
        
      if (error) throw error;
      await loadUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const resetUserPassword = async (id: string, newPassword: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('id', id);
        
      if (error) throw error;
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
