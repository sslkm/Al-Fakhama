import React, { createContext, useState, useEffect } from "react";
import ar from "../i18n/ar.json";
import en from "../i18n/en.json";

export const LocalizationContext = createContext<any>(null);

export const LocalizationProvider = ({ children }) => {
  // جلب اللغة المخزنة سابقاً أو اعتماد العربية كافتراضية
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ar");

  // دالة ذكية لجلب النصوص حتى لو كانت داخل مجموعات (Nested Keys)
  const t = (path: string) => {
    const keys = path.split('.');
    const translations = lang === "ar" ? ar : en;
    
    let result: any = translations;
    for (const key of keys) {
      result = result ? result[key] : null;
    }
    
    return result || path; // إذا لم يجد الترجمة، يطبع المسار نفسه
  };

  // تأثير جانبي لتغيير اتجاه الموقع وحفظ اللغة عند تغييرها
  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <LocalizationContext.Provider value={{ lang, setLang, t }}>
      <div dir={lang === "ar" ? "rtl" : "ltr"}>
        {children}
      </div>
    </LocalizationContext.Provider>
  );
};
