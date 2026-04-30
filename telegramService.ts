/**
 * خدمة التلجرام الفاخرة – Dark & Gold Store
 * ترسل إشعاراً للآدمن عند تقديم طلب جديد مع تفاصيل العميل،
 * الإجمالي بالعملات الثلاث، طريقة الدفع، صورة الإيصال، ورابط GPS مباشر.
 */

// ---------- types ----------
interface OrderDetails {
  customerName: string
  phoneNumber: string
  totalUSD: number
  paymentMethod: 'cash' | 'credit'  // كاش أو آجل
  receiptImageUrl?: string          // رابط صورة إيصال الدفع (إن وجد)
  gpsLocation?: { lat: number; lng: number }
}

// ---------- environment variables ----------
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID as string

const API_BASE = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

// أسعار الصرف الثابتة (يمكن مزامنتها مع CurrencyContext لاحقاً)
const RATES = {
  USD: 1,
  SAR: 3.75,
  YER: 535,
}

// ---------- helper: convert price ----------
const formatCurrency = (amount: number, symbol: string, rate: number): string => {
  const converted = (amount * rate).toFixed(2)
  return `${symbol}${converted}`
}

// ---------- helper: build HTML message ----------
const buildReceiptMessage = (order: OrderDetails): string => {
  const {
    customerName,
    phoneNumber,
    totalUSD,
    paymentMethod,
    gpsLocation,
  } = order

  const methodLabel = paymentMethod === 'cash' ? '💰 كاش' : '📋 آجل (مديونية)'
  const gpsLink = gpsLocation
    ? `<a href="https://www.google.com/maps?q=${gpsLocation.lat},${gpsLocation.lng}">📍 فتح الموقع في خرائط جوجل</a>`
    : '⛔ لم يُرسل الموقع'

  // بناء الإجمالي بالعملات الثلاث
  const totalUSDStr = formatCurrency(totalUSD, '$', RATES.USD)
  const totalSARStr = formatCurrency(totalUSD, '﷼', RATES.SAR)
  const totalYERStr = formatCurrency(totalUSD, '﷼', RATES.YER)

  return `
<b>🛍️ طلب جديد فاخر – Dark & Gold Store</b>

<b>👤 العميل:</b> ${customerName}
<b>📞 الهاتف:</b> <code>${phoneNumber}</code>

<b>💵 الإجمالي:</b>
  • <b>دولار:</b> ${totalUSDStr}
  • <b>ريال سعودي:</b> ${totalSARStr}
  • <b>ريال يمني:</b> ${totalYERStr}

<b>🧾 طريقة الدفع:</b> ${methodLabel}

<b>🗺️ الموقع:</b> ${gpsLink}

<i>🕒 ${new Date().toLocaleString('ar-YE')}</i>
  `.trim()
}

// ---------- main function: send order notification ----------
export async function sendOrderToTelegram(order: OrderDetails): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('❌ مفقود: VITE_TELEGRAM_BOT_TOKEN أو VITE_TELEGRAM_CHAT_ID')
    return false
  }

  const caption = buildReceiptMessage(order)

  try {
    // إذا وُجد رابط صورة الإيصال، نرسلها كصورة مع الكابشن
    if (order.receiptImageUrl) {
      const formData = new FormData()
      formData.append('chat_id', TELEGRAM_CHAT_ID)
      formData.append('photo', order.receiptImageUrl) // يدعم رابط مباشر
      formData.append('caption', caption)
      formData.append('parse_mode', 'HTML')

      const response = await fetch(`${API_BASE}/sendPhoto`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (!data.ok) throw new Error(data.description)
      console.log('✅ أُرسل الطلب مع الإيصال إلى التلجرام')
      return true
    }

    // بدون صورة: نرسل رسالة نصية فقط
    const response = await fetch(`${API_BASE}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: caption,
        parse_mode: 'HTML',
        disable_web_page_preview: false, // يُظهر Preview لرابط الخرائط
      }),
    })
    const data = await response.json()
    if (!data.ok) throw new Error(data.description)
    console.log('✅ أُرسل الطلب إلى التلجرام بنجاح (بدون صورة)')
    return true
  } catch (error: any) {
    console.error('❌ فشل إرسال رسالة التلجرام:', error.message)
    return false
  }
}

// ---------- دالة إرسال سريع لتنبيه المديونية (وغيرها) ----------
export async function sendDebtReminder(
  customerName: string,
  phone: string,
  remaining: number,
  currencyCode: 'USD' | 'SAR' | 'YER' = 'YER'
) {
  const symbol = currencyCode === 'USD' ? '$' : '﷼'
  const rate = RATES[currencyCode]
  const formatted = formatCurrency(remaining, symbol, rate)

  const message = `
<b>🔔 تذكير بالمبلغ المستحق</b>

<b>العميل:</b> ${customerName}
<b>الهاتف:</b> <code>${phone}</code>
<b>المبلغ المتبقي:</b> ${formatted}

<i>يُرجى المتابعة.</i>
  `.trim()

  try {
    await fetch(`${API_BASE}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    })
    console.log('✅ أُرسل تذكير المديونية')
  } catch (e) {
    console.error('فشل إرسال التذكير', e)
  }
}