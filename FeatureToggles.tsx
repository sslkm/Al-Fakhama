import React from "react";
import { 
  Star, Heart, Ticket, CreditCard, Languages, Coins, 
  LayoutGrid, Layers, Wallet, Bell, Truck, Image, 
  Zap, Share2, Award, Smartphone, Check, X 
} from "lucide-react";

// مصفوفة الميزات مع الأيقونات الخاصة بها لسهولة التعرف البصري
const features = [
  { id: "reviews", label: "التقييمات", icon: <Star size={18} /> },
  { id: "wishlist", label: "المفضلة", icon: <Heart size={18} /> },
  { id: "coupons", label: "كوبونات الخصم", icon: <Ticket size={18} /> },
  { id: "credit", label: "حساب الآجل", icon: <CreditCard size={18} /> },
  { id: "languages", label: "تعدد اللغات", icon: <Languages size={18} /> },
  { id: "currencies", label: "تعدد العملات", icon: <Coins size={18} /> },
  { id: "categories", label: "الأقسام", icon: <LayoutGrid size={18} /> },
  { id: "product_sections", label: "أقسام المنتجات", icon: <Layers size={18} /> },
  { id: "payment_methods", label: "طرق الدفع", icon: <Wallet size={18} /> },
  { id: "notifications", label: "إشعارات التلجرام", icon: <Bell size={18} /> },
  { id: "delivery_options", label: "خيارات التوصيل", icon: <Truck size={18} /> },
  { id: "homepage_banners", label: "بنرات الصفحة", icon: <Image size={18} /> },
  { id: "flash_sales", label: "عروض خاطفة", icon: <Zap size={18} /> },
  { id: "referral", label: "نظام الإحالة", icon: <Share2 size={18} /> },
  { id: "loyalty", label: "نقاط الولاء", icon: <Award size={18} /> },
  { id: "pwa", label: "تطبيق ويب (PWA)", icon: <Smartphone size={18} /> },
];

interface Props {
  settings: any;
  onChange: (id: string, value: boolean) => void;
}

export default function FeatureToggles({ settings, onChange }: Props) {
  return (
    <div className="bg-[#121212] p-6 rounded-2xl border border-gold/10 shadow-2xl">
      <h3 className="text-xl font-black text-gold mb-6 flex items-center gap-3">
        <Zap className="fill-gold" />
        إدارة ميزات المتجر
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f) => (
          <div 
            key={f.id}
            onClick={() => onChange(f.id, !settings[f.id])}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between
              ${settings[f.id] 
                ? "border-gold/50 bg-gold/5 text-gold shadow-[0_0_15px_rgba(255,215,0,0.1)]" 
                : "border-white/5 bg-white/5 text-gray-500 hover:border-white/20"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className={`${settings[f.id] ? "text-gold" : "text-gray-600"}`}>
                {f.icon}
              </span>
              <span className="text-sm font-bold">{f.label}</span>
            </div>

            {/* مفتاح التبديل (Switch) */}
            <div className={`w-10 h-5 rounded-full relative transition-colors ${settings[f.id] ? "bg-gold" : "bg-gray-700"}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings[f.id] ? "right-6" : "right-1"}`}>
                {settings[f.id] ? <Check size={8} className="text-gold m-0.5" /> : <X size={8} className="text-gray-700 m-0.5" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
