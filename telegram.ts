import { supabase } from "../api/supabaseClient";

// 1. إعدادات التلجرام (مباشرة للعمل عبر الهاتف)
const TELEGRAM_BOT_TOKEN = "8019503103:AAFy2DpPdoigCBm1VeID0dxGz2S1cwLN2X0";
const CHAT_ID = "7540274667";

/**
 * دالة إرسال الإشعارات الشاملة لتلجرام
 */
export async function sendTelegramNotification(msg, options = {}) {
  try {
    // إرسال النص الأساسي بتنسيق HTML
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `<b>🏪 إشعار من متجر الفخامة</b>\n${msg}`,
        parse_mode: "HTML"
      }),
    });

    // إرسال صورة الإيصال إذا وجدت
    if (options.imageUrl) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          chat_id: CHAT_ID, 
          photo: options.imageUrl, 
          caption: "🖼️ إيصال الدفع المرفق" 
        })
      });
    }

    // إرسال موقع GPS العميل (دبوس خريطة تفاعلي)
    if (options.location && options.location.lat) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendLocation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          latitude: options.location.lat,
          longitude: options.location.lng
        })
      });
    }
    return true;
  } catch (error) {
    console.error("Telegram Error:", error);
    return false;
  }
}

/**
 * دالة معالجة الطلب وحفظه في السحاب وإرسال الإشعارات
 */
export async function processOrder(orderData) {
  try {
    // 1. حفظ الطلب في جداول Supabase
    const { data, error } = await supabase
      .from("orders")
      .insert([{
        user_id: orderData.userId,
        total_amount: orderData.total,
        payment_status: orderData.paymentMethod === 'credit' ? 'debt' : 'pending',
        receipt_image: orderData.receiptUrl,
        location_data: orderData.location,
        status: 'new'
      }])
      .select()
      .single();

    if (error) throw error;

    // 2. تحديث مديونية العميل (نظام الآجل)
    if (orderData.paymentMethod === 'credit') {
      await supabase.rpc('increment_user_balance', { 
        user_id: orderData.userId, 
        amount: orderData.total 
      });
    }

    // 3. تجهيز رسالة التلجرام الاحترافية
    const telegramMsg = `
📦 <b>طلب جديد برقم: #${data.id}</b>
👤 <b>معرف العميل:</b> <code>${orderData.userId}</code>
💰 <b>الإجمالي:</b> ${orderData.total} ريال
💳 <b>طريقة الدفع:</b> ${orderData.paymentMethod === 'credit' ? '⚠️ حساب آجل (دين)' : '✅ كاش / تحويل'}
📍 <b>الموقع الجغرافي:</b> ${orderData.location ? 'مرفق أدناه 📍' : 'لم يتم تحديده'}
    `;

    // 4. إرسال كل شيء للتلجرام بنقرة واحدة
    await sendTelegramNotification(telegramMsg, {
      imageUrl: orderData.receiptUrl,
      location: orderData.location
    });

    return { success: true, data };
  } catch (err) {
    console.error("Processing Error:", err);
    return { success: false, error: err.message };
  }
}
