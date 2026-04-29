import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { LocalizationProvider } from "./contexts/LocalizationContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "react-hot-toast"; // إضافة مكتبة الإشعارات
import AgeGate from "./components/AgeGate";
import MainRoutes from "./routes/MainRoutes";
import "./styles/tailwind.css";

function App() {
  useEffect(() => {
    // تفعيل الوضع الليلي
    document.body.classList.add("dark");
    // إجبار المتصفح على الاتجاه العربي واللغة العربية
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  }, []);

  return (
    <LocalizationProvider>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <div className="font-arabic bg-luxury-dark min-h-screen text-gold">
              <AgeGate />
              {/* مكون الإشعارات ليظهر رسائل النجاح أو الخطأ للعميل */}
              <Toaster position="top-center" toastOptions={{ className: 'font-arabic' }} />
              <RouterProvider router={MainRoutes} />
            </div>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
