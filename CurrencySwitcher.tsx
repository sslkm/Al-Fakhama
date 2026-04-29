import React, { useContext } from "react";
import { CurrencyContext } from "../contexts/CurrencyContext";
import { Globe } from "lucide-react"; // أيقونة الكرة الأرضية

const options = [
  { code: "YER", label: "ريال يمني", symbol: "﷼" },
  { code: "SAR", label: "ريال سعودي", symbol: "SR" },
  { code: "USD", label: "دولار أمريكي", symbol: "$" }
];

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useContext(CurrencyContext);

  return (
    <div className="flex items-center gap-2 bg-black/20 p-1 rounded-full border border-gold/20 shadow-inner">
      <div className="p-2 text-gold/50">
        <Globe size={16} />
      </div>
      
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt.code}
            onClick={() => setCurrency(opt.code)}
            title={opt.label}
            className={`relative py-1.5 px-4 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2
              ${currency === opt.code 
                ? "bg-gold text-black shadow-[0_0_10px_rgba(255,215,0,0.4)] scale-105" 
                : "text-gold/60 hover:text-gold hover:bg-white/5"
              }`}
          >
            <span className="text-[10px] opacity-70">{opt.symbol}</span>
            {opt.code}
          </button>
        ))}
      </div>
    </div>
  );
}
