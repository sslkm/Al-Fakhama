import React, { useContext } from "react";
import { CurrencyContext } from "../contexts/CurrencyContext";
import { Coins } from "lucide-react"; // أيقونة العملات

const currencies = [
  { code: "YER", label: "يمني", symbol: "﷼" },
  { code: "SAR", label: "سعودي", symbol: "SR" },
  { code: "USD", label: "دولار", symbol: "$" },
];

const CurrencyToggle = () => {
  const { currency, setCurrency, rates } = useContext(CurrencyContext);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* حاوية الأزرار */}
      <div className="flex bg-black/40 p-1 rounded-xl border border-gold/20 backdrop-blur-md">
        {currencies.map((c) => (
          <button
            key={c.code}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300
              ${currency === c.code 
                ? "bg-gold text-black shadow-lg scale-105" 
                : "text-gold/50 hover:text-gold hover:bg-white/5"
              }`}
            onClick={() => setCurrency(c.code)}
          >
            <span className="text-[10px] opacity-60">{c.symbol}</span>
            {c.code}
          </button>
        ))}
      </div>

      {/* عرض سعر الصرف الحالي (اختياري للأدمن) */}
      {currency !== "YER" && rates && (
        <div className="flex items-center gap-1 text-[10px] text-gold/40 italic">
          <Coins size={10} />
          <span>1 {currency} = {rates[currency]} ريال يمني</span>
        </div>
      )}
    </div>
  );
};

export default CurrencyToggle;
