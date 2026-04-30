import { useState, useEffect, useContext, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import Navbar from './components/Navbar'
import AdminDashboard from './pages/AdminDashboard'
// استيراد السياقات المنفصلة
import { CurrencyProvider, useCurrency } from './contexts/CurrencyContext'
import { CartProvider, useCart } from './contexts/CartContext'

// ==================== هوك مخصص لحساب إجمالي السلة بالعملة المختارة ====================
function useCartTotal() {
  const { cart } = useCart()
  const { convertPrice } = useCurrency()

  const totalUSD = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }, [cart])

  const totalConverted = useMemo(() => convertPrice(totalUSD), [totalUSD, convertPrice])

  return { totalUSD, totalConverted }
}

// ==================== المكون الرئيسي ====================
function App() {
  return (
    <CurrencyProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </CurrencyProvider>
  )
}

// ==================== محتوى التطبيق بعد توفير السياقات ====================
function AppContent() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        console.error('خطأ في جلب المنتجات:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-dark-gradient text-white font-body">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
              </div>
            ) : (
              <ProductGrid products={products} />
            )
          } />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ... أضف باقي المسارات هنا */}
        </Routes>
      </main>
    </div>
  )
}

// ==================== مكون عرض المنتجات ====================
function ProductGrid({ products }) {
  const { formatPrice } = useCurrency()
  const { addToCart } = useCart()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <div key={product.id} className="bg-jet-800 rounded-xl overflow-hidden border border-gold-900/20 shadow-gold hover:shadow-gold-lg transition-all duration-300">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          <div className="p-4">
            <h3 className="text-xl font-display font-bold text-white mb-2">{product.name}</h3>
            <p className="text-gold-400 text-lg font-semibold mb-4">
              {formatPrice(product.price)}
            </p>
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-gold-gradient text-jet-900 font-semibold py-2 px-4 rounded-lg hover:shadow-gold transition-all duration-200 transform hover:scale-[1.02]"
            >
              أضف للسلة
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App