import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";

// تعريف شكل البيانات لتسهيل العمل (TypeScript)
interface UserProfile {
  id: string;
  role: 'admin' | 'customer' | 'courier';
  credit_limit: number;
  balance: number;
  full_name: string;
}

export const AuthContext = createContext<{
  user: any;
  profile: UserProfile | null;
  loading: boolean;
}>({ user: null, profile: null, loading: true });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // دالة لجلب بيانات العميل من جدول الـ profiles (الآجل، الرتبة، إلخ)
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    // 1. جلب المستخدم الحالي عند فتح الموقع
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    // 2. مراقبة أي تغيير في حالة تسجيل الدخول (دخول/خروج)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
