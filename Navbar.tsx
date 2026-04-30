import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Menu,
  X,
  User,
  ChevronDown,
} from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useCurrency } from '../contexts/CurrencyContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { currencies, activeCurrency, setActiveCurrency } = useCurrency()
  const location = useLocation()

  // Detect scroll for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setCurrencyMenuOpen(false)
  }, [location])

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-jet-900/95 backdrop-blur-xl shadow-2xl border-b border-gold-900/30'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* الشعار */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 bg-gold-gradient rounded-full flex items-center justify-center shadow-gold">
            <span className="text-jet-900 font-bold text-lg">D</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-display font-bold text-white leading-none">
              Dark & Gold
            </h1>
            <p className="text-xs text-gold-400 tracking-widest">STORE</p>
          </div>
        </Link>

        {/* روابط سطح المكتب */}
        <div className="hidden lg:flex items-center gap-8">
          <Link
            to="/"
            className="text-gray-300 hover:text-gold-400 transition-colors font-medium"
          >
            الرئيسية
          </Link>
          <Link
            to="/products"
            className="text-gray-300 hover:text-gold-400 transition-colors font-medium"
          >
            المنتجات
          </Link>
          <Link
            to="/about"
            className="text-gray-300 hover:text-gold-400 transition-colors font-medium"
          >
            عن المتجر
          </Link>
        </div>

        {/* أيقونات الجانب الأيمن */}
        <div className="flex items-center gap-4">
          {/* مبدل العملات */}
          <div className="relative">
            <button
              onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
              className="flex items-center gap-1 bg-jet-700/50 hover:bg-jet-600/50 backdrop-blur-md px-3 py-2 rounded-full border border-gold-900/30 transition text-white"
            >
              <span className="text-sm font-bold">{activeCurrency.code}</span>
              <ChevronDown className="w-4 h-4 text-gold-400" />
            </button>

            <AnimatePresence>
              {currencyMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 mt-2 w-40 bg-jet-800 border border-gold-900/40 rounded-xl shadow-2xl backdrop-blur-lg p-1 z-50"
                >
                  {currencies.map(currency => (
                    <button
                      key={currency.code}
                      onClick={() => {
                        setActiveCurrency(currency)
                        setCurrencyMenuOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition text-sm ${
                        activeCurrency.code === currency.code
                          ? 'bg-gold-500/20 text-gold-400'
                          : 'text-gray-300 hover:bg-jet-700 hover:text-white'
                      }`}
                    >
                      {currency.symbol} {currency.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* أيقونة السلة */}
          <Link to="/cart" className="relative group">
            <div className="relative p-2">
              <ShoppingBag className="w-6 h-6 text-white group-hover:text-gold-400 transition-colors" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gold-500 text-jet-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-gold"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </div>
          </Link>

          {/* زر القائمة في الموبايل */}
          <button
            className="lg:hidden p-2 text-white hover:text-gold-400 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="القائمة"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* القائمة المنسدلة للموبايل */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-jet-900/95 backdrop-blur-xl border-t border-gold-900/30 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-3">
              <Link
                to="/"
                className="text-white hover:text-gold-400 py-2 transition"
              >
                الرئيسية
              </Link>
              <Link
                to="/products"
                className="text-white hover:text-gold-400 py-2 transition"
              >
                المنتجات
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-gold-400 py-2 transition"
              >
                عن المتجر
              </Link>
              <Link
                to="/admin"
                className="text-gray-400 hover:text-gold-400 py-2 transition text-sm"
              >
                لوحة التحكم
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}