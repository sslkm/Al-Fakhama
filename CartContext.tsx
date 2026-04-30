import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'
import { useCurrency } from './CurrencyContext'

// ---------- أنواع المنتجات ----------
export interface CartProduct {
  id: string | number
  name: string
  price: number // السعر بالدولار
  image_url: string
  quantity: number
}

interface CartContextType {
  cart: CartProduct[]
  addToCart: (product: Omit<CartProduct, 'quantity'>) => void
  removeFromCart: (productId: string | number) => void
  updateQuantity: (productId: string | number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPriceUSD: number
  totalPriceConverted: string
  totalPriceFormatted: string
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartProduct[]>(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        return JSON.parse(saved) as CartProduct[]
      } catch {
        return []
      }
    }
    return []
  })

  const { convertPrice, formatPrice } = useCurrency()

  // مزامنة السلة مع localStorage عند أي تغيير
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // إضافة منتج (مع زيادة الكمية إذا كان موجوداً)
  const addToCart = useCallback((product: Omit<CartProduct, 'quantity'>) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id)
      if (exists) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }, [])

  // حذف منتج كلياً
  const removeFromCart = useCallback((productId: string | number) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }, [])

  // تعديل الكمية (وإزالة المنتج إذا أصبحت الكمية أقل من 1)
  const updateQuantity = useCallback((productId: string | number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }, [removeFromCart])

  // تفريغ السلة بالكامل
  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  // إجمالي عدد القطع
  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  // الإجمالي بالدولار
  const totalPriceUSD = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }, [cart])

  // الإجمالي بالعملة المحولة (قيمة رقمية)
  const totalPriceConverted = useMemo(() => {
    return convertPrice(totalPriceUSD)
  }, [totalPriceUSD, convertPrice])

  // الإجمالي مع رمز العملة
  const totalPriceFormatted = useMemo(() => {
    return formatPrice(totalPriceUSD)
  }, [totalPriceUSD, formatPrice])

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPriceUSD,
    totalPriceConverted,
    totalPriceFormatted
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPriceUSD, totalPriceConverted, totalPriceFormatted])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// هوك مخصص لاستخدام السلة
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}