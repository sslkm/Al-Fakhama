import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Send,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Truck,
  Ban,
  User,
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useCurrency } from '../contexts/CurrencyContext'
import { sendDebtReminder } from '../services/telegramService'

// ---------- Types ----------
interface Order {
  id: string
  created_at: string
  customer_name: string
  phone: string
  total_usd: number
  status: 'pending' | 'processing' | 'delivered'
  payment_method: 'cash' | 'credit'
  receipt_url?: string
}

interface Debtor {
  id: string
  customer_name: string
  phone: string
  remaining_usd: number
  last_order_date: string
}

interface FeatureToggle {
  id: string
  feature_name: string
  enabled: boolean
}

// ---------- Animation variants ----------
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function AdminDashboard() {
  const { activeCurrency, formatPrice } = useCurrency()

  // ---------- States ----------
  const [orders, setOrders] = useState<Order[]>([])
  const [debtors, setDebtors] = useState<Debtor[]>([])
  const [toggles, setToggles] = useState<FeatureToggle[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: ordersData },
          { data: debtorsData },
          { data: togglesData },
        ] = await Promise.all([
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('debtors').select('*').order('remaining_usd', { ascending: false }),
          supabase.from('feature_toggles').select('*'),
        ])

        setOrders(ordersData || [])
        setDebtors(debtorsData || [])
        setToggles(togglesData || [])
      } catch (err) {
        console.error('خطأ في تحميل بيانات لوحة التحكم:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ---------- Derived stats ----------
  const totalSalesUSD = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total_usd, 0)

  const totalDebtUSD = debtors.reduce((sum, d) => sum + d.remaining_usd, 0)

  const pendingOrders = orders.filter(o => o.status === 'pending')
  const processingOrders = orders.filter(o => o.status === 'processing')
  const deliveredOrders = orders.filter(o => o.status === 'delivered')

  // ---------- Handlers ----------
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (!error) {
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    }
  }

  const toggleFeature = async (toggleId: string, enabled: boolean) => {
    const { error } = await supabase
      .from('feature_toggles')
      .update({ enabled })
      .eq('id', toggleId)

    if (!error) {
      setToggles(prev =>
        prev.map(t => (t.id === toggleId ? { ...t, enabled } : t))
      )
    }
  }

  const sendWhatsAppReminder = (phone: string, name: string, remaining: number) => {
    const formatted = formatPrice(remaining)
    const message = `مرحباً ${name}، نود تذكيرك بالمبلغ المتبقي المستحق: ${formatted}. يُرجى التواصل للتسديد.`
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    )
  }

  // ---------- UI ----------
  return (
    <motion.div
      className="min-h-screen bg-jet p-4 md:p-8 space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* العنوان */}
      <motion.h1
        className="text-3xl md:text-4xl font-display font-bold text-white mb-6"
        variants={item}
      >
        لوحة التحكم <span className="gold-text">Dark & Gold</span>
      </motion.h1>

      {/* ========== بطاقات الإحصائيات ========== */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
      >
        {/* إجمالي المبيعات */}
        <motion.div
          className="bg-jet-800 border border-gold-900/30 rounded-2xl p-6 shadow-gold flex items-center gap-4"
          variants={item}
        >
          <div className="p-3 bg-gold-500/20 rounded-full">
            <DollarSign className="text-gold-500 w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">إجمالي المبيعات</p>
            <p className="text-2xl font-bold text-white">
              {formatPrice(totalSalesUSD)}
            </p>
          </div>
        </motion.div>

        {/* الديون */}
        <motion.div
          className="bg-jet-800 border border-gold-900/30 rounded-2xl p-6 shadow-gold flex items-center gap-4"
          variants={item}
        >
          <div className="p-3 bg-red-500/20 rounded-full">
            <AlertTriangle className="text-red-400 w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">الديون المستحقة</p>
            <p className="text-2xl font-bold text-white">
              {formatPrice(totalDebtUSD)}
            </p>
          </div>
        </motion.div>

        {/* طلبات قيد التنفيذ */}
        <motion.div
          className="bg-jet-800 border border-gold-900/30 rounded-2xl p-6 shadow-gold flex items-center gap-4"
          variants={item}
        >
          <div className="p-3 bg-blue-500/20 rounded-full">
            <Clock className="text-blue-400 w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">قيد التنفيذ</p>
            <p className="text-2xl font-bold text-white">{processingOrders.length}</p>
          </div>
        </motion.div>

        {/* طلبات مكتملة */}
        <motion.div
          className="bg-jet-800 border border-gold-900/30 rounded-2xl p-6 shadow-gold flex items-center gap-4"
          variants={item}
        >
          <div className="p-3 bg-green-500/20 rounded-full">
            <CheckCircle className="text-green-400 w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">تم التوصيل</p>
            <p className="text-2xl font-bold text-white">{deliveredOrders.length}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* ========== جدول إدارة الطلبات ========== */}
      <motion.section variants={item} className="space-y-4">
        <h2 className="text-2xl font-display font-semibold text-white">
          📋 الطلبات الواردة
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gold-900/30">
          <table className="w-full text-sm text-right">
            <thead className="bg-jet-700 text-gold-400 uppercase">
              <tr>
                <th className="px-4 py-3">العميل</th>
                <th className="px-4 py-3">الإجمالي</th>
                <th className="px-4 py-3">الدفع</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-jet-600 text-white">
              {orders.map(order => (
                <tr key={order.id} className="bg-jet-800 hover:bg-jet-700 transition-colors">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-gold-500" />
                    {order.customer_name}
                  </td>
                  <td className="px-4 py-3 font-mono text-gold-400">
                    {formatPrice(order.total_usd)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.payment_method === 'cash'
                          ? 'bg-green-900/40 text-green-400'
                          : 'bg-red-900/40 text-red-400'
                      }`}
                    >
                      {order.payment_method === 'cash' ? 'كاش' : 'آجل'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'pending'
                          ? 'bg-yellow-900/40 text-yellow-400'
                          : order.status === 'processing'
                          ? 'bg-blue-900/40 text-blue-400'
                          : 'bg-green-900/40 text-green-400'
                      }`}
                    >
                      {order.status === 'pending'
                        ? 'قيد المراجعة'
                        : order.status === 'processing'
                        ? 'قيد التنفيذ'
                        : 'تم التوصيل'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {order.status !== 'processing' && order.status !== 'delivered' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          className="p-1 bg-blue-600/20 hover:bg-blue-600/40 rounded text-blue-400 transition"
                          title="قيد التنفيذ"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      )}
                      {order.status !== 'delivered' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="p-1 bg-green-600/20 hover:bg-green-600/40 rounded text-green-400 transition"
                          title="تم التوصيل"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'pending')}
                          className="p-1 bg-red-600/20 hover:bg-red-600/40 rounded text-red-400 transition"
                          title="إلغاء"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    لا توجد طلبات بعد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ========== جدول المديونية ========== */}
      <motion.section variants={item} className="space-y-4">
        <h2 className="text-2xl font-display font-semibold text-white">
          📊 المديونية
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gold-900/30">
          <table className="w-full text-sm text-right">
            <thead className="bg-jet-700 text-gold-400 uppercase">
              <tr>
                <th className="px-4 py-3">العميل</th>
                <th className="px-4 py-3">الهاتف</th>
                <th className="px-4 py-3">المتبقي</th>
                <th className="px-4 py-3">تذكير</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-jet-600 text-white">
              {debtors.map(debtor => (
                <tr key={debtor.id} className="bg-jet-800 hover:bg-jet-700 transition-colors">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-gold-500" />
                    {debtor.customer_name}
                  </td>
                  <td className="px-4 py-3 font-mono">{debtor.phone}</td>
                  <td className="px-4 py-3 text-red-400 font-bold">
                    {formatPrice(debtor.remaining_usd)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        sendWhatsAppReminder(
                          debtor.phone,
                          debtor.customer_name,
                          debtor.remaining_usd
                        )
                      }
                      className="flex items-center gap-1 px-3 py-1 bg-green-700/20 hover:bg-green-700/40 text-green-400 rounded-lg text-xs transition"
                    >
                      <Send className="w-3 h-3" />
                      واتساب
                    </button>
                  </td>
                </tr>
              ))}
              {debtors.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    لا توجد ديون حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ========== لوحة تفعيل الميزات ========== */}
      <motion.section variants={item} className="space-y-4">
        <h2 className="text-2xl font-display font-semibold text-white">
          ⚙️ تفعيل / تعطيل الميزات
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {toggles.map(toggle => (
            <div
              key={toggle.id}
              className="bg-jet-800 border border-gold-900/30 p-4 rounded-xl flex items-center justify-between"
            >
              <span className="text-white font-medium">{toggle.feature_name}</span>
              <button
                onClick={() => toggleFeature(toggle.id, !toggle.enabled)}
                className={`p-1 rounded-full transition ${
                  toggle.enabled ? 'text-gold-400' : 'text-gray-500'
                }`}
              >
                {toggle.enabled ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>
          ))}
          {toggles.length === 0 && (
            <p className="text-gray-500">لا توجد ميزات قابلة للتفعيل</p>
          )}
        </div>
      </motion.section>

      {/* زر تحديث يدوي */}
      <motion.div variants={item} className="flex justify-center">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-jet-700 hover:bg-jet-600 text-gold-400 px-6 py-3 rounded-xl transition border border-gold-900/50"
        >
          <RefreshCw className="w-4 h-4" />
          تحديث البيانات
        </button>
      </motion.div>
    </motion.div>
  )
}