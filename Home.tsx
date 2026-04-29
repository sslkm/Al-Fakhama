import React, { useContext, useState } from "react";
import { LocalizationContext } from "../contexts/LocalizationContext";
import HeroBanner from "../components/HeroBanner";
import ProductCatalog from "../components/ProductCatalog";
import Filters from "../components/Filters";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const { t } = useContext(LocalizationContext);
  
  // إضافة "حالة" للبحث لتصفية المنتجات فعلياً
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <main className="min-h-screen bg-luxury-dark pb-20">
      {/* البانر الرئيسي - يعطي الانطباع الأول للفخامة */}
      <HeroBanner 
        title={t('welcome_title')} 
        subtitle={t('welcome_subtitle')} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        {/* شريط البحث */}
        <div className="mb-6">
          <SearchBar onSearch={setSearchQuery} placeholder={t('search_placeholder')} />
        </div>

        {/* التصفية حسب الأقسام (Vapes, E-Liquids, etc.) */}
        <div className="mb-8">
          <Filters 
            activeCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory} 
          />
        </div>

        {/* عرض المنتجات - يمرر له البحث والقسم المختار */}
        <section>
          <h2 className="text-2xl font-bold text-gold mb-6 border-r-4 border-gold pr-3">
            {t('featured_products')}
          </h2>
          <ProductCatalog 
            searchQuery={searchQuery} 
            category={selectedCategory} 
          />
        </section>
      </div>
    </main>
  );
}
