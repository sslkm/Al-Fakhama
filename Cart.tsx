import React, { useContext, useState } from "react";
import PaymentReceiptUpload from "./PaymentReceiptUpload";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext"; // للتحقق من حد الآجل
import { LocalizationContext } from "../contexts/LocalizationContext";
import { MapPin, creditCard, Upload, Send } from "lucide-react"; // أيقونات فخمة

const Cart = () => {
  const { cart, removeFromCart, totalPrice, checkout } = useContext(CartContext);
  const { profile } = useContext(AuthContext); // جلب بيانات العميل (الآجل والرصيد)
  const { t } = useContext(LocalizationContext);
  
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [receipt, setReceipt] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  // دالة لجلب الموقع الجغرافي بنقرة واحدة (GPS)
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        alert("تم تحديد موقعك بدقة بنجاح! 📍");
      });
    }
  };

  // التحقق من صلاحية الطلب قبل الإرسال
  const handleCheckout = () => {
    if (paymentMethod === "credit" && profile && totalPrice > (profile.credit_limit - profile.balance)) {
       alert("عذراً! لقد تجاوزت حد الآجل المسموح لك به.");
       return;
    }
    if (paymentMethod === "receipt" && !receipt) {
       alert("يرجى رفع صورة إيصال الدفع أولاً.");
       return;
    }
    
    checkout({ paymentMethod, receipt, location });
  };

  return (
    <div className="bg-[#121212] border-2 border-gold/30 p-6 rounded-2xl max-w-2xl mx-auto shadow-2xl">
      <h2 className="text-2xl font-bold text-gold mb-6 border-b border-gold/10 pb-4 flex items-center gap-2">
        {t('common.cart_title', 'سلة المشتريات')}
      </h2>

      {/* قائمة المنتجات */}
      <div className="space-y-4 mb-8">
        {cart.map((item: any) => (
          <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
            <div>
              <h4 className="font-bold text-white">{item.name}</h4>
              <p className="text-gold/70 text-sm">{item.price} ريال</p>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs hover:underline">حذف</button>
          </div>
        ))}
      </div>

      <div className="space-y-6 bg-white/5 p-5 rounded-xl border border-gold/20">
        {/* اختيار طريقة الدفع */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">{t('payment.method', 'طريقة الدفع')}</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setPaymentMethod("credit")}
              className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'credit' ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-gray-500'}`}
            >
              <creditCard size={20} />
              <span className="text-xs">حساب آجل</span>
            </button>
            <button 
              onClick={() => setPaymentMethod("receipt")}
              className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'receipt' ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-gray-500'}`}
            >
              <Upload size={20} />
              <span className="text-xs">تحميل إيصال</span>
            </button>
          </div>
        </div>

        {/* زر الموقع الجغرافي */}
        <button 
          onClick={handleGetLocation}
          className={`w-full py-3 rounded-lg border border-dashed flex items-center justify-center gap-2 transition-all ${location ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-gold/40 text-gold/60 hover:bg-gold/5'}`}
        >
          <MapPin size={18} />
          {location ? "تم تحديد الموقع" : "إرسال موقع التوصيل (GPS)"}
        </button>

        {/* نظام رفع الإيصال */}
        {paymentMethod === "receipt" && (
          <div className="mt-4 p-4 bg-black/40 rounded-lg">
             <PaymentReceiptUpload onUpload={setReceipt} />
          </div>
        )}

        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-gray-400 font-medium">الإجمالي:</span>
          <span className="text-2xl font-black text-gold">{totalPrice} ريال</span>
        </div>

        <button
          className="w-full bg-gold hover:bg-gold-dim text-black py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
          onClick={handleCheckout}
        >
          <Send size={20} />
          {t('common.checkout', 'إتمام وإرسال الطلب')}
        </button>
      </div>
    </div>
  );
};

export default Cart;
