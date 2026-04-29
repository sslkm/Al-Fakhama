import React, { useState, useEffect, useContext } from "react";
import { ShoppingCart, Zap, Droplet, Package, Loader2 } from "lucide-react";
import CurrencyToggle from "./CurrencyToggle";
import { LocalizationContext } from "../contexts/LocalizationContext";
import { CartContext } from "../contexts/CartContext";
import { CurrencyContext } from "../contexts/CurrencyContext";
import { supabase } from "../api/supabaseClient";

const icons: any = {
  vapes: <Zap size={22} />,
  liquids: <Droplet size={22} />,
  accessories: <Package size={22} />,
};

const categories = [
  { key: "vapes", label: "أجهزة الفيب" },
  { key: "liquids", label: "النكهات" },
  { key: "accessories", label: "اكسسوارات" },
];

const ProductCatalog = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("vapes");
  
  const { t } = useContext(LocalizationContext);
  const { addToCart } = useContext(CartContext);
  const { currency, rates } = useContext(CurrencyContext);

  // جلب المنتجات من Supabase بناءً على القسم المختار
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", selectedCategory)
        .eq("is_active", true); // جلب المنتجات النشطة فقط

      if (!error && data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, [selectedCategory]);

  // دالة تحويل السعر بناءً على العملة المختارة
  const formatPrice = (priceInYer: number) => {
    const converted = priceInYer / (rates[currency] || 1);
    return `${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}`;
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <h1 className="text-3xl font-black text-gold border-r-4 border-gold pr-4">
          {t('shop.all_products', 'قائمة المنتجات')}
        </h1>
        <CurrencyToggle />
      </div>

      {/* شريط الأقسام */}
      <div className="flex flex-wrap gap-3 mb-10 justify-center">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-6 py-3 rounded-2xl border-2 flex items-center gap-3 font-bold transition-all duration-300
              ${selectedCategory === cat.key
                ? "border-gold bg-gold text-black shadow-[0_0_15px_rgba(255,215,0,0.3)] scale-105"
                : "border-white/10 text-gray-400 hover:border-gold/50 hover:text-gold"
            }`}
          >
            {icons[cat.key]} {cat.label}
          </button>
        ))}
      </div>

      {/* شبكة المنتجات */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gold" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col hover:border-gold/40 transition-all duration-500 hover:-translate-y-2 shadow-xl">
              <div className="relative overflow-hidden rounded-xl mb-4 bg-black/40">
                <img 
                  src={product.image_url} 
                  alt={product.name_ar}
                  className="w-full h-48 object-contain transition-transform duration-500 group-hover:scale-110" 
                />
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center font-bold text-red-500">نفذت الكمية</div>
                )}
              </div>

              <h2 className="text-xl font-bold mb-2 text-white group-hover:text-gold transition-colors">{product.name_ar}</h2>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{product.description_ar}</p>
              
              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xl font-black text-gold">
                  {formatPrice(product.price_yer)}
                </span>
                
                <button 
                  disabled={product.stock <= 0}
                  onClick={() => addToCart(product)}
                  className={`p-3 rounded-lg flex items-center gap-2 font-bold transition-all
                    ${product.stock > 0 
                      ? "bg-gold text-black hover:shadow-[0_0_15px_rgba(255,215,0,0.4)] active:scale-90" 
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"}
                  `}
                >
                  <ShoppingCart size={18} />
                  <span className="hidden sm:inline">إضافة</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
