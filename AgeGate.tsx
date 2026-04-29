import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // أو استخدام t من السياق الخاص بك

const AgeGate = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // التحقق مما إذا كان المستخدم قد وافق سابقاً
    const isAdult = localStorage.getItem("over-18");
    if (!isAdult) {
      setShow(true);
      // منع التمرير في الخلفية عند ظهور الرسالة
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const accept18 = () => {
    localStorage.setItem("over-18", "true");
    setShow(false);
    // إعادة تفعيل التمرير
    document.body.style.overflow = 'auto';
  };

  const decline = () => {
    // توجيه المستخدم لموقع آخر (مثل جوجل) إذا كان قاصراً
    window.location.href = "https://www.google.com";
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="p-8 text-center rounded-2xl border-2 border-gold/50 bg-[#121212] text-gold w-[350px] shadow-[0_0_50px_rgba(255,215,0,0.2)] space-y-6 transform transition-all animate-in fade-in zoom-in duration-300">
        
        {/* أيقونة تحذيرية فخمة */}
        <div className="w-20 h-20 border-4 border-gold rounded-full flex items-center justify-center mx-auto mb-2">
          <span className="text-3xl font-black italic">18+</span>
        </div>

        <h1 className="text-2xl font-bold tracking-wider text-white">تأكيد العمر</h1>
        
        <p className="text-gray-300 leading-relaxed">
          هذا الموقع يحتوي على منتجات مخصصة للبالغين فقط.<br />
          <span className="text-sm text-gold/80">يجب أن يكون عمرك 18 عاماً أو أكثر للدخول.</span>
        </p>

        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={accept18}
            className="w-full bg-gold hover:bg-gold-dim text-black py-3 rounded-lg font-bold text-lg transition-transform active:scale-95 shadow-lg"
          >
            نعم، طابقت الشروط
          </button>
          
          <button
            onClick={decline}
            className="w-full bg-transparent border border-gray-600 text-gray-400 py-2 rounded-lg font-medium text-sm hover:bg-red-900/20 hover:text-red-500 transition-colors"
          >
            خروج (أنا تحت السن)
          </button>
        </div>

        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
          Al-Fakhama Store © 2026
        </p>
      </div>
    </div>
  );
};

export default AgeGate;
