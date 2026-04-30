import { motion } from 'framer-motion'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart, CartProduct } from '../contexts/CartContext'
import { useCurrency } from '../contexts/CurrencyContext'

interface ProductCardProps {
  product: {
    id: string | number
    name: string
    price: number // USD
    image_url: string
    description?: string
    rating?: number
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { formatPrice } = useCurrency()

  const handleAdd = () => {
    // تجهيز المنتج بصيغة CartProduct (بدون quantity لأن السياق يضيفها)
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group relative bg-jet-800 rounded-2xl overflow-hidden border border-gold-900/20 shadow-gold hover:shadow-gold-lg transition-shadow duration-500"
    >
      {/* صورة المنتج */}
      <div className="relative overflow-hidden h-56">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* طبقة شفافة تظهر عند التمرير */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* شارة التقييم إن وُجدت */}
        {product.rating && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-xs text-gold-400">
            <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
            {product.rating}
          </div>
        )}
      </div>

      {/* تفاصيل المنتج */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-display font-bold text-white line-clamp-1">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
        )}

        {/* السعر والزر */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-semibold text-gold-400">
            {formatPrice(product.price)}
          </span>
          
          {/* زر الإضافة للسلة */}
          <motion.button
            onClick={handleAdd}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-2 bg-gold-gradient text-jet-900 font-semibold py-2 px-4 rounded-lg overflow-hidden group/btn"
          >
            {/* تأثير التوهج */}
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-sm" />
            <ShoppingCart className="w-4 h-4 relative z-10" />
            <span className="relative z-10 text-sm">أضف للسلة</span>
          </motion.button>
        </div>
      </div>

      {/* إطار ذهبي رفيع يظهر عند التمرير */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-500/30 rounded-2xl pointer-events-none transition-all duration-500" />
    </motion.div>
  )
}