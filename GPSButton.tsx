import React, { useState } from "react";
import { MapPin, CheckCircle2, Loader2 } from "lucide-react";

interface GPSButtonProps {
  onLocationSelect?: (lat: number, lng: number) => void;
}

const GPSButton = ({ onLocationSelect }: GPSButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [captured, setCaptured] = useState(false);

  function getLocation() {
    setLoading(true);
    if (!navigator.geolocation) {
      alert("متصفحك لا يدعم خاصية تحديد الموقع");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        
        // الرابط الصحيح لخرائط جوجل
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        // إرسال الإحداثيات للمكون الأب (مثل السلة أو قاعدة البيانات)
        if (onLocationSelect) {
          onLocationSelect(latitude, longitude);
        }

        setCaptured(true);
        setLoading(false);
        
        // تنبيه العميل بنجاح العملية
        console.log("Captured Location:", googleMapsUrl);
      },
      (error) => {
        console.error(error);
        alert("فشل تحديد الموقع، يرجى تفعيل الـ GPS في جهازك");
        setLoading(false);
      },
      { enableHighAccuracy: true } // لضمان دقة عالية تصل لـ 5 أمتار
    );
  }

  return (
    <button
      type="button"
      onClick={getLocation}
      disabled={loading || captured}
      className={`flex items-center justify-center w-full px-4 py-3 rounded-xl gap-2 font-bold transition-all
        ${captured 
          ? "bg-green-600/20 text-green-500 border border-green-500" 
          : "bg-gold text-black hover:bg-gold-dim shadow-lg active:scale-95"
        } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : captured ? (
        <CheckCircle2 size={18} />
      ) : (
        <MapPin size={18} />
      )}
      
      {loading ? "جاري تحديد موقعك..." : captured ? "تم تحديد موقع التوصيل" : "إرسال موقع التوصيل (GPS)"}
    </button>
  );
};

export default GPSButton;
